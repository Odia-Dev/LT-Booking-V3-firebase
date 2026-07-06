"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

const VEHICLES = [
  { slug: "toyota-urban-cruiser-ebella", name: "Urban Cruiser Ebella", price: "₹12.00 Lakh", booking: "₹25,000", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600", desc: "100% battery electric SUV featuring spacious dimensions, zero tailpipe emissions, and premium smart dashboards." }
];

export default function ElectricCategoryPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      
      {/* 5K DISCOUNT BANNER */}
      <div className="max-w-7xl mx-auto mb-10 bg-[#EB0A1E] text-white py-3.5 px-6 rounded-2xl text-center text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2">
        <Sparkles className="w-4.5 h-4.5 fill-white" />
        ⚡ ONLINE EXCLUSIVE: Get ₹5,000 instant discount on final invoice when you book online today.
      </div>

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="space-y-4">
          <Link href="/vehicles" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-[#EB0A1E] transition-colors gap-1">
            <ArrowLeft className="w-4 h-4" /> View All Classes
          </Link>
          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
              Technology: Electric (EV)
            </span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Toyota Electric Lineup</h1>
            <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
              Step into the future of electric driving with Toyota's battery electric vehicles (BEV) featuring advanced thermal management and robust range.
            </p>
          </div>
        </div>

        {/* Grid Catalog */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {VEHICLES.map((vehicle) => (
            <div
              key={vehicle.slug}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:border-[#EB0A1E]/30 transition-all flex flex-col justify-between group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-slate-900">{vehicle.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{vehicle.desc}</p>
                  <div className="flex justify-between items-baseline pt-2">
                    <span className="text-xs text-slate-400 font-bold uppercase">Starting Ex-Showroom</span>
                    <span className="text-lg font-black text-slate-950">{vehicle.price}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-3 text-xs">
                  <Link
                    href={`/vehicles/${vehicle.slug}`}
                    className="flex-1 text-center py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold uppercase tracking-wider transition-colors"
                  >
                    View Specs
                  </Link>
                  <Link
                    href={`/book/${vehicle.slug.replace("toyota-", "")}`}
                    className="flex-grow flex-1 text-center py-3 bg-[#EB0A1E] hover:bg-red-700 text-white rounded-xl font-bold uppercase tracking-wider transition-colors shadow-md shadow-red-500/10"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
