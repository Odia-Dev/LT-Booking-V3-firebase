import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Award, Users, MapPin, Star, Shield, Leaf,
  ChevronRight, Phone, Sparkles
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Laxmi Toyota — Toyota Authorized Dealer, South Odisha",
  description: "Laxmi Toyota is South Odisha's most trusted Toyota dealership with 8 branches, 3000+ deliveries, and 15+ years of excellence in Brahmapur, Jeypore, Bargarh and more.",
  keywords: "Laxmi Toyota About, Toyota dealer Odisha, Brahmapur Toyota, Toyota history South Odisha",
};

const MILESTONES = [
  { year: "2009", event: "Laxmi Toyota founded in Brahmapur with first showroom on NH-16" },
  { year: "2012", event: "Expanded to Jeypore serving Koraput & tribal districts" },
  { year: "2015", event: "Achieved Toyota's Gold Dealer certification for customer satisfaction" },
  { year: "2018", event: "Opened 5th showroom in Rayagada — 1000 vehicles delivered milestone" },
  { year: "2021", event: "Launched Hybrid-certified service infrastructure across all workshops" },
  { year: "2023", event: "Crossed 3,000 Toyota vehicle deliveries in South Odisha" },
  { year: "2024", event: "8th showroom opened in Aska — largest dealer network in Ganjam district" },
  { year: "2026", event: "Launched online booking platform — South Odisha's first digital Toyota booking portal" },
];

const STATS = [
  { label: "Toyota Deliveries", value: "3,000+", icon: "🚗" },
  { label: "Service Bays", value: "24", icon: "🔧" },
  { label: "Showroom Branches", value: "8", icon: "📍" },
  { label: "Years of Excellence", value: "15+", icon: "🏆" },
  { label: "Toyota Certified Staff", value: "150+", icon: "👨‍💼" },
  { label: "Customer Rating", value: "4.8 ★", icon: "⭐" },
];

const VALUES = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    desc: "No hidden charges. Every price quoted is the price you pay. Our booking system confirms exact amounts before payment.",
  },
  {
    icon: Star,
    title: "Customer First",
    desc: "Our customer satisfaction index (CSI) consistently ranks above the national Toyota average, backed by certified follow-up processes.",
  },
  {
    icon: Leaf,
    title: "Green Mobility",
    desc: "We are South Odisha's champions of hybrid and electric mobility, helping customers transition to fuel-efficient Toyota models.",
  },
  {
    icon: Award,
    title: "Toyota Certified",
    desc: "All our service technicians are trained directly by Toyota India. We use 100% genuine Toyota parts for all vehicles.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero */}
      <div className="relative bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#EB0A1E22,_transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] border border-red-900 bg-red-950/50 px-3 py-1 rounded mb-6">
            About Laxmi Toyota
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight max-w-3xl">
            South Odisha&apos;s Most Trusted Toyota Dealer
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-2xl mt-6">
            Since 2009, Laxmi Toyota has been the backbone of Toyota ownership in South Odisha — 
            serving families, businesses, and government institutions across 8 branches with integrity, 
            expertise, and the full power of the Toyota brand.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 bg-[#EB0A1E] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-colors"
            >
              <Sparkles className="w-4 h-4" /> Explore Vehicles
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-colors"
            >
              <Phone className="w-4 h-4" /> Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center space-y-1">
                <div className="text-3xl mb-1">{stat.icon}</div>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">

        {/* Our Story */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
              Our Story
            </span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              Born in Brahmapur. Built for Odisha.
            </h2>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                Laxmi Toyota was founded in 2009 with a single showroom on NH-16, Brahmapur — with a vision 
                to make world-class Toyota vehicles accessible to every family in South Odisha, from the 
                coastal belt to the highland tribal districts.
              </p>
              <p>
                What started with 12 employees and a single Corolla on the display floor has grown into 
                Odisha&apos;s most respected Toyota dealer network — spanning 8 showrooms, 150+ certified staff, 
                and over 3,000 Toyota deliveries that have earned us Toyota&apos;s Gold Dealer certification.
              </p>
              <p>
                We are not just selling cars. We are providing Odisha families with reliable, safe, 
                and fuel-efficient mobility — backed by India&apos;s most trusted automotive brand.
              </p>
            </div>
          </div>
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1567449303078-57ad995bd17e?auto=format&fit=crop&q=80&w=800"
              alt="Laxmi Toyota Showroom"
              className="rounded-3xl shadow-2xl w-full object-cover h-96"
            />
            <div className="absolute -bottom-6 -left-6 bg-[#EB0A1E] text-white p-5 rounded-2xl shadow-xl">
              <p className="text-3xl font-black">15+</p>
              <p className="text-xs font-bold uppercase tracking-wider text-red-200">Years of Service</p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
              What We Stand For
            </span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-white border border-slate-200/80 rounded-2xl p-7 shadow-sm space-y-4 hover:shadow-md hover:border-[#EB0A1E]/30 transition-all">
                  <div className="h-12 w-12 bg-[#EB0A1E]/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#EB0A1E]" />
                  </div>
                  <h3 className="text-base font-black text-slate-900">{v.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Timeline */}
        <section className="space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
              Our Journey
            </span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Key Milestones</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 hidden sm:block" />
            <div className="space-y-6">
              {MILESTONES.map((m, i) => (
                <div key={i} className="flex items-start gap-6">
                  <div className="relative shrink-0">
                    <div className="h-12 w-12 bg-[#EB0A1E] text-white rounded-xl flex items-center justify-center font-black text-xs shadow-md shadow-red-500/20 relative z-10">
                      {m.year.slice(2)}
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex-1 shadow-sm">
                    <p className="text-[10px] font-bold text-[#EB0A1E] uppercase tracking-widest mb-1">{m.year}</p>
                    <p className="text-sm font-semibold text-slate-700">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Branches CTA */}
        <section className="bg-slate-950 text-white rounded-3xl p-10 sm:p-16 text-center space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#EB0A1E15,_transparent_70%)]" />
          <div className="relative z-10 space-y-6">
            <MapPin className="w-10 h-10 text-[#EB0A1E] mx-auto" />
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Visit Us Across South Odisha</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
              With 8 showrooms in Brahmapur, Jeypore, Bargarh, Balangir, Rayagada, Bhawanipatna, Paralakhemundi and Aska — 
              a Laxmi Toyota dealership is never far away.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/branches"
                className="inline-flex items-center gap-2 bg-[#EB0A1E] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-colors"
              >
                <Users className="w-4 h-4" /> Find a Branch
              </Link>
              <Link
                href="/vehicles"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-colors"
              >
                Browse Vehicles <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
