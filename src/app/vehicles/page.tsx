"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Car, ChevronRight, SlidersHorizontal, Info, Sparkles } from "lucide-react";

const VEHICLES = [
  { slug: "toyota-glanza", name: "Toyota Glanza", type: "Hatchback", category: "hatchback", price: "₹6.81 Lakh", booking: "₹11,000", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600" },
  { slug: "toyota-urban-cruiser-taisor", name: "Toyota Taisor", type: "Compact SUV", category: "suv", price: "₹7.74 Lakh", booking: "₹11,000", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600" },
  { slug: "toyota-rumion", name: "Toyota Rumion", type: "MPV", category: "hybrid", price: "₹10.44 Lakh", booking: "₹21,000", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600" },
  { slug: "toyota-urban-cruiser-hyryder", name: "Urban Cruiser Hyryder", type: "SUV", category: "hybrid", price: "₹11.14 Lakh", booking: "₹25,000", image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800" },
  { slug: "toyota-urban-cruiser-ebella", name: "Urban Cruiser Ebella", type: "Electric SUV", category: "electric", price: "₹12.00 Lakh", booking: "₹25,000", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600" },
  { slug: "toyota-innova-crysta", name: "Toyota Innova Crysta", type: "MPV", category: "luxury", price: "₹19.99 Lakh", booking: "₹50,000", image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=600" },
  { slug: "toyota-innova-hycross", name: "Innova Hycross", type: "MPV", category: "hybrid", price: "₹18.86 Lakh", booking: "₹50,000", image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200" },
  { slug: "toyota-fortuner", name: "Toyota Fortuner", type: "SUV", category: "suv", price: "₹33.43 Lakh", booking: "₹1,00,000", image: "https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?auto=format&fit=crop&q=80&w=600" },
  { slug: "toyota-fortuner-legender", name: "Toyota Fortuner Legender", type: "SUV", category: "suv", price: "₹43.66 Lakh", booking: "₹1,00,000", image: "https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?auto=format&fit=crop&q=80&w=600" },
  { slug: "toyota-hilux", name: "Toyota Hilux", type: "Utility Pickup", category: "suv", price: "₹30.40 Lakh", booking: "₹1,00,000", image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=600" },
  { slug: "toyota-camry", name: "Toyota Camry", type: "Luxury Sedan", category: "sedan", price: "₹46.17 Lakh", booking: "₹1,00,000", image: "https://images.unsplash.com/photo-1503376710915-18861d9a2638?auto=format&fit=crop&q=80&w=600" },
  { slug: "toyota-vellfire", name: "Toyota Vellfire", type: "Luxury MPV", category: "luxury", price: "₹1.20 Crore", booking: "₹2,00,050", image: "https://images.unsplash.com/photo-1517524008436-a3851f153a77?auto=format&fit=crop&q=80&w=600" },
  { slug: "toyota-landcruiser300", name: "Land Cruiser 300", type: "Luxury SUV", category: "luxury", price: "₹2.10 Crore", booking: "₹20,00,000", image: "https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?auto=format&fit=crop&q=80&w=600" }
];

const CATEGORIES = [
  { id: "all", name: "All Models" },
  { id: "suv", name: "SUVs" },
  { id: "sedan", name: "Sedans" },
  { id: "hatchback", name: "Hatchbacks" },
  { id: "hybrid", name: "Hybrids" },
  { id: "electric", name: "Electric (EV)" },
  { id: "luxury", name: "Luxury Lounge" }
];

export default function VehiclesIndexPage() {
  const [filter, setFilter] = useState("all");

  const filteredVehicles = filter === "all" 
    ? VEHICLES 
    : VEHICLES.filter(v => v.category === filter || (filter === "hybrid" && v.type.toLowerCase().includes("hybrid")));

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
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-5">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 mr-2" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                filter === cat.id
                  ? "bg-slate-950 text-white border-slate-950 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
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
              <div className="relative h-56 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-slate-900/90 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                  {vehicle.type}
                </span>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-slate-900">{vehicle.name}</h3>
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-xs text-slate-400 font-bold uppercase">Starting Ex-Showroom</span>
                    <span className="text-lg font-black text-slate-950">{vehicle.price}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-3 text-xs">
                  <Link
                    href={`/vehicles/${vehicle.slug}`}
                    className="flex-1 text-center py-3 bg-slate-100 hover:bg-slate-250 text-slate-800 rounded-xl font-bold uppercase tracking-wider transition-colors"
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
