"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ShoppingBag, ShieldCheck, Cpu, Star } from "lucide-react";

export default function PartsAccessoriesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-4 text-center">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
            Toyota Genuine Parts
          </span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight pt-2">Parts & Accessories Desk</h1>
          <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
            Maintain integrity. Equip your vehicle with genuine Toyota air/oil filters, brake pads, custom chrome kits, alloy wheels, and styling components.
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <Cpu className="w-6 h-6 text-[#EB0A1E]" />
            <h3 className="font-extrabold text-lg text-slate-900">Genuine Replacement Parts</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Filters, spark plugs, brake discs, Wiper blades, and batteries tested specifically for your variant to ensure warranty parameters stay intact.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <ShoppingBag className="w-6 h-6 text-[#EB0A1E]" />
            <h3 className="font-extrabold text-lg text-slate-900">Styling Accessories</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Alloy upgrades, body side moldings, styling chrome garnish packages, smart dashboard cams, and premium cabin carpets.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-950 text-white p-8 rounded-3xl text-center space-y-4 shadow-xl">
          <Star className="w-8 h-8 text-[#EB0A1E] mx-auto mb-2" />
          <h3 className="text-lg font-extrabold">Inquire About Part Availability</h3>
          <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
            Need a specific spare part or custom accessory? Fill out a query on our contact page, and our parts advisor will lookup catalog codes for you.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-block bg-[#EB0A1E] hover:bg-red-750 text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              Contact Parts Advisor
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
