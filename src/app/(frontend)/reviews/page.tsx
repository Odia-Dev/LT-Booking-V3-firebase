"use client";

import React, { useState } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Star, Quote, ChevronLeft, ChevronRight, ThumbsUp, Award, Sparkles } from "lucide-react";

const REVIEWS = [
  {
    id: 1,
    name: "Santosh Kumar Rath",
    location: "Brahmapur",
    vehicle: "Toyota Fortuner",
    rating: 5,
    date: "June 2026",
    review: "Absolutely fantastic experience from start to finish. The team at Laxmi Toyota Brahmapur made my Fortuner dream come true with zero hassle. Online booking was smooth and the delivery ceremony was memorable.",
    avatar: "SK",
    verified: true,
  },
  {
    id: 2,
    name: "Priyanka Behera",
    location: "Jeypore",
    vehicle: "Innova Hycross",
    rating: 5,
    date: "May 2026",
    review: "The Jeypore showroom staff were incredibly knowledgeable about the Hycross hybrid system. They explained every feature patiently. The booking process online was very convenient — saved me two trips to the showroom.",
    avatar: "PB",
    verified: true,
  },
  {
    id: 3,
    name: "Rajesh Panigrahi",
    location: "Brahmapur",
    vehicle: "Urban Cruiser Hyryder",
    rating: 5,
    date: "May 2026",
    review: "Booked the Hyryder online and got priority delivery within 3 weeks. The ₹5,000 invoice bonus was applied exactly as promised. Transparent pricing, genuine staff. Laxmi Toyota truly stands by its word.",
    avatar: "RP",
    verified: true,
  },
  {
    id: 4,
    name: "Mamata Panda",
    location: "Bargarh",
    vehicle: "Toyota Glanza",
    rating: 5,
    date: "April 2026",
    review: "First car for our family and we could not have chosen a better place. The Bargarh team gave us detailed finance and insurance guidance. The Glanza is a joy to drive and the service center is excellent.",
    avatar: "MP",
    verified: true,
  },
  {
    id: 5,
    name: "Suresh Nayak",
    location: "Rayagada",
    vehicle: "Toyota Hilux",
    rating: 5,
    date: "March 2026",
    review: "Needed a robust vehicle for our construction business and the Hilux recommendation was spot-on. The Rayagada team handled all paperwork and delivered on time. Toyota quality is unmatched for commercial use.",
    avatar: "SN",
    verified: true,
  },
  {
    id: 6,
    name: "Archana Mishra",
    location: "Brahmapur",
    vehicle: "Toyota Taisor",
    rating: 5,
    date: "February 2026",
    review: "Loved the Taisor from the moment I saw it at the showroom. The test drive experience was brilliant and the turbo engine is fun on Brahmapur's city roads. Quick delivery and very supportive staff throughout.",
    avatar: "AM",
    verified: true,
  },
  {
    id: 7,
    name: "Bibhuti Bhusan Das",
    location: "Balangir",
    vehicle: "Toyota Rumion",
    rating: 4,
    date: "January 2026",
    review: "The Rumion is perfect for our 7-member family. Good space, comfortable ride. The Balangir team was helpful. Delivery took a bit longer than expected due to high demand, but overall a positive experience.",
    avatar: "BD",
    verified: true,
  },
  {
    id: 8,
    name: "Lipika Sahoo",
    location: "Paralakhemundi",
    vehicle: "Urban Cruiser Hyryder AWD",
    rating: 5,
    date: "December 2025",
    review: "The AWD Hyryder is exceptional on hilly roads near Paralakhemundi. We use it for both city and highway driving — the hybrid system saves significant fuel. Laxmi Toyota team is always available for any queries.",
    avatar: "LS",
    verified: true,
  },
];

const RATING_BREAKDOWN = [
  { stars: 5, count: 87, pct: 89 },
  { stars: 4, count: 8, pct: 8 },
  { stars: 3, count: 2, pct: 2 },
  { stars: 2, count: 1, pct: 1 },
  { stars: 1, count: 0, pct: 0 },
];

export default function ReviewsPage() {
  const [featured, setFeatured] = useState(0);

  const prev = () => setFeatured((f) => (f === 0 ? REVIEWS.length - 1 : f - 1));
  const next = () => setFeatured((f) => (f === REVIEWS.length - 1 ? 0 : f + 1));

  const featuredReview = REVIEWS[featured];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Promo Banner */}
      <div className="bg-[#EB0A1E] text-white py-3 px-4 text-center text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 fill-white" />
        ⚡ Join 3,000+ satisfied Toyota owners in South Odisha — Book Online Today!
      </div>

      {/* Header */}
      <div className="bg-slate-950 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] border border-red-900 bg-red-950/50 px-3 py-1 rounded">
            Customer Testimonials
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            What Our Customers Say
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            Over 3,000 Toyota deliveries across South Odisha. Here&apos;s what our customers experience.
          </p>
          {/* Overall Rating */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className="w-7 h-7 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <div className="text-left">
              <p className="text-3xl font-black text-white">4.8</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">98 Reviews</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Rating Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#EB0A1E]" /> Rating Breakdown
            </h2>
            {RATING_BREAKDOWN.map((r) => (
              <div key={r.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 shrink-0 w-16">
                  <span className="text-xs font-bold text-slate-500">{r.stars}</span>
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </div>
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-amber-400 h-2 rounded-full transition-all"
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-400 shrink-0 w-6">{r.count}</span>
              </div>
            ))}
          </div>

          {/* Featured Review Carousel */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm relative">
            <Quote className="w-8 h-8 text-[#EB0A1E]/20 mb-4" />
            <div className="flex items-center gap-1 mb-3">
              {[1,2,3,4,5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${s <= featuredReview.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                />
              ))}
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-medium italic mb-6">
              &ldquo;{featuredReview.review}&rdquo;
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[#EB0A1E] rounded-full flex items-center justify-center text-white font-black text-sm">
                  {featuredReview.avatar}
                </div>
                <div>
                  <p className="font-black text-slate-900 text-sm">{featuredReview.name}</p>
                  <p className="text-xs text-slate-400">{featuredReview.vehicle} · {featuredReview.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={next}
                  className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setFeatured(i)}
                  className={`h-1.5 rounded-full transition-all ${i === featured ? "w-6 bg-[#EB0A1E]" : "w-1.5 bg-slate-200"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* All Reviews Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900">All Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REVIEWS.map((r) => (
              <div key={r.id} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4 hover:shadow-md transition-all hover:border-[#EB0A1E]/20">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-600 text-sm shrink-0">
                      {r.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-black text-slate-900 text-sm">{r.name}</p>
                        {r.verified && (
                          <span title="Verified Buyer">
                            <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold">{r.location} · {r.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    {[1,2,3,4,5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= r.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-2 py-0.5 rounded mb-2">
                    {r.vehicle}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">&ldquo;{r.review}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-950 text-white rounded-3xl p-10 text-center space-y-5">
          <h2 className="text-3xl font-black">Join Our Happy Customers</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Book your Toyota online today and experience the Laxmi Toyota difference firsthand.
          </p>
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 bg-[#EB0A1E] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-colors"
          >
            <Sparkles className="w-4 h-4" /> Explore & Book Online
          </Link>
        </div>
      </div>
    </div>
  );
}
