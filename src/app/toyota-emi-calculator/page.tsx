"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import Link from "next/link";
import { CheckCircle2, User, Phone, Briefcase, IndianRupee, ArrowLeft, Percent, Calendar } from "lucide-react";

export default function FinancePage() {
  const { user, isConfigured } = useAuth();

  // Slider States
  const [loanAmount, setLoanAmount] = useState(1000000); // 10 Lakh default
  const [interestRate, setInterestRate] = useState(8.5); // 8.5% default
  const [tenure, setTenure] = useState(60); // 60 months default

  // Form States
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [employmentType, setEmploymentType] = useState("Salaried");

  // Status States
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [leadId, setLeadId] = useState("");

  // EMI Calculator Logic
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  useEffect(() => {
    // Calculate EMI
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenure;

    if (r === 0) {
      setEmi(P / n);
      setTotalPayment(P);
      setTotalInterest(0);
    } else {
      const calculatedEmi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const calculatedTotalPayment = calculatedEmi * n;
      const calculatedTotalInterest = calculatedTotalPayment - P;

      setEmi(Math.round(calculatedEmi));
      setTotalPayment(Math.round(calculatedTotalPayment));
      setTotalInterest(Math.round(calculatedTotalInterest));
    }
  }, [loanAmount, interestRate, tenure]);

  // Prefill user's display name if authenticated
  useEffect(() => {
    if (user) {
      setFullName(user.displayName || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validations
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    const cleanedPhone = phone.trim();
    if (!/^\d{10}$/.test(cleanedPhone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);

    const leadData = {
      fullName: fullName.trim(),
      phone: cleanedPhone,
      employmentType: employmentType,
      calculatedLoanAmount: loanAmount,
      calculatedInterestRate: interestRate,
      calculatedTenureMonths: tenure,
      calculatedMonthlyEmi: emi,
      calculatedTotalInterest: totalInterest,
      calculatedTotalPayment: totalPayment,
      status: "New Finance Lead",
      userUid: user?.uid || "guest",
      customerEmail: user?.email || "guest@guest.com",
      createdAt: new Date().toISOString(),
    };

    try {
      if (isConfigured) {
        // Save to Firestore
        const docRef = await addDoc(collection(db, "finance_leads"), leadData);
        setLeadId(docRef.id);
      } else {
        // Local storage fallback for developer preview
        const existingRaw = localStorage.getItem("laxmi_toyota_finance_leads");
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        const mockId = `fin-lead-${Date.now()}`;
        existing.push({ id: mockId, ...leadData });
        localStorage.setItem("laxmi_toyota_finance_leads", JSON.stringify(existing));
        setLeadId(mockId);
      }
      setSuccess(true);
    } catch (err: any) {
      console.error("Finance Lead Submission Error:", err);
      setError("Failed to submit eligibility request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format currency helpers
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
            <h2 className="text-2xl font-black text-slate-900">Application Submitted</h2>
            <p className="text-xs text-slate-500 font-medium">Lead Reference: <span className="font-mono text-slate-800 font-bold">{leadId}</span></p>
            <p className="text-xs text-slate-400">Status: <span className="text-[#EB0A1E] font-semibold bg-red-50 px-2 py-0.5 rounded">Under Review</span></p>
          </div>

          <div className="text-slate-600 text-sm space-y-4 border-y border-slate-100 py-5 text-left leading-relaxed">
            <p>
              Thank you, <span className="font-semibold text-slate-900">{fullName}</span>. Your eligibility check application has been securely logged.
            </p>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs space-y-2 text-slate-500">
              <div className="flex justify-between">
                <span>Calculated EMI:</span>
                <span className="text-slate-900 font-bold">{formatINR(emi)} / Month</span>
              </div>
              <div className="flex justify-between">
                <span>Principal Loan:</span>
                <span className="text-slate-900 font-semibold">{formatINR(loanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Loan Tenure:</span>
                <span className="text-slate-900 font-semibold">{tenure} Months</span>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              A finance specialist from Laxmi Toyota will call you within 2 working hours to assist with documentation and secure pre-approvals from our banking partners.
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
    <div className="min-h-screen bg-slate-50 text-slate-900 px-4 py-16">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5 gap-4">
          <div>
            <Link href="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#EB0A1E] transition-colors gap-1.5 mb-2">
              <ArrowLeft className="w-4 h-4" /> Back to Showroom
            </Link>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">EMI & Finance Calculator</h1>
            <p className="text-slate-500 text-xs mt-1">Configure your loan parameters dynamically and check your eligibility instantly.</p>
          </div>
          <div className="bg-[#EB0A1E]/10 border border-[#EB0A1E]/20 text-[#EB0A1E] text-xs font-semibold px-3 py-1.5 rounded-full flex items-center justify-center gap-1.5 self-start">
            <Percent className="w-3.5 h-3.5" /> Best Interest Rates in Odisha
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sliders Container (Left) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/40 space-y-8">
            
            {/* Sliders */}
            <div className="space-y-6">
              
              {/* Slider 1: Loan Amount */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5" /> 1. Loan Amount
                  </span>
                  <span className="text-sm font-extrabold text-[#EB0A1E] bg-red-50 px-2.5 py-1 rounded">
                    {formatINR(loanAmount)}
                  </span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="3000000"
                  step="50000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#EB0A1E]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                  <span>₹1 Lakh</span>
                  <span>₹15 Lakh</span>
                  <span>₹30 Lakh</span>
                </div>
              </div>

              {/* Slider 2: Interest Rate */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5" /> 2. Interest Rate (P.A.)
                  </span>
                  <span className="text-sm font-extrabold text-[#EB0A1E] bg-red-50 px-2.5 py-1 rounded">
                    {interestRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min="7"
                  max="15"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#EB0A1E]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                  <span>7.0%</span>
                  <span>11.0%</span>
                  <span>15.0%</span>
                </div>
              </div>

              {/* Slider 3: Loan Tenure */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> 3. Loan Tenure
                  </span>
                  <span className="text-sm font-extrabold text-[#EB0A1E] bg-red-50 px-2.5 py-1 rounded">
                    {tenure} Months ({Math.round((tenure / 12) * 10) / 10} Years)
                  </span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="84"
                  step="6"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#EB0A1E]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                  <span>12 Months</span>
                  <span>48 Months</span>
                  <span>84 Months</span>
                </div>
              </div>

            </div>

            {/* Calculations Breakdowns (Cards) */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Interest</span>
                <p className="text-base font-black text-slate-900 mt-1">{formatINR(totalInterest)}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Payment</span>
                <p className="text-base font-black text-slate-900 mt-1">{formatINR(totalPayment)}</p>
              </div>
            </div>

          </div>

          {/* Dynamic Summary + Form (Right) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Dynamic Big EMI Display Card */}
            <div className="bg-slate-950 border border-slate-800 p-6 sm:p-8 rounded-2xl text-center text-white relative overflow-hidden shadow-xl shadow-slate-900/10">
              <div className="absolute inset-0 bg-gradient-to-tr from-red-950/20 via-transparent to-transparent opacity-60 pointer-events-none" />
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-[#EB0A1E]/10 border border-[#EB0A1E]/20 px-3 py-1 rounded">
                  Estimated EMI
                </span>
                <h3 className="text-4xl sm:text-5xl font-black text-white tracking-tight pt-3">
                  {formatINR(emi)}
                  <span className="text-xs font-bold text-slate-400 tracking-normal block pt-1">Per Month</span>
                </h3>
              </div>
            </div>

            {/* Lead Form */}
            <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-xl shadow-slate-200/40 space-y-6">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Check Finance Eligibility</h2>
                <p className="text-slate-500 text-xs mt-1">Submit basic verification to receive quote options.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-lg text-xs font-semibold">
                    {error}
                  </div>
                )}

                {/* Name */}
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
                      placeholder="Enter your name"
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none transition-all duration-150"
                    />
                  </div>
                </div>

                {/* Phone */}
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
                      placeholder="Enter mobile number"
                      maxLength={10}
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none transition-all duration-150"
                    />
                  </div>
                </div>

                {/* Employment Type */}
                <div className="space-y-1.5">
                  <label htmlFor="employment" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Employment Type
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                      <Briefcase className="h-4 w-4" />
                    </span>
                    <select
                      id="employment"
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none transition-all duration-150 appearance-none"
                    >
                      <option value="Salaried">Salaried Employee</option>
                      <option value="Self-Employed / Business">Self-Employed / Business</option>
                      <option value="Farmer / Agriculturalist">Farmer / Agriculturalist</option>
                      <option value="Retired">Retired Professional</option>
                    </select>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-[#EB0A1E] py-3.5 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-red-500/10 hover:bg-red-700 disabled:opacity-50 transition-all duration-200 mt-2"
                >
                  {isSubmitting ? "Submitting Application..." : "Check Loan Eligibility"}
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
