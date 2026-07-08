"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Shield, Landmark, ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react";

export default function InsuranceFinancePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-4 text-center">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
            Toyota Financial Services
          </span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight pt-2">Insurance & Finance Desk</h1>
          <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
            Flexible financing. Bulletproof coverage. We offer custom EMI loans and zero-depreciation insurance products partnered with leading banks in Odisha.
          </p>
        </div>

        {/* Info Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Block 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between hover:border-[#EB0A1E]/30 transition-all">
            <div className="space-y-3">
              <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center text-[#EB0A1E]">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Custom Car Loans</h3>
              <p className="text-xs text-slate-550 leading-relaxed">
                Affiliated with SBI, HDFC, ICICI, and Axis Bank. Instant approvals, minimal paperwork, and competitive interest rates for vehicle purchases.
              </p>
            </div>
            <Link
              href="/car-loan-eligibility"
              className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all gap-1.5"
            >
              Check Loan Eligibility <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Block 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between hover:border-[#EB0A1E]/30 transition-all">
            <div className="space-y-3">
              <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center text-[#EB0A1E]">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Zero-Depreciation Insurance</h3>
              <p className="text-xs text-slate-550 leading-relaxed">
                Protect your asset with comprehensive zero-depreciation coverage, including engine protect, key replacement, and cashless claims across Ganjam.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all gap-1.5"
            >
              Get Insurance Quote <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bg-slate-950 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-lg">
          <div className="flex items-center gap-3">
            <HeartHandshake className="w-8 h-8 text-[#EB0A1E] shrink-0" />
            <div>
              <h4 className="text-sm font-extrabold">Instant Quote Desk</h4>
              <p className="text-xs text-slate-400">Request personalized EMI schemes or premium renewals over the phone.</p>
            </div>
          </div>
          <Link href="/toyota-emi-calculator" className="bg-[#EB0A1E] hover:bg-red-750 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0">
            Open EMI Calculator
          </Link>
        </div>

      </div>
    </div>
  );
}
