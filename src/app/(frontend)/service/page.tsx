"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Calendar, Wrench, ShieldCheck, Clock, Users } from "lucide-react";

export default function ServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-4 text-center">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
            Laxmi Toyota Service
          </span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight pt-2">Expert Care & Service</h1>
          <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
            Keep your Toyota running like new. Our certified technicians use 100% genuine parts to deliver express servicing, repair, and specialized hybrid maintenance.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <Clock className="w-6 h-6 text-[#EB0A1E]" />
            <h3 className="font-extrabold text-sm text-slate-900">Express Maintenance</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Standard service completed in just 60 minutes with absolute precision.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <Wrench className="w-6 h-6 text-[#EB0A1E]" />
            <h3 className="font-extrabold text-sm text-slate-900">Certified Techs</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Toyota global certified mechanics using state-of-the-art diagnostic kits.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <ShieldCheck className="w-6 h-6 text-[#EB0A1E]" />
            <h3 className="font-extrabold text-sm text-slate-900">Genuine Parts</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Only OEM-approved high-durability genuine parts used for all repairs.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-slate-950 text-white p-8 rounded-3xl text-center space-y-5 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-950/20 to-transparent pointer-events-none" />
          <h3 className="text-xl font-extrabold">Book Your Appointment Online</h3>
          <p className="text-slate-450 text-xs max-w-sm mx-auto leading-relaxed">
            Schedule a service visit online. Choose your time slot, describe the vehicle issues, and claim an express drop off.
          </p>
          <div className="pt-2">
            <Link
              href="/service/book-service"
              className="inline-block bg-[#EB0A1E] hover:bg-red-750 text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-red-500/10"
            >
              Book Service Slot
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
