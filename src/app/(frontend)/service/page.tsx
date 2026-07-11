import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Wrench, ShieldCheck, Clock, Star, ChevronRight,
  Zap, RefreshCcw, Settings, Sparkles, Phone
} from "lucide-react";

export const metadata: Metadata = {
  title: "Toyota Service & Maintenance — Laxmi Toyota South Odisha",
  description: "Book Toyota-certified service at Laxmi Toyota. Periodic maintenance, body shop, AC service, hybrid battery checks, and more across 8 branches in South Odisha.",
  keywords: "Toyota service Odisha, Toyota workshop Brahmapur, car service Toyota, hybrid service Odisha",
};

const SERVICE_TYPES = [
  {
    icon: RefreshCcw,
    title: "Periodic Maintenance Service",
    desc: "Scheduled oil change, filter replacement, tire rotation, and full vehicle health check as per Toyota's recommended intervals.",
    price: "From ₹2,499",
    time: "2–3 Hours",
  },
  {
    icon: Zap,
    title: "Hybrid Battery Health Check",
    desc: "Diagnostic scan and performance test for Toyota Hybrid (NiMH/Li-Ion) battery packs. Brahmapur and Jeypore branches are Toyota Hybrid Certified.",
    price: "From ₹999",
    time: "1 Hour",
  },
  {
    icon: Settings,
    title: "Engine & Transmission Service",
    desc: "Full engine diagnostics, transmission fluid change, throttle body cleaning, and spark plug replacement using 100% genuine Toyota parts.",
    price: "From ₹3,999",
    time: "4–6 Hours",
  },
  {
    icon: ShieldCheck,
    title: "Toyota Body Shop & Painting",
    desc: "Certified dent repair, panel replacement, and precision color-matched painting done by Toyota-trained body shop technicians.",
    price: "Estimate on Visit",
    time: "1–5 Days",
  },
  {
    icon: Star,
    title: "Accessories & Customization",
    desc: "OEM Toyota accessories — floor mats, dashboard cameras, seat covers, body kits, and infotainment upgrades — sourced from Toyota's official parts catalog.",
    price: "Varies",
    time: "Same Day",
  },
  {
    icon: Wrench,
    title: "AC & Electrical Service",
    desc: "Full AC system inspection, refrigerant top-up, condenser cleaning, and electrical fault diagnosis using Toyota TECHSTREAM diagnostic tools.",
    price: "From ₹1,499",
    time: "2–4 Hours",
  },
];

const TRUST_POINTS = [
  "Toyota-certified technicians at every branch",
  "100% genuine Toyota spare parts — no third-party substitutes",
  "Toyota TECHSTREAM diagnostic tools",
  "Digital service history maintained on Toyota One platform",
  "Transparent pricing — no surprise charges",
  "Post-service 7-day quality assurance warranty",
];

export default function ServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Promo Banner */}
      <div className="bg-[#EB0A1E] text-white py-3 px-4 text-center text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 fill-white" />
        ⚡ Book your new Toyota online — ₹5,000 exclusive invoice discount!
      </div>

      {/* Hero */}
      <div className="relative bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#EB0A1E20,_transparent_60%)]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1400"
          alt="Toyota Service Workshop"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-6">
          <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] border border-red-900 bg-red-950/50 px-3 py-1 rounded">
            Laxmi Toyota Service
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-2xl leading-tight">
            Toyota-Grade Service. Every Time.
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-xl">
            All 8 Laxmi Toyota branches are equipped with Toyota-certified service bays and genuine parts — 
            because your Toyota deserves nothing less.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/service/book-service"
              className="inline-flex items-center gap-2 bg-[#EB0A1E] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-colors"
            >
              <Wrench className="w-4 h-4" /> Book a Service Appointment
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-colors"
            >
              <Phone className="w-4 h-4" /> Call Your Branch
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">

        {/* Services Grid */}
        <section className="space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
              Our Services
            </span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">What We Offer</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Comprehensive Toyota-certified service solutions at all 8 of our Odisha branches.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_TYPES.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="bg-white border border-slate-200/80 rounded-2xl p-7 shadow-sm space-y-4 hover:shadow-md hover:border-[#EB0A1E]/30 transition-all"
                >
                  <div className="h-12 w-12 bg-[#EB0A1E]/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#EB0A1E]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-black text-slate-900">{s.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs font-bold">
                    <span className="text-[#EB0A1E]">{s.price}</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5" /> {s.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Trust Points */}
        <section className="bg-white border border-slate-200/80 rounded-3xl p-10 sm:p-16 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
                Why Service With Us
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                The Laxmi Toyota Service Promise
              </h2>
              <ul className="space-y-3">
                {TRUST_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-slate-700 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-950 text-white rounded-2xl p-7 space-y-4">
                <Wrench className="w-8 h-8 text-[#EB0A1E]" />
                <h3 className="text-xl font-black">Book Your Service Online</h3>
                <p className="text-slate-400 text-sm">Save time — pick your preferred branch, date, and service type online. Our team will confirm your slot within 2 hours.</p>
                <Link
                  href="/service/book-service"
                  className="inline-flex items-center gap-2 bg-[#EB0A1E] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-colors"
                >
                  Book Now <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
                <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl shrink-0">🏆</div>
                <div>
                  <p className="font-black text-slate-900 text-sm">Toyota Gold Dealer</p>
                  <p className="text-xs text-slate-500">Certified for highest service standards by Toyota India since 2015</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
