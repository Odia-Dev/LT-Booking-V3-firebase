"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, MapPin, Award, CheckCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-4 text-center">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
            Laxmi Toyota Profile
          </span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight pt-2">About Laxmi Toyota</h1>
          <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
            The authorized dealer for Toyota Kirloskar Motor in South Odisha. Leading automotive retail with transparency, excellence, and a customer-first ecosystem.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-900">Our Legacy & Mission</h2>
          <p className="text-slate-650 text-xs leading-relaxed">
            Founded with a vision to redefine the vehicle buying journey in South Odisha, Laxmi Toyota has grown to serve thousands of happy vehicle owners across Brahmapur, Jeypore, Bargarh, Balangir, Rayagada, Bhawanipatna, Paralakhemundi, and Aska.
          </p>
          <p className="text-slate-650 text-xs leading-relaxed">
            We offer pre-sales consulting, online self-serve booking channels, financial assistance, zero-depreciation insurance products, and post-sales express maintenance services under one unified roof.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-2xl border border-slate-250/60 shadow-sm space-y-2">
            <Award className="w-6 h-6 text-[#EB0A1E] mx-auto" />
            <h3 className="font-extrabold text-sm text-slate-900">Top-Rated Showroom</h3>
            <p className="text-[10px] text-slate-500">Recognized for delivery compliance and high CSI score rankings.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-250/60 shadow-sm space-y-2">
            <MapPin className="w-6 h-6 text-[#EB0A1E] mx-auto" />
            <h3 className="font-extrabold text-sm text-slate-900">8 Branch Network</h3>
            <p className="text-[10px] text-slate-500">Strategically located sales and service hubs covering South Odisha.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-250/60 shadow-sm space-y-2">
            <CheckCircle className="w-6 h-6 text-[#EB0A1E] mx-auto" />
            <h3 className="font-extrabold text-sm text-slate-900">Self-Serve Booking</h3>
            <p className="text-[10px] text-slate-500">100% digital transparent reservation with Razorpay deposit protection.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
