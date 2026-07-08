"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, ArrowRight, ArrowLeft } from "lucide-react";

const BRANCHES = [
  { slug: "brahmapur", name: "Brahmapur", district: "Ganjam", phone: "+91 94370 00001" },
  { slug: "jeypore", name: "Jeypore", district: "Koraput", phone: "+91 94370 00002" },
  { slug: "bargarh", name: "Bargarh", district: "Bargarh", phone: "+91 94370 00003" },
  { slug: "balangir", name: "Balangir", district: "Balangir", phone: "+91 94370 00004" },
  { slug: "rayagada", name: "Rayagada", district: "Rayagada", phone: "+91 94370 00005" },
  { slug: "bhawanipatna", name: "Bhawanipatna", district: "Kalahandi", phone: "+91 94370 00006" },
  { slug: "paralakhemundi", name: "Paralakhemundi", district: "Gajapati", phone: "+91 94370 00007" },
  { slug: "aska", name: "Aska", district: "Ganjam", phone: "+91 94370 00008" }
];

export default function BranchesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Back Link & Header */}
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
              Laxmi Toyota Network
            </span>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 pt-2">
              Our Showroom Branches
            </h1>
            <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
              Explore Laxmi Toyota state-of-the-art showrooms and service stations spread across Odisha. Click on any branch to schedule vehicle bookings and localized test drives.
            </p>
          </div>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BRANCHES.map((b) => (
            <div 
              key={b.slug} 
              className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-lg shadow-slate-100/50 hover:shadow-xl hover:shadow-slate-200/50 hover:border-[#EB0A1E]/30 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center text-[#EB0A1E] group-hover:bg-[#EB0A1E] group-hover:text-white transition-colors duration-350">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{b.name} Branch</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">District: {b.district}</span>
                </div>
                
                <div className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-[#EB0A1E]" />
                    <span>{b.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span>{b.slug}@laxmitoyota.co.in</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/branches/${b.slug}`}
                className="inline-flex items-center justify-center w-full bg-slate-950 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#EB0A1E] transition-all mt-6 gap-1"
              >
                Visit Branch Page <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
