"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Phone, Mail, Clock, ArrowLeft, Car, Calendar, ShieldCheck } from "lucide-react";

interface Branch {
  slug: string;
  name: string;
  district: string;
  phone: string;
  address: string;
}

const BRANCHES: Record<string, Branch> = {
  brahmapur: { slug: "brahmapur", name: "Brahmapur", district: "Ganjam", phone: "+91 94370 00001", address: "National Highway 16, Haldiapadar, Brahmapur, Odisha 760003" },
  jeypore: { slug: "jeypore", name: "Jeypore", district: "Koraput", phone: "+91 94370 00002", address: "NH-26, Jeypore Bypass Road, Jeypore, Odisha 764001" },
  bargarh: { slug: "bargarh", name: "Bargarh", district: "Bargarh", phone: "+91 94370 00003", address: "NH-53, Canal Avenue, Bargarh, Odisha 768028" },
  balangir: { slug: "balangir", name: "Balangir", district: "Balangir", phone: "+91 94370 00004", address: "Patnagarh Road, Balangir, Odisha 767001" },
  rayagada: { slug: "rayagada", name: "Rayagada", district: "Rayagada", phone: "+91 94370 00005", address: "Gunupur Road, Rayagada, Odisha 765001" },
  bhawanipatna: { slug: "bhawanipatna", name: "Bhawanipatna", district: "Kalahandi", phone: "+91 94370 00006", address: "NH-26, Bhawanipatna, Odisha 766001" },
  paralakhemundi: { slug: "paralakhemundi", name: "Paralakhemundi", district: "Gajapati", phone: "+91 94370 00007", address: "Palasa Road, Paralakhemundi, Odisha 761200" },
  aska: { slug: "aska", name: "Aska", district: "Ganjam", phone: "+91 94370 00008", address: "Bhanjanagar Road, Aska, Odisha 761111" }
};

interface BranchPageProps {
  params: Promise<{ slug: string }>;
}

export default function BranchDetailPage({ params }: BranchPageProps) {
  const { slug } = use(params);
  const branch = BRANCHES[slug.toLowerCase()];

  if (!branch) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Back Link */}
        <Link href="/branches" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors gap-1.5">
          <ArrowLeft className="w-4 h-4" /> View All Branches
        </Link>

        {/* Hero Section Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-100/80 space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
              Laxmi Toyota {branch.name}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 pt-2">
              Laxmi Toyota {branch.name} Showroom
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
              Welcome to the authorized Laxmi Toyota dealership in {branch.name}, {branch.district} district. We offer premium sales, spares, and service support for the entire Toyota passenger vehicle lineup.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-sm">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#EB0A1E] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Showroom Address</span>
                  <p className="text-slate-800 font-medium mt-0.5 leading-relaxed">{branch.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#EB0A1E] shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Contact Number</span>
                  <p className="text-slate-800 font-medium mt-0.5">{branch.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-slate-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Email Address</span>
                  <p className="text-slate-800 font-medium mt-0.5">{branch.slug}@laxmitoyota.co.in</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4 text-slate-500" /> Working Hours
              </h3>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Showroom Sales:</span>
                  <span className="font-semibold text-slate-800">09:00 AM - 08:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Workshops:</span>
                  <span className="font-semibold text-slate-800">08:30 AM - 06:30 PM</span>
                </div>
                <div className="flex justify-between border-t border-slate-200/60 pt-2 text-[#EB0A1E] font-semibold">
                  <span>Open Days:</span>
                  <span>Monday - Sunday</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="border border-slate-200 bg-slate-50 rounded-2xl h-60 flex flex-col items-center justify-center text-slate-400 text-xs font-medium space-y-2">
            <MapPin className="w-8 h-8 text-slate-300" />
            <span>Interactive Google Map Location coming soon</span>
          </div>

          {/* Localized CTA actions */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
            <Link
              href="/book-test-drive"
              className="flex-1 text-center py-4 bg-[#EB0A1E] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-4 h-4" /> Book a Test Drive in {branch.name}
            </Link>
            <Link
              href="/car-loan-eligibility"
              className="flex-1 text-center py-4 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" /> Apply for Finance Offer
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
