"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, BookOpen, User, ShieldCheck } from "lucide-react";

interface Params {
  slug: string;
}

const BLOG_DATA: Record<string, {
  title: string;
  desc: string;
  date: string;
  duration: string;
  author: string;
  content: string[];
  img: string;
}> = {
  "toyota-hybrid-maintenance": {
    title: "Caring for Your Self-Charging Hybrid",
    desc: "Understanding the simple steps to maximize the life of your Toyota Hybrid battery and powertrain.",
    date: "July 01, 2026",
    duration: "5 min read",
    author: "Laxmi Service Desk",
    img: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200",
    content: [
      "Toyota self-charging hybrids are designed to be extremely low maintenance, requiring no external plug-in charging while delivering industry-leading mileage and exceptionally quiet cabins.",
      "The primary battery charge is managed automatically via regenerative braking, which converts kinetic energy into electricity during deceleration and braking.",
      "To maximize battery efficiency, avoid harsh braking when possible, keep the battery air vents clean, and service the cooling filter regularly at Laxmi Toyota's certified workshops in South Odisha."
    ]
  },
  "top-suvs-for-odisha": {
    title: "Top Toyota SUVs for Odisha Roads",
    desc: "A comparison guide between Taisor, Hyryder, and Fortuner to decide which segment fits your family best.",
    date: "June 25, 2026",
    duration: "7 min read",
    author: "Laxmi Sales Desk",
    img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200",
    content: [
      "Odisha's diverse terrain demands vehicle chassis with high ground clearance, robust suspension, and intelligent drive assists.",
      "For urban commutes and agile maneuvers, the Toyota Taisor offers high value. The Urban Cruiser Hyryder steps in with self-charging hybrid economy, making it ideal for daily travel.",
      "For rugged off-roading and highway command, the legendary Toyota Fortuner stands unrivaled, featuring active 4WD drive modes and premium leather cabin trims."
    ]
  },
  "why-book-online-advantage": {
    title: "The Self-Serve Booking Advantage",
    desc: "How booking your Toyota online guarantees priority delivery ranks and invoice bonus claims.",
    date: "June 18, 2026",
    duration: "4 min read",
    author: "CRM Desk Manager",
    img: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200",
    content: [
      "To streamline delivery timelines, Laxmi Toyota has launched a 100% digital self-serve reservation booking funnel with zero middleman interventions.",
      "By reserving your model online via Razorpay, your allocation rank is locked directly on the official order dispatch system.",
      "Furthermore, all online reservations automatically claim a ₹5,000 cash discount applied directly to your final registration invoice."
    ]
  }
};

export default function BlogDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = use(params);
  const blog = BLOG_DATA[slug];

  if (!blog) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Article Not Found</h2>
        <p className="text-slate-500 text-xs mb-6">The article you are looking for does not exist in our newsroom.</p>
        <Link href="/blog" className="bg-slate-950 text-white px-6 py-3 rounded-lg font-bold text-xs uppercase hover:bg-[#EB0A1E] transition-colors">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xl">
        
        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-[#EB0A1E] transition-colors gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Newsroom
        </Link>

        {/* Metadata */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {blog.title}
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">{blog.desc}</p>
          
          <div className="flex flex-wrap gap-4 pt-2 border-y border-slate-100 py-3 text-xs text-slate-400 font-bold uppercase tracking-wider justify-between items-center">
            <div className="flex gap-4 items-center">
              <span className="flex items-center gap-1"><User className="w-4 h-4 text-[#EB0A1E]" /> By {blog.author}</span>
              <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {blog.duration}</span>
            </div>
            <span>{blog.date}</span>
          </div>
        </div>

        {/* Media */}
        <div className="h-64 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 border border-slate-150">
          <img
            src={blog.img}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Paragraphs */}
        <div className="space-y-6 text-slate-650 text-sm leading-relaxed pt-2">
          {blog.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Verification banner */}
        <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex items-center gap-3 mt-8">
          <ShieldCheck className="w-6 h-6 text-[#EB0A1E] shrink-0" />
          <p className="text-[10px] text-slate-500 leading-normal">
            This article is officially published by Laxmi Toyota's CRM & Technical Service Desk. All content is for informational purposes under brand guidelines.
          </p>
        </div>

      </div>
    </div>
  );
}
