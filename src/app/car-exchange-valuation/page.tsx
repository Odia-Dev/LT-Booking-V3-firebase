"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db, storage, isConfigured } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";
import imageCompression from "browser-image-compression";
import { 
  Car, User, Phone, Calendar, Gauge, Image as ImageIcon,
  Camera, UploadCloud, CheckCircle2, ArrowRight, Loader2, ArrowLeft, ShieldAlert
} from "lucide-react";

export default function CarExchangeValuationPage() {
  const { user } = useAuth();

  // Workflow steps: 1 = Lead Form, 2 = optional image upload, 3 = success screen
  const [step, setStep] = useState(1);
  const [docId, setDocId] = useState("");

  // Step 1 States (Personal & Vehicle Info)
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [regYear, setRegYear] = useState("");
  const [kmsDriven, setKmsDriven] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2 States (Images)
  const [images, setImages] = useState<{
    front: File | null;
    back: File | null;
    interior: File | null;
    rc: File | null;
  }>({
    front: null,
    back: null,
    interior: null,
    rc: null,
  });

  // Preview States
  const [previews, setPreviews] = useState<{
    front: string;
    back: string;
    interior: string;
    rc: string;
  }>({
    front: "",
    back: "",
    interior: "",
    rc: "",
  });

  // Request States
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // 3-Layer Security States
  const [botField, setBotField] = useState(""); // Honeypot Field
  const [cooldownMessage, setCooldownMessage] = useState(""); // 24h Cooldown State

  // Prefill user's display name if authenticated and check cooldown
  useEffect(() => {
    if (user) {
      setFullName(user.displayName || "");
    }

    const lastSubmit = localStorage.getItem("last_exchange_submit");
    if (lastSubmit) {
      const diff = Date.now() - parseInt(lastSubmit, 10);
      if (diff < 24 * 60 * 60 * 1000) {
        setCooldownMessage("You have recently submitted a request. Our executive will call you within 24 hours.");
      }
    }
  }, [user]);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previews]);

  // Handle Step 1 Submission
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Layer 1: Honeypot Validation
    if (botField) {
      console.warn("Spam Bot Detected via Honeypot.");
      setDocId(`exch-lead-bot-${Date.now()}`);
      setStep(2);
      return;
    }

    // Layer 2: Cooldown Client-side Block
    const lastSubmit = localStorage.getItem("last_exchange_submit");
    if (lastSubmit) {
      const diff = Date.now() - parseInt(lastSubmit, 10);
      if (diff < 24 * 60 * 60 * 1000) {
        setError("You have recently submitted a request. Our executive will call you within 24 hours.");
        return;
      }
    }

    // Validations
    if (!carMake.trim() || !carModel.trim() || !regYear || !kmsDriven || !fullName.trim() || !phone.trim()) {
      setError("Please fill out all the fields in Step 1.");
      return;
    }

    const cleanedPhone = phone.trim();
    if (!/^\d{10}$/.test(cleanedPhone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);

    const leadData = {
      carMake: carMake.trim(),
      carModel: carModel.trim(),
      registrationYear: parseInt(regYear, 10),
      kmsDriven: parseInt(kmsDriven, 10),
      fullName: fullName.trim(),
      phone: cleanedPhone,
      status: "New Lead",
      userUid: user?.uid || "guest",
      customerEmail: user?.email || "guest@guest.com",
      authUserId: user?.uid || null,
      authEmail: user?.email || null,
      submittedAt: new Date().toISOString(),
      images: [] // Empty to begin with
    };

    try {
      // Layer 3: Firebase / LocalStorage Duplicate Check (7 Days)
      let duplicateId = "";
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      if (isConfigured) {
        const q = query(
          collection(db, "exchange_leads"),
          where("phone", "==", cleanedPhone)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.submittedAt && new Date(data.submittedAt) >= sevenDaysAgo) {
            duplicateId = doc.id;
          }
        });
      } else {
        const existingRaw = localStorage.getItem("laxmi_toyota_exchange_leads");
        const list = existingRaw ? JSON.parse(existingRaw) : [];
        const cutOffTime = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const dup = list.find((item: any) => item.phone === cleanedPhone && new Date(item.submittedAt).getTime() >= cutOffTime);
        if (dup) {
          duplicateId = dup.id;
        }
      }

      if (duplicateId) {
        console.log("Duplicate Lead detected. Updating existing record.");
        if (isConfigured) {
          await updateDoc(doc(db, "exchange_leads", duplicateId), {
            lastContactedAt: new Date().toISOString(),
            status: "New Lead (Duplicate)"
          });
        } else {
          const existingRaw = localStorage.getItem("laxmi_toyota_exchange_leads");
          if (existingRaw) {
            const list = JSON.parse(existingRaw);
            const index = list.findIndex((i: any) => i.id === duplicateId);
            if (index !== -1) {
              list[index].lastContactedAt = new Date().toISOString();
              list[index].status = "New Lead (Duplicate)";
              localStorage.setItem("laxmi_toyota_exchange_leads", JSON.stringify(list));
            }
          }
        }
        
        setDocId(duplicateId);
        localStorage.setItem("last_exchange_submit", Date.now().toString());
        setStep(2);
        return;
      }

      let createdDocId = "";
      if (isConfigured) {
        // Save directly to Firestore
        const docRef = await addDoc(collection(db, "exchange_leads"), leadData);
        createdDocId = docRef.id;
      } else {
        // Fallback for mock local sandbox environments
        const existingRaw = localStorage.getItem("laxmi_toyota_exchange_leads");
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        createdDocId = `exch-lead-${Date.now()}`;
        existing.push({ id: createdDocId, ...leadData });
        localStorage.setItem("laxmi_toyota_exchange_leads", JSON.stringify(existing));
      }
      setDocId(createdDocId);
      localStorage.setItem("last_exchange_submit", Date.now().toString());
      setStep(2);
    } catch (err: any) {
      console.error("Step 1 Lead Submission Error:", err);
      setError(`Failed to log lead: ${err.message || err.toString()}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Image Selection Handler
  const handleImageChange = (key: keyof typeof images, file: File | null) => {
    if (!file) return;

    // Validate if it is actually an image
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setImages(prev => ({ ...prev, [key]: file }));
    
    // Revoke previous preview URL if it exists
    if (previews[key]) {
      URL.revokeObjectURL(previews[key]);
    }
    
    // Generate new preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreviews(prev => ({ ...prev, [key]: previewUrl }));
  };

  // Handle Step 2 Submission (Compress and Upload Images)
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Verify if at least one image is selected, otherwise they can skip
    const selectedCount = Object.values(images).filter(Boolean).length;
    if (selectedCount === 0) {
      setStep(3);
      return;
    }

    setIsUploading(true);

    try {
      const urls: string[] = [];

      for (const [key, file] of Object.entries(images)) {
        if (!file) continue;

        // Compress the image down before uploading
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        };
        const compressedFile = await imageCompression(file, options);

        if (isConfigured) {
          // Upload to Firebase Storage
          const fileName = `${key}_${Date.now()}_${file.name}`;
          const storageRef = ref(storage, `exchange_leads/${docId}/${fileName}`);
          const snapshot = await uploadBytes(storageRef, compressedFile);
          const downloadUrl = await getDownloadURL(snapshot.ref);
          urls.push(downloadUrl);
        } else {
          // Create Mock URL locally
          urls.push(URL.createObjectURL(compressedFile));
        }
      }

      // Update lead document with the uploaded/processed image URLs
      if (isConfigured) {
        await updateDoc(doc(db, "exchange_leads", docId), {
          images: urls,
          status: "Lead with Media"
        });
      } else {
        const existingRaw = localStorage.getItem("laxmi_toyota_exchange_leads");
        if (existingRaw) {
          const existing = JSON.parse(existingRaw);
          const index = existing.findIndex((l: any) => l.id === docId);
          if (index !== -1) {
            existing[index].images = urls;
            existing[index].status = "Lead with Media";
            localStorage.setItem("laxmi_toyota_exchange_leads", JSON.stringify(existing));
          }
        }
      }

      setStep(3);
    } catch (err: any) {
      console.error("Step 2 Upload Error:", err);
      setError(`Failed to upload media: ${err.message || err.toString()}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Skip Step 2 Handler
  const handleSkipStep2 = () => {
    setStep(3);
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white border border-slate-200/80 p-8 rounded-2xl text-center space-y-6 shadow-xl shadow-slate-200/50 animate-fade-in">
          <div className="h-16 w-16 bg-[#EB0A1E]/10 rounded-full flex items-center justify-center mx-auto text-[#EB0A1E] border border-[#EB0A1E]/20">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Valuation Initiated</h2>
            <p className="text-xs text-slate-500 font-medium">Lead Reference: <span className="font-mono text-slate-800 font-bold">{docId}</span></p>
          </div>

          <div className="text-slate-600 text-sm space-y-4 border-y border-slate-100 py-5 text-left leading-relaxed">
            <p>
              Thank you, <span className="font-semibold text-slate-900">{fullName}</span>. Your vehicle details have been securely recorded.
            </p>
            <p className="text-xs text-slate-500">
              Our **Toyota U-Trust** certified exchange evaluator will assess your vehicle parameters and contact you shortly with a guaranteed trade-in valuation and options for upgrading to your new Toyota.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="block w-full text-center text-xs font-bold uppercase tracking-widest bg-slate-900 text-white py-3.5 rounded-xl hover:bg-[#EB0A1E] transition-all duration-200 shadow-md shadow-slate-900/10"
            >
              Return to Showroom
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center px-4 py-16">
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/80">
        
        {/* Left Column: Premium Exchange Intro */}
        <div className="md:col-span-5 bg-slate-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-red-950/40 via-transparent to-transparent opacity-60 pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <Link href="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            
            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-[#EB0A1E]/10 border border-[#EB0A1E]/20 px-3 py-1 rounded">
                Toyota U-Trust
              </span>
              <h1 className="text-3xl font-black tracking-tight pt-2">
                Vehicle <br/>Exchange
              </h1>
              <p className="text-slate-400 text-xs leading-relaxed pt-1">
                Upgrade your lifestyle. Exchange your existing car of any brand for a brand-new Toyota with transparent valuation.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-5 pt-10 border-t border-slate-800/80">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4.5 h-4.5 text-[#EB0A1E]" />
              <p className="text-xs text-slate-300 font-medium">Free Doorstep Inspection</p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4.5 h-4.5 text-[#EB0A1E]" />
              <p className="text-xs text-slate-300 font-medium">Best Resale Value Guarantee</p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4.5 h-4.5 text-[#EB0A1E]" />
              <p className="text-xs text-slate-300 font-medium">Hassle-Free RC Transfer</p>
            </div>
          </div>
        </div>

        {/* Right Column: Workflow forms */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          
          {/* Progress Indicators */}
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${step === 1 ? "bg-[#EB0A1E] text-white" : "bg-slate-100 text-slate-500"}`}>
              Step 1: Vehicle Specs
            </span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${step === 2 ? "bg-[#EB0A1E] text-white" : "bg-slate-100 text-slate-500"}`}>
              Step 2: Media uploads
            </span>
          </div>

          {step === 1 ? (
            cooldownMessage ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center space-y-4 shadow-sm my-6">
                <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">Valuation Request Pending</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{cooldownMessage}</p>
              </div>
            ) : (
              /* STEP 1 FORM */
              <form onSubmit={handleStep1Submit} className="space-y-5">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Exchange Lead Form</h2>
                  <p className="text-slate-500 text-xs mt-1">Please provide basic vehicle specs to estimate trade value.</p>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-lg text-xs font-semibold">
                    {error}
                  </div>
                )}

                {/* Honeypot Field */}
                <input
                  type="text"
                  name="bot_field_company"
                  value={botField}
                  onChange={(e) => setBotField(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="opacity-0 absolute -z-10 h-0 w-0"
                />

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Your Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <User className="h-4 w-4" />
                    </span>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter name"
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="phone" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <Phone className="h-4 w-4" />
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit number"
                      maxLength={10}
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                {/* Make */}
                <div className="space-y-1.5">
                  <label htmlFor="make" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Car Make
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <Car className="h-4 w-4" />
                    </span>
                    <input
                      id="make"
                      type="text"
                      value={carMake}
                      onChange={(e) => setCarMake(e.target.value)}
                      placeholder="e.g. Maruti, Hyundai"
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Model */}
                <div className="space-y-1.5">
                  <label htmlFor="model" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Car Model
                  </label>
                  <input
                    id="model"
                    type="text"
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    placeholder="e.g. Swift, Creta"
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Registration & Mileage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Year */}
                <div className="space-y-1.5">
                  <label htmlFor="year" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Registration Year
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <Calendar className="h-4 w-4" />
                    </span>
                    <input
                      id="year"
                      type="number"
                      min="2000"
                      max={new Date().getFullYear()}
                      value={regYear}
                      onChange={(e) => setRegYear(e.target.value)}
                      placeholder="Year"
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* KMs */}
                <div className="space-y-1.5">
                  <label htmlFor="kms" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    KMs Driven
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <Gauge className="h-4 w-4" />
                    </span>
                    <input
                      id="kms"
                      type="number"
                      min="0"
                      value={kmsDriven}
                      onChange={(e) => setKmsDriven(e.target.value)}
                      placeholder="Mileage"
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#EB0A1E] py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-red-500/10 hover:bg-red-700 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving Details...
                  </>
                ) : (
                  <>
                    Proceed to Valuation <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) ) : (
            /* STEP 2 IMAGES UPLOAD (OPTIONAL) */
            <form onSubmit={handleStep2Submit} className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Precision Valuation</h2>
                <p className="text-slate-500 text-xs mt-1">Upload photos of your car to lock in a higher, certified valuation (optional).</p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-lg text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Grid of 4 uploads */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Front View */}
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">1. Front View</span>
                  <label className="relative border border-dashed border-slate-200 hover:border-[#EB0A1E] bg-slate-50 focus-within:bg-white rounded-xl h-28 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageChange("front", e.target.files ? e.target.files[0] : null)}
                      className="sr-only"
                    />
                    {previews.front ? (
                      <img src={previews.front} alt="Front preview" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <div className="text-center p-3 text-slate-400 group-hover:text-[#EB0A1E] transition-colors">
                        <Camera className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-[10px] font-semibold block">Front Exterior</span>
                      </div>
                    )}
                  </label>
                </div>

                {/* Back View */}
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">2. Back View</span>
                  <label className="relative border border-dashed border-slate-200 hover:border-[#EB0A1E] bg-slate-50 focus-within:bg-white rounded-xl h-28 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageChange("back", e.target.files ? e.target.files[0] : null)}
                      className="sr-only"
                    />
                    {previews.back ? (
                      <img src={previews.back} alt="Back preview" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <div className="text-center p-3 text-slate-400 group-hover:text-[#EB0A1E] transition-colors">
                        <Camera className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-[10px] font-semibold block">Rear Exterior</span>
                      </div>
                    )}
                  </label>
                </div>

                {/* Interior View */}
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">3. Interior View</span>
                  <label className="relative border border-dashed border-slate-200 hover:border-[#EB0A1E] bg-slate-50 focus-within:bg-white rounded-xl h-28 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageChange("interior", e.target.files ? e.target.files[0] : null)}
                      className="sr-only"
                    />
                    {previews.interior ? (
                      <img src={previews.interior} alt="Interior preview" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <div className="text-center p-3 text-slate-400 group-hover:text-[#EB0A1E] transition-colors">
                        <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-[10px] font-semibold block">Dashboard & Seats</span>
                      </div>
                    )}
                  </label>
                </div>

                {/* RC / Speedometer */}
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">4. RC Book / Speedo</span>
                  <label className="relative border border-dashed border-slate-200 hover:border-[#EB0A1E] bg-slate-50 focus-within:bg-white rounded-xl h-28 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageChange("rc", e.target.files ? e.target.files[0] : null)}
                      className="sr-only"
                    />
                    {previews.rc ? (
                      <img src={previews.rc} alt="RC preview" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <div className="text-center p-3 text-slate-400 group-hover:text-[#EB0A1E] transition-colors">
                        <UploadCloud className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-[10px] font-semibold block">Speedometer / RC</span>
                      </div>
                    )}
                  </label>
                </div>

              </div>

              {/* Upload Action buttons */}
              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full rounded-xl bg-[#EB0A1E] py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-red-500/10 hover:bg-red-700 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Compressing & Uploading...
                    </>
                  ) : (
                    <>
                      Upload Media & Submit
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleSkipStep2}
                  disabled={isUploading}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 py-3.5 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-all duration-200"
                >
                  Skip & Finish
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
