"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Calendar, ArrowRight, Sparkles } from "lucide-react";

const BLOGS = [
  { slug: "toyota-hybrid-maintenance", title: "Caring for Your Self-Charging Hybrid", desc: "Understanding the simple steps to maximize the life of your Toyota Hybrid battery and powertrain.", date: "July 01, 2026", duration: "5 min read", img: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600" },
  { slug: "top-suvs-for-odisha", title: "Top Toyota SUVs for Odisha Roads", desc: "A comparison guide between Taisor, Hyryder, and Fortuner to decide which segment fits your family best.", date: "June 25, 2026", duration: "7 min read", img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600" },
  { slug: "why-book-online-advantage", title: "The Self-Serve Booking Advantage", desc: "How booking your Toyota online guarantees priority delivery ranks and invoice bonus claims.", date: "June 18, 2026", duration: "4 min read", img: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=600" }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      
      {/* 5K DISCOUNT BANNER */}
      <div className="max-w-4xl mx-auto mb-10 bg-[#EB0A1E] text-white py-3.5 px-6 rounded-2xl text-center text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2">
        <Sparkles className="w-4.5 h-4.5 fill-white" />
        ⚡ ONLINE EXCLUSIVE: Get ₹5,000 instant discount on final invoice when you book online today.
      </div>

      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="space-y-4">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
            Toyota Insights
          </span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Laxmi Toyota Newsroom</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Stay updated with the latest Toyota launches, hybrid technologies, maintenance tips, and exclusive events across our South Odisha showrooms.
          </p>
        </div>

        {/* Blogs grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOGS.map((blog) => (
            <Link
              key={blog.slug}
              href={`/blog/${blog.slug}`}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:border-[#EB0A1E]/30 transition-all flex flex-col justify-between group"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={blog.img}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{blog.duration}</span>
                    <span>{blog.date}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight group-hover:text-[#EB0A1E] transition-colors">{blog.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{blog.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-[#EB0A1E] uppercase tracking-wider flex items-center gap-1 group-hover:underline">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
