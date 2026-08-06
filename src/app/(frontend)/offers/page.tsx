"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Percent, ArrowLeft } from "lucide-react";
import { fetchLiveOffers, fetchLiveVehicles, LiveOfferDisplay, LiveVehicleDisplay } from "@/lib/cmsFetcher";

export default function OffersPage() {
  const [liveOffers, setLiveOffers] = useState<LiveOfferDisplay[]>([]);
  const [liveVehicles, setLiveVehicles] = useState<LiveVehicleDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      const [oData, vData] = await Promise.all([
        fetchLiveOffers(),
        fetchLiveVehicles(),
      ]);
      if (isMounted) {
        setLiveOffers(oData);
        setLiveVehicles(vData);
        setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

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
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Active Offers & Promotions</h1>
            <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
              Maximize your value. View this month's seasonal benefits, low interest-rates, and flat online booking discounts tailored for each Toyota passenger vehicle model.
            </p>
          </div>
        </div>

        {/* Model-Wise Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {liveOffers.map((offer, idx) => {
            const matchedVehicle = liveVehicles[idx % (liveVehicles.length || 1)] || liveVehicles[0];
            return (
              <div 
                key={offer.id}
                className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-md shadow-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:border-[#EB0A1E]/30 transition-all flex flex-col justify-between group"
              >
                {/* Visual Header */}
                <div className="relative h-44 bg-slate-950 overflow-hidden flex items-center justify-center border-b border-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={matchedVehicle?.heroImage || "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&q=80&w=800"}
                    alt={offer.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 z-10">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-red-500 bg-red-950/40 border border-red-900/60 px-2 py-0.5 rounded">
                      {offer.badge || "Authorized Offer"}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1.5">{offer.title}</h3>
                  </div>
                </div>

                {/* Offer Details */}
                <div className="p-6 flex-grow space-y-4">
                  <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-sm">
                    <Percent className="w-4 h-4" />
                    <span>{offer.discountText}</span>
                  </div>
                  <p className="text-slate-650 text-xs leading-relaxed font-semibold">
                    {offer.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Applicable Models</span>
                      <span className="text-slate-800 font-bold mt-0.5 block">{offer.applicableVehicles.join(", ")}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Valid Till</span>
                      <span className="text-slate-800 font-bold mt-0.5 block">{offer.expiryText}</span>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="p-6 pt-0 space-y-2">
                  <Link
                    href={matchedVehicle ? `/vehicles/toyota-${matchedVehicle.slug}` : "/vehicles"}
                    className="w-full inline-flex items-center justify-center bg-slate-950 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl hover:bg-slate-850 transition-all gap-1"
                  >
                    View Specs & Colors <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={matchedVehicle ? `/book/${matchedVehicle.slug}` : "/vehicles"}
                    className="w-full inline-flex items-center justify-center bg-[#EB0A1E] text-white text-xs font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-red-750 transition-all shadow-md shadow-red-500/10 gap-1.5"
                  >
                    Claim Offer / Book Now
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
