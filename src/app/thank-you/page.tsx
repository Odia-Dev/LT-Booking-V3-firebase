"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Home, Calendar } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
        
        <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Thank You!</h1>
          <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">
            Your inquiry or request has been logged. Our dealership relationship desk will get in touch with you shortly.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
          <Link
            href="/"
            className="w-full text-center py-3.5 bg-[#EB0A1E] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-750 transition-colors shadow-md shadow-red-500/10 flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <Link
            href="/vehicles"
            className="w-full text-center py-3.5 bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
          >
            Browse Fleet
          </Link>
        </div>

      </div>
    </div>
  );
}
