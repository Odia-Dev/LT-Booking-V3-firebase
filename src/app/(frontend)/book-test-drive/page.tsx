"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db, isConfigured } from "@/lib/firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { Calendar, CheckCircle2, User, Phone, MapPin, Car, ArrowLeft, Loader2, BadgeCheck } from "lucide-react";
import PhoneVerifier from "@/components/PhoneVerifier";

const AVAILABLE_VEHICLES = [
  { id: "glanza", name: "Toyota Glanza" },
  { id: "taisor", name: "Toyota Taisor" },
  { id: "rumion", name: "Toyota Rumion" },
  { id: "hyryder", name: "Urban Cruiser Hyryder" },
  { id: "hycross", name: "Innova Hycross" },
  { id: "fortuner", name: "Toyota Fortuner" },
  { id: "camry", name: "Toyota Camry" },
  { id: "hilux", name: "Toyota Hilux" },
  { id: "landcruiser", name: "Land Cruiser 300" }
];

const BRANCHES = [
  { id: "Berhampur", name: "Berhampur Branch" },
  { id: "Jeypore", name: "Jeypore Branch" },
  { id: "Bargarh", name: "Bargarh Branch" }
];

export default function TestDrivePage() {
  const { user } = useAuth();
  
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [branch, setBranch] = useState("Berhampur");
  const [preferredDate, setPreferredDate] = useState("");
  
  // Phone OTP States
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [verifiedPhoneNumber, setVerifiedPhoneNumber] = useState("");
  const [showVerifier, setShowVerifier] = useState(false);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [leadId, setLeadId] = useState("");

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

  const saveLeadData = async (verifiedPhone: string) => {
    setIsSubmitting(true);
    const leadData = {
      fullName: fullName.trim(),
      phone: verifiedPhone,
      vehicle: vehicle,
      vehicleName: AVAILABLE_VEHICLES.find(v => v.id === vehicle)?.name || vehicle,
      branch: branch,
      preferredDate: preferredDate,
      status: "New Lead",
      userUid: user?.uid || "guest",
      customerEmail: user?.email || "guest@guest.com",
      authUserId: user?.uid || null,
      authEmail: user?.email || null,
      createdAt: new Date().toISOString(),
    };

    try {
      let createdDocId = "";
      if (isConfigured) {
        const docRef = await addDoc(collection(db, "test_drives"), leadData);
        createdDocId = docRef.id;
      } else {
        const existingRaw = localStorage.getItem("laxmi_toyota_test_drives");
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        createdDocId = `td-lead-${Date.now()}`;
        existing.push({ id: createdDocId, ...leadData });
        localStorage.setItem("laxmi_toyota_test_drives", JSON.stringify(existing));
      }
      setLeadId(createdDocId);
      setSuccess(true);
    } catch (err: any) {
      console.error("Test Drive booking submission error:", err);
      setError("Failed to book test drive. Please check your network and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Field Validations
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    const cleanedPhone = phone.trim();
    if (!/^\d{10}$/.test(cleanedPhone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!vehicle) {
      setError("Please select a vehicle model.");
      return;
    }

    if (!preferredDate) {
      setError("Please select a preferred date for the test drive.");
      return;
    }

    // Check if selected date is in past
    const selectedDateTime = new Date(preferredDate).getTime();
    const todayTime = new Date().setHours(0, 0, 0, 0);
    if (selectedDateTime < todayTime) {
      setError("Please select a future date.");
      return;
    }

    const fullPhone = `+91${cleanedPhone}`;

    if (user && isPhoneVerified) {
      // Pre-verified, bypass OTP modal
      await saveLeadData(fullPhone);
    } else {
      // Unverified or Guest, trigger OTP verification
      setShowVerifier(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white border border-slate-200/80 p-8 rounded-2xl text-center space-y-6 shadow-xl shadow-slate-200/50 animate-fade-in">
          <div className="h-16 w-16 bg-[#EB0A1E]/10 rounded-full flex items-center justify-center mx-auto text-[#EB0A1E] border border-[#EB0A1E]/20">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Request Confirmed</h2>
            <p className="text-xs text-slate-500 font-medium">Lead Reference: <span className="font-mono text-slate-800 font-bold">{leadId}</span></p>
            <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
              Verification: 
              <span className="text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded flex items-center gap-0.5">
                <BadgeCheck className="w-3.5 h-3.5 fill-blue-100" /> Phone OTP Verified
              </span>
            </p>
          </div>

          <div className="text-slate-600 text-sm space-y-4 border-y border-slate-100 py-5 text-left leading-relaxed">
            <p>
              Thank you, <span className="font-semibold text-slate-900">{fullName}</span>. Your priority test drive request has been logged successfully.
            </p>
            <p className="text-xs text-slate-500">
              Our sales consultant from the <span className="font-semibold text-slate-900">{branch} Branch</span> will contact you within 2 working hours to confirm your scheduled slot on <span className="font-semibold text-slate-900">{new Date(preferredDate).toLocaleDateString("en-IN", { dateStyle: "long" })}</span>.
            </p>
          </div>

          <div className="pt-2 space-y-3">
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
        
        {/* Left Column: Premium Brand Intro */}
        <div className="md:col-span-5 bg-slate-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-red-950/40 via-transparent to-transparent opacity-60 pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <Link href="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            
            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-[#EB0A1E]/10 border border-[#EB0A1E]/20 px-3 py-1 rounded">
                Experience Toyota
              </span>
              <h1 className="text-3xl font-black tracking-tight pt-2">
                Book a <br/>Test Drive
              </h1>
              <p className="text-slate-400 text-xs leading-relaxed pt-1">
                Feel the signature Toyota drive quality, safety engineering, and state-of-the-art hybrid technology firsthand.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-4 pt-12 border-t border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-white/5 rounded-full flex items-center justify-center text-[#EB0A1E]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-300 font-medium">Free Doorstep Test Drives Available</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-white/5 rounded-full flex items-center justify-center text-[#EB0A1E]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-300 font-medium">Sanitized & Insured Test Fleet</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-white/5 rounded-full flex items-center justify-center text-[#EB0A1E]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-300 font-medium">Certified Relationship Advisor</p>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900">Personalize Your Ride</h2>
            <p className="text-slate-500 text-xs mt-1">Please enter your parameters to schedule a priority booking.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 border border-red-100 p-3.5 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <User className="h-4 w-4" />
                </span>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none transition-all duration-150"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Phone className="h-4 w-4" />
                </span>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  required
                  disabled={isPhoneVerified}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none transition-all duration-150 disabled:opacity-70 disabled:bg-slate-100"
                />
                {isPhoneVerified && (
                  <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-blue-500 text-xs font-bold gap-1 pointer-events-none">
                    <BadgeCheck className="w-4 h-4 fill-blue-50 font-bold" /> Verified
                  </span>
                )}
              </div>
            </div>

            {/* Vehicle Selection & Preferred Branch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Select Vehicle */}
              <div className="space-y-2">
                <label htmlFor="vehicle" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Select Vehicle
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Car className="h-4 w-4" />
                  </span>
                  <select
                    id="vehicle"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none transition-all duration-150 appearance-none"
                  >
                    <option value="" disabled>Choose Model</option>
                    {AVAILABLE_VEHICLES.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Branch */}
              <div className="space-y-2">
                <label htmlFor="branch" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Preferred Branch
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <select
                    id="branch"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none transition-all duration-150 appearance-none"
                  >
                    {BRANCHES.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Preferred Date */}
            <div className="space-y-2">
              <label htmlFor="preferredDate" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Preferred Date
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Calendar className="h-4 w-4" />
                </span>
                <input
                  id="preferredDate"
                  type="date"
                  value={preferredDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none transition-all duration-150"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#EB0A1E] py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-red-500/10 hover:bg-red-700 disabled:opacity-50 transition-all duration-200"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-1.5">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Slot...
                </span>
              ) : isPhoneVerified ? (
                "Instant Test Drive Request"
              ) : (
                "Verify Mobile & Book Drive"
              )}
            </button>

            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              * Valid driving license is mandatory at the time of the test drive. Your details are secure and OTP verified.
            </p>
          </form>
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
