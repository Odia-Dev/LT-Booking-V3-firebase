"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Play, ShieldCheck, CheckSquare } from "lucide-react";

export default function BookOnlinePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        
        {/* Scarcity Trigger */}
        <div className="bg-[#EB0A1E] text-white py-3 px-4 rounded-xl text-center text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-1.5 animate-pulse">
          ⚡ ONLINE EXCLUSIVE: Get ₹5,000 instant discount on final invoice when you book online today.
        </div>

        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
            Self-Serve Funnel
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight pt-2">Reserve Your Toyota Online</h1>
          <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">
            Prioritize your delivery allocation ranks in under 60 seconds with our secure Razorpay self-serve platform.
          </p>
        </div>

        {/* Process Checklist */}
        <div className="border border-slate-100 bg-slate-50/50 p-5 rounded-2xl space-y-3.5">
          <div className="flex items-start gap-3">
            <CheckSquare className="w-4 h-4 text-[#EB0A1E] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">1. Select Model & Variant</h4>
              <p className="text-[10px] text-slate-500">Pick from our 13 official vehicle databases with live pricing lists.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckSquare className="w-4 h-4 text-[#EB0A1E] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">2. Authenticate & Verify</h4>
              <p className="text-[10px] text-slate-500">Fast authentication and one-click SMS OTP phone badge lock.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckSquare className="w-4 h-4 text-[#EB0A1E] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">3. Pay Fully-Refundable Deposit</h4>
              <p className="text-[10px] text-slate-500">Razorpay encrypted checkout deposit, 100% refundable before invoicing.</p>
            </div>
          </div>
        </div>

        <div className="pt-2 space-y-3">
          <Link
            href="/vehicles"
            className="w-full text-center py-4 bg-[#EB0A1E] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-750 transition-colors shadow-lg shadow-red-500/10 flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-white" /> Start Self-Serve Booking
          </Link>
          <div className="flex items-center justify-center gap-1 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Razorpay Integration
          </div>
        </div>

      </div>
    </div>
  );
}
