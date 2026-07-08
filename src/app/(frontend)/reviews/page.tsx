"use client";

import React from "react";
import Link from "next/link";
import { Star, Quote, ShieldCheck } from "lucide-react";

const REVIEWS = [
  { name: "Debasish Mohanty", location: "Brahmapur", rating: 5, date: "June 24, 2026", text: "The online booking flow was extremely smooth. I paid my deposit using Razorpay, got an instant verification SMS, and my Hyryder allocation was confirmed the next morning. 10/10 service!" },
  { name: "Priya Ranjan Das", location: "Jeypore", rating: 5, date: "June 18, 2026", text: "Laxmi Toyota has outdone themselves with the new self-serve dashboard. Being able to track my booking status online and view ex-showroom costs transparently is a huge win for car buyers." },
  { name: "Manas Ranjan", location: "Balangir", rating: 5, date: "June 10, 2026", text: "I bought a Toyota Fortuner from their Balangir branch. The transaction was completely transparent, and I received my online-exclusive ₹5,000 cash discount as promised on my registration invoice." },
  { name: "Santosh Patra", location: "Rayagada", rating: 5, date: "May 28, 2026", text: "Excellent customer portal. I logged a callback request on their contact desk, and within an hour, a sales advisor from the Rayagada branch helped finalize my exchange valuation quote." }
];

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-4 text-center">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
            Client Testimonials
          </span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight pt-2">Customer Reviews</h1>
          <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
            See what our verified customers have to say about their self-serve booking and delivery experiences across Ganjam and South Odisha.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-md flex flex-col justify-between hover:border-[#EB0A1E]/30 transition-all relative"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex text-amber-400">
                    {[...Array(r.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{r.date}</span>
                </div>
                <p className="text-xs text-slate-550 leading-relaxed italic">"{r.text}"</p>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-6 flex justify-between items-center">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{r.name}</h4>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{r.location} Branch</span>
                </div>
                <div className="flex items-center gap-1 bg-blue-50 border border-blue-100 text-blue-600 text-[9px] font-bold px-2 py-1 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Customer
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
