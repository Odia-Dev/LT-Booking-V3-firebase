"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error500Page() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-6 max-w-md">
        
        <AlertCircle className="w-16 h-16 text-[#EB0A1E] mx-auto animate-pulse" />

        <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-[#EB0A1E]/10 border border-[#EB0A1E]/20 px-3 py-1 rounded">
          Error 500
        </span>

        <h1 className="text-4xl font-black tracking-tight text-white leading-none">
          Server Error
        </h1>

        <p className="text-zinc-400 text-xs leading-relaxed max-w-xs mx-auto">
          An internal server error occurred while retrieving our database. Please refresh or retry.
        </p>

        <div className="pt-4 flex justify-center text-xs">
          <button
            onClick={() => window.location.reload()}
            className="bg-[#EB0A1E] text-white px-8 py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-red-700 transition-all flex items-center gap-1.5 shadow-md shadow-red-500/10"
          >
            <RefreshCw className="w-4 h-4" /> Reload Page
          </button>
        </div>

      </div>
    </div>
  );
}
