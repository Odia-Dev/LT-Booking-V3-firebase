"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db, storage, isConfigured } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";
import imageCompression from "browser-image-compression";
import { 
  Car, User, Phone, Calendar, Gauge, Image as ImageIcon,
  Camera, UploadCloud, CheckCircle2, ArrowRight, Loader2, ArrowLeft, BadgeCheck
} from "lucide-react";
import PhoneVerifier from "@/components/PhoneVerifier";

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

  // Phone OTP States
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [verifiedPhoneNumber, setVerifiedPhoneNumber] = useState("");
  const [showVerifier, setShowVerifier] = useState(false);

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

  // Prefill details and check OTP verification status on load
  useEffect(() => {
    if (user) {
      setFullName(user.displayName || "");
    }

    const checkVerification = async () => {
      if (!user) return;
      if (isConfigured) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists() && userDoc.data().isPhoneVerified) {
            setIsPhoneVerified(true);
            setVerifiedPhoneNumber(userDoc.data().phone || "");
            if (userDoc.data().phone) {
              setPhone(userDoc.data().phone.replace("+91", ""));
            }
          }
        } catch (err) {
          console.error("Error loading phone verification state:", err);
        }
      } else {
        const mockUsersRaw = localStorage.getItem("laxmi_toyota_users") || "{}";
        const mockUsers = JSON.parse(mockUsersRaw);
        if (mockUsers[user.uid] && mockUsers[user.uid].isPhoneVerified) {
          setIsPhoneVerified(true);
          setVerifiedPhoneNumber(mockUsers[user.uid].phone || "");
          if (mockUsers[user.uid].phone) {
            setPhone(mockUsers[user.uid].phone.replace("+91", ""));
          }
        }
      }
    };
    checkVerification();
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

  const saveLeadData = async (verifiedPhone: string) => {
    setIsSubmitting(true);
    const leadData = {
      carMake: carMake.trim(),
      carModel: carModel.trim(),
      registrationYear: parseInt(regYear, 10),
      kmsDriven: parseInt(kmsDriven, 10),
      fullName: fullName.trim(),
      phone: verifiedPhone,
      status: "New Lead",
      userUid: user?.uid || "guest",
      customerEmail: user?.email || "guest@guest.com",
      authUserId: user?.uid || null,
      authEmail: user?.email || null,
      submittedAt: new Date().toISOString(),
      images: [] // Empty to begin with
    };

    try {
      let createdDocId = "";
      if (isConfigured) {
        const docRef = await addDoc(collection(db, "exchange_leads"), leadData);
        createdDocId = docRef.id;
      } else {
        const existingRaw = localStorage.getItem("laxmi_toyota_exchange_leads");
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        createdDocId = `exch-lead-${Date.now()}`;
        existing.push({ id: createdDocId, ...leadData });
        localStorage.setItem("laxmi_toyota_exchange_leads", JSON.stringify(existing));
      }
      setDocId(createdDocId);
      setStep(2);
    } catch (err: any) {
      console.error("Step 1 Lead Submission Error:", err);
      setError(`Failed to log lead: ${err.message || err.toString()}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Step 1 Submission
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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

    const fullPhone = `+91${cleanedPhone}`;

    if (user && isPhoneVerified) {
      // Pre-verified, bypass OTP
      await saveLeadData(fullPhone);
    } else {
      // Trigger OTP Modal
      setShowVerifier(true);
    }
  };

  // Image Selection Handler
  const handleImageChange = (key: keyof typeof images, file: File | null) => {
    if (!file) return;

    // Validate size (limit to 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image is too large. Please select a file smaller than 10MB.");
      return;
    }

    // Set preview
    const previewUrl = URL.createObjectURL(file);
    setPreviews((prev) => ({ ...prev, [key]: previewUrl }));
    setImages((prev) => ({ ...prev, [key]: file }));
  };

  // Handle Step 2 Submission (Image Upload & Compression)
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsUploading(true);

    const activeUploads = Object.entries(images).filter(([_, file]) => file !== null) as [string, File][];

    if (activeUploads.length === 0) {
      // No images selected, transition straight to success
      setStep(3);
      setIsUploading(false);
      return;
    }

    try {
      const urls: string[] = [];

      // Loop and compress each selected image
      for (const [key, file] of activeUploads) {
        console.log(`Compressing ${key} view...`);
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);
        console.log(`Original Size: ${(file.size / 1024 / 1024).toFixed(2)} MB, Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);

        if (isConfigured) {
          // Upload to Firebase Storage
          const storageRef = ref(storage, `exchange_leads/${docId}/${key}_${Date.now()}.jpg`);
          const snapshot = await uploadBytes(storageRef, compressedFile);
          const downloadUrl = await getDownloadURL(snapshot.ref);
          urls.push(downloadUrl);
        } else {
          // Local sandbox mock URL
          urls.push(URL.createObjectURL(compressedFile));
        }
      }

      // Update lead document with uploaded image URLs
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
            <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
              Verification: 
              <span className="text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded flex items-center gap-0.5">
                <BadgeCheck className="w-3.5 h-3.5 fill-blue-100" /> Phone OTP Verified
              </span>
            </p>
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
                      placeholder="Enter mobile"
                      maxLength={10}
                      required
                      disabled={isPhoneVerified}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 focus:outline-none transition-all disabled:opacity-70 disabled:bg-slate-100"
                    />
                    {isPhoneVerified && (
                      <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-500 text-xs font-bold gap-1 pointer-events-none">
                        <BadgeCheck className="w-4 h-4 fill-blue-50 font-bold" /> Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Vehicle specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Make */}
                <div className="space-y-1.5">
                  <label htmlFor="make" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Car Manufacturer / Make
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
                      placeholder="e.g. Maruti Suzuki, Hyundai"
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
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <Car className="h-4 w-4" />
                    </span>
                    <input
                      id="model"
                      type="text"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      placeholder="e.g. Swift, i20"
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Year & KMs */}
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
                ) : isPhoneVerified ? (
                  <>
                    Instant Valuation Request <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Verify Mobile & Value Car <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
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

              {/* Grid of upload fields */}
              <div className="grid grid-cols-2 gap-4">
                {(["front", "back", "interior", "rc"] as const).map((key) => (
                  <div key={key} className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider capitalize">
                      {key} View
                    </label>
                    <div className="relative border-2 border-dashed border-slate-200 rounded-2xl h-36 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 hover:border-[#EB0A1E]/50 transition-all cursor-pointer overflow-hidden group">
                      {previews[key] ? (
                        <div className="absolute inset-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={previews[key]}
                            alt={`${key} preview`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                            <Camera className="w-4 h-4" /> Change Photo
                          </div>
                        </div>
                      ) : (
                        <div className="text-center space-y-1 p-2">
                          <UploadCloud className="w-6 h-6 text-slate-400 mx-auto group-hover:text-[#EB0A1E] transition-colors" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Upload Image</span>
                          <span className="text-[9px] text-slate-400 block">JPEG or PNG</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(key, e.target.files?.[0] || null)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit / Skip CTA */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={handleSkipStep2}
                  disabled={isUploading}
                  className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold uppercase tracking-widest text-center transition-all disabled:opacity-50"
                >
                  Skip & Finish
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 py-4 bg-[#EB0A1E] hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest text-center transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading Media...
                    </>
                  ) : (
                    "Upload & Calculate"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>

      {/* OTP verification Modal */}
      {showVerifier && (
        <PhoneVerifier
          userId={user?.uid}
          onClose={() => setShowVerifier(false)}
          onSuccess={async (verifiedPhone) => {
            setIsPhoneVerified(true);
            setVerifiedPhoneNumber(verifiedPhone);
            setPhone(verifiedPhone.replace("+91", ""));
            setShowVerifier(false);
            await saveLeadData(verifiedPhone);
          }}
        />
      )}
    </div>
  );
}
