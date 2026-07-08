"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Image as ImageIcon, ArrowLeft } from "lucide-react";

const IMAGES = [
  { url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600", title: "Laxmi Toyota Showroom Bay" },
  { url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600", title: "Premium Delivery Gate" },
  { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600", title: "Accessories Lounge Area" },
  { url: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800", title: "Express Servicing Workshop" },
  { url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200", title: "Official Vehicle Handover" },
  { url: "https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?auto=format&fit=crop&q=80&w=600", title: "Customer Interaction Desk" }
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-4 text-center">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
            Showroom Showcase
          </span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight pt-2">Dealership Gallery</h1>
          <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
            Take a visual tour. Explore our state-of-the-art vehicle delivery bays, premium servicing centers, and interaction areas across Ganjam.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {IMAGES.map((img, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:border-[#EB0A1E]/30 transition-all group relative"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="text-white text-[10px] font-bold uppercase tracking-wider bg-[#EB0A1E] px-3 py-1.5 rounded-lg shadow">
                    Laxmi Toyota
                  </span>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#EB0A1E]" /> {img.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
