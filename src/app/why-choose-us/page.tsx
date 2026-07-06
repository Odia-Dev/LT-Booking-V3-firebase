"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, CheckCircle2, ShieldCheck, HeartHandshake, Zap } from "lucide-react";

export default function WhyChooseUsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-4 text-center">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
            Our Advantage
          </span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight pt-2">Why Choose Laxmi Toyota</h1>
          <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
            The Laxmi Toyota trust. We combine Toyota's global engineering excellence with local customer care to guarantee a premium ownership journey.
          </p>
        </div>

        {/* Advantage pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md space-y-3">
            <div className="h-9 w-9 bg-red-50 rounded-lg flex items-center justify-center text-[#EB0A1E]">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">Tesla-Style Direct Checkouts</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Skip the line. Pick your variant, authenticate with SMS OTP, make your deposit via Razorpay, and lock your vehicle allocation instantly.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md space-y-3">
            <div className="h-9 w-9 bg-red-50 rounded-lg flex items-center justify-center text-[#EB0A1E]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">100% Refundable Booking</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Complete flexibility. Cancel your booking anytime before invoicing for a full, hassle-free 100% refund processed back to your original source.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md space-y-3">
            <div className="h-9 w-9 bg-red-50 rounded-lg flex items-center justify-center text-[#EB0A1E]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">Customer-First Ecosystem</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Verified customer badges, dedicated CRM dispatch managers, and transparent status tracking keep you fully informed from factory floor to delivery bay.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md space-y-3">
            <div className="h-9 w-9 bg-red-50 rounded-lg flex items-center justify-center text-[#EB0A1E]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">Zero-Hidden Costs</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Full transparency. Dynamic ex-showroom pricing and invoice calculations ensure you pay exactly what is quoted, with no hidden margins.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
