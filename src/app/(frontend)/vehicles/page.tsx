"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SlidersHorizontal, Sparkles, ShieldCheck } from "lucide-react";
import { NAV_CATEGORIES } from "@/lib/categories";
import { DEFAULT_BRANDED_CAR_IMAGE, fetchLiveVehicles, LiveVehicleDisplay } from "@/lib/cmsFetcher";

const CATEGORIES = [
  "All Models",
  "Hatchback",
  "MPV",
  "SUV",
  "Sedan",
  "Hybrid",
  "Electric",
  "Offroad",
  "Luxury"
];

export default function VehiclesIndexPage() {
  const [filter, setFilter] = useState("All Models");
  const [liveVehicles, setLiveVehicles] = useState<LiveVehicleDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      const data = await fetchLiveVehicles();
      if (isMounted) {
        setLiveVehicles(data);
        setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredVehicles = useMemo(() => {
    if (filter === "All Models") return liveVehicles;
    const targetCategory = NAV_CATEGORIES.find(
      (cat) => cat.name.toLowerCase() === filter.toLowerCase()
    );
    if (!targetCategory) {
      return liveVehicles.filter(v => v.category.toLowerCase().includes(filter.toLowerCase()));
    }
    return liveVehicles.filter((v) => 
      targetCategory.models.includes(v.slug) || 
      targetCategory.models.includes(`toyota-${v.slug}`) ||
      v.category.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, liveVehicles]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      
      {/* 5K DISCOUNT BANNER */}
      <div className="max-w-7xl mx-auto mb-10 bg-[#EB0A1E] text-white py-3.5 px-6 rounded-2xl text-center text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-red-500/10">
        <Sparkles className="w-4.5 h-4.5 fill-white" />
        ⚡ ONLINE EXCLUSIVE: Get ₹5,000 instant discount on final invoice when you book online today.
      </div>

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="space-y-4">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
            Laxmi Toyota Showroom
          </span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Our Vehicle Lineup</h1>
          <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
            Browse through our premium range of hatchbacks, sedans, SUVs, hybrids, and luxury utility vehicles. Secure your allocation online to unlock priority delivery and bonuses.
          </p>
        </div>

        {/* Filter categories tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-5 overflow-x-auto whitespace-nowrap scrollbar-none no-scrollbar">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border shrink-0 ${
                  filter === cat
                    ? "bg-[#EB0A1E] text-white border-[#EB0A1E] shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Category SEO crosslinks */}
        <div className="flex flex-wrap gap-3 text-xs font-bold text-slate-450 uppercase tracking-wider pt-2">
          <span>Explore Segments:</span>
          {["suv", "sedan", "hatchback", "hybrid", "electric", "luxury"].map((c) => (
            <Link key={c} href={`/vehicles/${c}`} className="text-[#EB0A1E] hover:underline">
              {c.toUpperCase()}s
            </Link>
          ))}
        </div>

        {/* Grid Catalog */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.slug}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-md shadow-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:border-[#EB0A1E]/30 transition-all flex flex-col justify-between group"
            >
              <div className="relative h-56 overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={vehicle.imageUrl || vehicle.heroImage || DEFAULT_BRANDED_CAR_IMAGE}
                  alt={vehicle.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_BRANDED_CAR_IMAGE;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-slate-900/90 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                  {vehicle.type}
                </span>
                <span className="absolute top-4 right-4 bg-[#EB0A1E] text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded shadow">
                  {vehicle.stockBadge}
                </span>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-slate-900">{vehicle.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{vehicle.spec}</p>
                  <div className="flex justify-between items-baseline pt-3 border-t border-slate-100 mt-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Starts Ex-Showroom</span>
                    <span className="text-lg font-black text-slate-950">{vehicle.price.startsWith("₹") ? vehicle.price : `₹${vehicle.price}`}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-3 text-xs">
                  <Link
                    href={`/vehicles/toyota-${vehicle.slug}`}
                    className="flex-1 text-center py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold uppercase tracking-wider transition-colors"
                  >
                    View Specs
                  </Link>
                  <Link
                    href={`/book/${vehicle.slug}`}
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
