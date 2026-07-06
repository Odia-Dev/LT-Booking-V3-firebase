"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db, isConfigured } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { CheckCircle2, User, Phone, Briefcase, IndianRupee, Landmark, Car, ShieldAlert, ArrowLeft, Loader2 } from "lucide-react";

const VEHICLES = [
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

const BANKS = [
  "State Bank of India (SBI)",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank (PNB)",
  "Other Preferred Bank"
];

export default function FinanceLeadPage() {
  const { user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [occupation, setOccupation] = useState("Salaried");
  const [monthlyIncome, setMonthlyIncome] = useState(50000);
  const [preferredBank, setPreferredBank] = useState("State Bank of India (SBI)");
  const [interestedVehicle, setInterestedVehicle] = useState("");
  const [documentConsent, setDocumentConsent] = useState(false);

  // 3-Layer Security States
  const [botField, setBotField] = useState(""); // Honeypot Field
  const [cooldownMessage, setCooldownMessage] = useState(""); // 24h Cooldown State

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [leadId, setLeadId] = useState("");

  // Prefill user details and check Cooldown on load
  useEffect(() => {
    if (user) {
      setFullName(user.displayName || "");
    }
    
    // Check Cooldown
    const lastSubmit = localStorage.getItem("last_finance_submit");
    if (lastSubmit) {
      const diff = Date.now() - parseInt(lastSubmit, 10);
      if (diff < 24 * 60 * 60 * 1000) {
        setCooldownMessage("You have recently submitted a request. Our executive will call you within 24 hours.");
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Layer 1: Honeypot Validation
    if (botField) {
      console.warn("Spam Bot Detected via Honeypot.");
      setLeadId(`fin-lead-bot-${Date.now()}`);
      setSuccess(true);
      return;
    }

    // Layer 2: Cooldown Client-side Block
    const lastSubmit = localStorage.getItem("last_finance_submit");
    if (lastSubmit) {
      const diff = Date.now() - parseInt(lastSubmit, 10);
      if (diff < 24 * 60 * 60 * 1000) {
        setError("You have recently submitted a request. Our executive will call you within 24 hours.");
        return;
      }
    }

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

    if (!interestedVehicle) {
      setError("Please select the vehicle model you are interested in.");
      return;
    }

    if (!documentConsent) {
      setError("Please confirm if you have your salary proof or ITR ready.");
      return;
    }

    setIsSubmitting(true);

    const leadData = {
      fullName: fullName.trim(),
      phone: cleanedPhone,
      occupation: occupation,
      monthlyIncome: monthlyIncome,
      preferredBank: preferredBank,
      vehicleId: interestedVehicle,
      vehicleName: VEHICLES.find(v => v.id === interestedVehicle)?.name || interestedVehicle,
      documentConsent: documentConsent,
      status: "New Lead",
      userUid: user?.uid || "guest",
      customerEmail: user?.email || "guest@guest.com",
      authUserId: user?.uid || null,
      authEmail: user?.email || null,
      submittedAt: new Date().toISOString(),
    };

    try {
      // Layer 3: Firebase / LocalStorage Duplicate Check (7 Days)
      let duplicateId = "";
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      if (isConfigured) {
        const q = query(
          collection(db, "finance_leads"),
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
        const existingRaw = localStorage.getItem("laxmi_toyota_finance_leads");
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
          await updateDoc(doc(db, "finance_leads", duplicateId), {
            lastContactedAt: new Date().toISOString(),
            status: "New Lead (Duplicate)"
          });
        } else {
          const existingRaw = localStorage.getItem("laxmi_toyota_finance_leads");
          if (existingRaw) {
            const list = JSON.parse(existingRaw);
            const index = list.findIndex((i: any) => i.id === duplicateId);
            if (index !== -1) {
              list[index].lastContactedAt = new Date().toISOString();
              list[index].status = "New Lead (Duplicate)";
              localStorage.setItem("laxmi_toyota_finance_leads", JSON.stringify(list));
            }
          }
        }
        
        setLeadId(duplicateId);
        localStorage.setItem("last_finance_submit", Date.now().toString());
        setSuccess(true);
        return;
      }

      // Save Lead (No duplicates)
      let createdDocId = "";
      if (isConfigured) {
        const docRef = await addDoc(collection(db, "finance_leads"), leadData);
        createdDocId = docRef.id;
      } else {
        const existingRaw = localStorage.getItem("laxmi_toyota_finance_leads");
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        createdDocId = `fin-lead-${Date.now()}`;
        existing.push({ id: createdDocId, ...leadData });
        localStorage.setItem("laxmi_toyota_finance_leads", JSON.stringify(existing));
      }
      
      setLeadId(createdDocId);
      localStorage.setItem("last_finance_submit", Date.now().toString());
      setSuccess(true);
    } catch (err: any) {
      console.error("Finance Lead submission error:", err);
      setError("An error occurred during submission. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatINR = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white border border-slate-200/80 p-8 rounded-2xl text-center space-y-6 shadow-xl shadow-slate-200/50 animate-fade-in">
          <div className="h-16 w-16 bg-[#EB0A1E]/10 rounded-full flex items-center justify-center mx-auto text-[#EB0A1E] border border-[#EB0A1E]/20">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Pre-Approval Initialized</h2>
            <p className="text-xs text-slate-500 font-medium">Application Reference: <span className="font-mono text-slate-800 font-bold">{leadId}</span></p>
            <p className="text-xs text-slate-400">Status: <span className="text-[#EB0A1E] font-semibold bg-red-50 px-2 py-0.5 rounded">Application Logged</span></p>
          </div>

          <div className="text-slate-600 text-sm space-y-4 border-y border-slate-100 py-5 text-left leading-relaxed">
            <p>
              Thank you, <span className="font-semibold text-slate-900">{fullName}</span>. Your vehicle finance eligibility application has been processed.
            </p>
            <p className="text-xs text-slate-500">
              A certified **Laxmi Toyota Finance Executive** will contact you within **24 hours** to verify your documents and route your pre-approval application to your preferred bank (<span className="font-medium text-slate-900">{preferredBank}</span>).
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard"
              className="block w-full text-center text-xs font-bold uppercase tracking-widest bg-slate-900 text-white py-3.5 rounded-xl hover:bg-[#EB0A1E] transition-all duration-200 shadow-md shadow-slate-900/10"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center px-4 py-16">
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/80">
        
        {/* Left Column: Benefits checklist */}
        <div className="md:col-span-5 bg-slate-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-red-950/40 via-transparent to-transparent opacity-60 pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <Link href="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors gap-1.5">
              <ArrowLeft className="w-4.5 h-4.5" /> Back
            </Link>

            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-[#EB0A1E]/10 border border-[#EB0A1E]/20 px-3 py-1 rounded">
                Toyota Finance
              </span>
              <h1 className="text-3xl font-black tracking-tight pt-2">
                Finance <br/>Eligibility
              </h1>
              <p className="text-slate-400 text-xs leading-relaxed pt-1">
                We partner with leading banks to offer priority interest rates, customized tenure terms, and rapid pre-approvals on all models.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-6 pt-12 border-t border-slate-800/80">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#EB0A1E]">Finance Benefits</h3>
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#EB0A1E] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Low Interest Rates</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Tie-ups with premium banks to provide the lowest starting APR.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#EB0A1E] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Minimal Documentation</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Seamless paperless logging to expedite loan sanctions.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#EB0A1E] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Flexible Tenures</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Select EMI payback options starting from 12 to 84 months.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form fields */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Check Loan Offer</h2>
            <p className="text-slate-500 text-xs mt-1">Get customized financing quotes from our banking desk.</p>
          </div>

          {cooldownMessage ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center space-y-4 shadow-sm">
              <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Application Recently Filed</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{cooldownMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 border border-red-100 p-3.5 rounded-xl text-xs font-semibold">
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

              {/* Full Name */}
              <div className="space-y-1.5">
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
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none transition-all duration-150"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="space-y-1.5">
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
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none transition-all duration-150"
                  />
                </div>
              </div>

              {/* Occupation & Bank Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="occupation" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Occupation
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                      <Briefcase className="h-4 w-4" />
                    </span>
                    <select
                      id="occupation"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none transition-all duration-150 appearance-none"
                    >
                      <option value="Salaried">Salaried Employee</option>
                      <option value="Self-Employed">Self-Employed Professional</option>
                      <option value="Business">Business Owner</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="preferredBank" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Preferred Bank
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                      <Landmark className="h-4 w-4" />
                    </span>
                    <select
                      id="preferredBank"
                      value={preferredBank}
                      onChange={(e) => setPreferredBank(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none transition-all duration-150 appearance-none"
                    >
                      {BANKS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Monthly Income Range Slider */}
              <div className="space-y-2 border border-slate-100 bg-slate-50/50 p-4 rounded-2xl">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider">Monthly Income</span>
                  <span className="font-bold text-slate-900 text-sm bg-slate-100 px-3 py-1 rounded-full">{formatINR(monthlyIncome)}</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min={15000}
                    max={300000}
                    step={5000}
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#EB0A1E]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1 mt-1">
                    <span>₹15K</span>
                    <span>₹1.5L</span>
                    <span>₹3L+</span>
                  </div>
                </div>
              </div>

              {/* Interested Vehicle */}
              <div className="space-y-1.5">
                <label htmlFor="vehicle" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Select Toyota Vehicle
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Car className="h-4 w-4" />
                  </span>
                  <select
                    id="vehicle"
                    value={interestedVehicle}
                    onChange={(e) => setInterestedVehicle(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none transition-all duration-150 appearance-none"
                  >
                    <option value="" disabled>Choose Model</option>
                    {VEHICLES.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Consent Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer select-none py-1">
                <input
                  type="checkbox"
                  checked={documentConsent}
                  onChange={(e) => setDocumentConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-[#EB0A1E] focus:ring-[#EB0A1E]"
                />
                <span className="text-xs text-slate-500 leading-relaxed">
                  I have my salary slips/ITR and bank statement ready for quick verification check.
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#EB0A1E] py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-red-500/10 hover:bg-red-700 disabled:opacity-50 transition-all duration-200"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking Eligibility...
                  </span>
                ) : (
                  "Verify Loan Eligibility"
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
