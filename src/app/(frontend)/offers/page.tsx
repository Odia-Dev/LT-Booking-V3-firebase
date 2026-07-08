"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Calendar, Tag, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      
      {/* 5K DISCOUNT BANNER */}
      <div className="max-w-4xl mx-auto mb-10 bg-[#EB0A1E] text-white py-3.5 px-6 rounded-2xl text-center text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-red-500/10">
        <Sparkles className="w-4.5 h-4.5 fill-white" />
        ⚡ ONLINE EXCLUSIVE: Get ₹5,000 instant discount on final invoice when you book online today.
      </div>

      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="space-y-4">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
            Seasonal Promotions
          </span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Exclusive Dealership Offers</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Maximize your value. Laxmi Toyota offers seasonal benefits, exchange bonuses, corporate discounts, and low interest-rate financing options on our entire Toyota lineup.
          </p>
        </div>

        {/* Offers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Offer 1 */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-md space-y-4 flex flex-col justify-between hover:border-[#EB0A1E]/30 transition-all">
            <div className="space-y-3">
              <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center text-[#EB0A1E]">
                <Tag className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Exchange Bonus Campaign</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Upgrade your old car of any brand for a brand-new Toyota. Get an exchange bonus value of up to **₹70,000** off your new invoice.
              </p>
            </div>
            <Link
              href="/car-exchange-valuation"
              className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all gap-1.5"
            >
              Get Exchange Quote <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Offer 2 */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-md space-y-4 flex flex-col justify-between hover:border-[#EB0A1E]/30 transition-all">
            <div className="space-y-3">
              <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center text-[#EB0A1E]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Corporate & Govt Employee Offer</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Exclusive benefits and reduced interest rate schemes for registered corporate professionals, government workers, and doctors.
              </p>
            </div>
            <Link
              href="/car-loan-eligibility"
              className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all gap-1.5"
            >
              Check Loan Offer <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Offer 3 */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-md space-y-4 flex flex-col justify-between hover:border-[#EB0A1E]/30 transition-all col-span-1 md:col-span-2">
            <div className="space-y-3">
              <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center text-[#EB0A1E]">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">₹5,000 Direct Online Booking Bonus</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Book any vehicle online via our self-serve portal today, and get a flat **₹5,000 cash discount** deducted from your final dealership registration invoice automatically.
              </p>
            </div>
            <Link
              href="/vehicles"
              className="inline-flex items-center justify-center bg-[#EB0A1E] hover:bg-red-750 text-white text-xs font-bold uppercase tracking-widest py-4 rounded-xl transition-all shadow-md shadow-red-500/10"
            >
              Reserve Vehicle Online
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
