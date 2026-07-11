"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, Grid3X3, LayoutList, Sparkles } from "lucide-react";

const GALLERY_ITEMS = [
  { id: 1, category: "Showroom", title: "Brahmapur Flagship Showroom", img: "https://images.unsplash.com/photo-1567449303078-57ad995bd17e?auto=format&fit=crop&q=80&w=800" },
  { id: 2, category: "Vehicles", title: "Toyota Fortuner — South Odisha Roads", img: "https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?auto=format&fit=crop&q=80&w=800" },
  { id: 3, category: "Vehicles", title: "Innova Hycross — Hybrid MPV", img: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800" },
  { id: 4, category: "Vehicles", title: "Urban Cruiser Hyryder AWD", img: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800" },
  { id: 5, category: "Vehicles", title: "Toyota Glanza — City Hatchback", img: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800" },
  { id: 6, category: "Vehicles", title: "Toyota Taisor — Compact SUV", img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800" },
  { id: 7, category: "Delivery", title: "Vehicle Delivery Ceremony — Brahmapur", img: "https://images.unsplash.com/photo-1562519819-016930ada31a?auto=format&fit=crop&q=80&w=800" },
  { id: 8, category: "Showroom", title: "Service Bay — Toyota Certified Workshop", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800" },
  { id: 9, category: "Vehicles", title: "Toyota Camry — Luxury Sedan", img: "https://images.unsplash.com/photo-1503376710915-18861d9a2638?auto=format&fit=crop&q=80&w=800" },
  { id: 10, category: "Events", title: "Toyota Launch Event — Innova Hycross", img: "https://images.unsplash.com/photo-1519574226792-a5c7082b91d4?auto=format&fit=crop&q=80&w=800" },
  { id: 11, category: "Vehicles", title: "Toyota Hilux — Lifestyle Utility Pickup", img: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800" },
  { id: 12, category: "Events", title: "Customer Appreciation Drive 2025", img: "https://images.unsplash.com/photo-1441148345475-03e0e1ecff96?auto=format&fit=crop&q=80&w=800" },
  { id: 13, category: "Delivery", title: "Fortuner Delivery — Happy Customer", img: "https://images.unsplash.com/photo-1612859197716-d677e7bb4ca6?auto=format&fit=crop&q=80&w=800" },
  { id: 14, category: "Showroom", title: "Jeypore Showroom Interior", img: "https://images.unsplash.com/photo-1547987083-b2e07e2c0e35?auto=format&fit=crop&q=80&w=800" },
  { id: 15, category: "Vehicles", title: "Toyota Rumion — Family MPV", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800" },
  { id: 16, category: "Events", title: "Hybrid Awareness Camp — Brahmapur 2026", img: "https://images.unsplash.com/photo-1517524008436-a3851f153a77?auto=format&fit=crop&q=80&w=800" },
];

const CATEGORIES = ["All", "Vehicles", "Showroom", "Delivery", "Events"];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = activeCategory === "All"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((g) => g.category === activeCategory);

  const openLightbox = (id: number) => setLightbox(id);
  const closeLightbox = () => setLightbox(null);

  const lightboxItem = lightbox !== null ? GALLERY_ITEMS.find((g) => g.id === lightbox) : null;
  const lightboxIndex = lightbox !== null ? filtered.findIndex((g) => g.id === lightbox) : -1;

  const prevLightbox = () => {
    if (lightboxIndex > 0) setLightbox(filtered[lightboxIndex - 1].id);
  };
  const nextLightbox = () => {
    if (lightboxIndex < filtered.length - 1) setLightbox(filtered[lightboxIndex + 1].id);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Lightbox */}
      {lightbox !== null && lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
          {lightboxIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full bg-white/10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          {lightboxIndex < filtered.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full bg-white/10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxItem.img}
              alt={lightboxItem.title}
              className="w-full max-h-[75vh] object-contain rounded-2xl"
            />
            <div className="mt-4 text-center">
              <p className="text-white font-bold">{lightboxItem.title}</p>
              <p className="text-white/50 text-xs mt-1">{lightboxItem.category} · {lightboxIndex + 1} / {filtered.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Banner */}
      <div className="bg-[#EB0A1E] text-white py-3 px-4 text-center text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 fill-white" />
        ⚡ Book your Toyota online — ₹5,000 exclusive invoice discount!
      </div>

      {/* Header */}
      <div className="bg-slate-950 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] border border-red-900 bg-red-950/50 px-3 py-1 rounded">
            Photo Gallery
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Laxmi Toyota Gallery
          </h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
            Explore our showrooms, vehicle lineup, delivery ceremonies, and community events across South Odisha.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                  activeCategory === cat
                    ? "bg-[#EB0A1E] text-white border-[#EB0A1E]"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 border border-slate-200 bg-white rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-slate-950 text-white" : "text-slate-400 hover:text-slate-700"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-slate-950 text-white" : "text-slate-400 hover:text-slate-700"}`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400 font-semibold">{filtered.length} photos</p>

        {/* Gallery Grid */}
        {viewMode === "grid" ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-2xl"
                onClick={() => openLightbox(item.id)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{item.category}</span>
                    <p className="text-white font-bold text-sm leading-tight">{item.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden flex items-center gap-5 cursor-pointer hover:border-[#EB0A1E]/30 hover:shadow-md transition-all p-3"
                onClick={() => openLightbox(item.id)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.img} alt={item.title} className="w-24 h-16 object-cover rounded-xl shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-[#EB0A1E] uppercase tracking-widest">{item.category}</span>
                  <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="bg-slate-950 text-white rounded-3xl p-10 text-center space-y-5 mt-8">
          <h2 className="text-2xl font-black">Own a Toyota. Create Your Own Story.</h2>
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 bg-[#EB0A1E] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-colors"
          >
            <Sparkles className="w-4 h-4" /> Browse & Book Online
          </Link>
        </div>
      </div>
    </div>
  );
}
