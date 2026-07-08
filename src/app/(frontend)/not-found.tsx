"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-6 max-w-md">
        
        <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-[#EB0A1E]/10 border border-[#EB0A1E]/20 px-3 py-1 rounded">
          Error 404
        </span>

        <h1 className="text-5xl font-black tracking-tight text-white leading-none">
          Page Not Found
        </h1>

        <p className="text-zinc-400 text-xs leading-relaxed max-w-xs mx-auto">
          The link you followed may be broken, or the page has been moved. Let's redirect you to safety.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center text-xs">
          <Link
            href="/"
            className="bg-[#EB0A1E] text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-red-700 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-red-500/10"
          >
            <ArrowLeft className="w-4 h-4" /> Go to Home
          </Link>
          <Link
            href="/vehicles"
            className="bg-zinc-900 border border-zinc-800 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-zinc-800 transition-all"
          >
            Browse Fleet
          </Link>
        </div>

      </div>
    </div>
  );
}
