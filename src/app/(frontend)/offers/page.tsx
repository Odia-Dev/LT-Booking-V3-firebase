"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Calendar, Tag, ArrowRight, ShieldCheck, Car, Percent, ArrowLeft } from "lucide-react";
import { VEHICLES } from "@/lib/data";

const MODEL_OFFERS = [
  {
    modelKey: "toyota-glanza",
    title: "Glanza Smart Savings Scheme",
    benefits: "Up to ₹35,000 total benefits",
    details: "Includes ₹20,000 exchange bonus, ₹10,000 corporate discount, and flat ₹5,000 online booking waiver.",
    emiStart: "₹6,999/mo",
    validTill: "July 31, 2026"
  },
  {
    modelKey: "toyota-urban-cruiser-taisor",
    title: "Taisor Move Ahead Package",
    benefits: "Up to ₹45,000 benefits",
    details: "Complimentary 3-year extended warranty package + ₹25,000 exchange bonus + flat ₹5,000 online booking bonus.",
    emiStart: "₹7,899/mo",
    validTill: "July 31, 2026"
  },
  {
    modelKey: "toyota-urban-cruiser-hyryder",
    title: "Hyryder Strong Hybrid Campaign",
    benefits: "Loyalty Bonus up to ₹55,000",
    details: "Special eco-drive conversion bonus for strong hybrid variants, low 8.4% interest rates, and online priority allocation.",
    emiStart: "₹11,499/mo",
    validTill: "July 31, 2026"
  },
  {
    modelKey: "toyota-innova-hycross",
    title: "Hycross Premium Lounge Offer",
    benefits: "Flat ₹5,000 online booking discount",
    details: "Priority allocations for online bookings, customized corporate lease structures, and zero down-payment options.",
    emiStart: "₹19,299/mo",
    validTill: "July 31, 2026"
  },
  {
    modelKey: "toyota-fortuner",
    title: "Fortuner Dominance Scheme",
    benefits: "Exchange value up to ₹75,000",
    details: "Secure priority dealership delivery ranks, loyalty accessories package worth ₹15,000, and corporate bonus.",
    emiStart: "₹34,999/mo",
    validTill: "July 31, 2026"
  },
  {
    modelKey: "toyota-hilux",
    title: "Hilux Mega Adventure Offer",
    benefits: "Benefits worth ₹1.5 Lakhs",
    details: "Adventure gear accessories kit discount, off-road styling package, and special agricultural/corporate rebates.",
    emiStart: "₹29,999/mo",
    validTill: "July 31, 2026"
  }
];

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      
      {/* 5K DISCOUNT BANNER */}
      <div className="max-w-7xl mx-auto mb-10 bg-[#EB0A1E] text-white py-3.5 px-6 rounded-2xl text-center text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-red-500/10">
        <Sparkles className="w-4.5 h-4.5 fill-white" />
        ⚡ ONLINE EXCLUSIVE: Get ₹5,000 instant discount on final invoice when you book online today.
      </div>

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Navigation & Header */}
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
              Current Promotions
            </span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Model-Wise Offers</h1>
            <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
              Maximize your value. View this month's seasonal benefits, low interest-rates, and flat online booking discounts tailored for each Toyota passenger vehicle model.
            </p>
          </div>
        </div>

        {/* Model-Wise Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MODEL_OFFERS.map((offer) => {
            const vehicle = VEHICLES[offer.modelKey];
            if (!vehicle) return null;
            return (
              <div 
                key={offer.modelKey}
                className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-md shadow-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:border-[#EB0A1E]/30 transition-all flex flex-col justify-between group"
              >
                {/* Visual Header */}
                <div className="relative h-44 bg-slate-950 overflow-hidden flex items-center justify-center border-b border-slate-100">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 z-10">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-red-500 bg-red-950/40 border border-red-900/60 px-2 py-0.5 rounded">
                      {vehicle.category}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1.5">{vehicle.name}</h3>
                  </div>
                </div>

                {/* Offer Details */}
                <div className="p-6 flex-grow space-y-4">
                  <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-sm">
                    <Percent className="w-4 h-4" />
                    <span>{offer.benefits}</span>
                  </div>
                  <p className="text-slate-650 text-xs leading-relaxed font-semibold">
                    {offer.details}
                  </p>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Starting EMI</span>
                      <span className="text-slate-800 font-bold mt-0.5 block">{offer.emiStart}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Valid Till</span>
                      <span className="text-slate-800 font-bold mt-0.5 block">{offer.validTill}</span>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="p-6 pt-0 space-y-2">
                  <Link
                    href={`/vehicles/${offer.modelKey}`}
                    className="w-full inline-flex items-center justify-center bg-slate-950 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl hover:bg-slate-850 transition-all gap-1"
                  >
                    View Specs & Colors <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/book/${offer.modelKey}`}
                    className="w-full inline-flex items-center justify-center bg-[#EB0A1E] text-white text-xs font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-red-750 transition-all shadow-md shadow-red-500/10 gap-1.5"
                  >
                    Get This Offer / Book Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
