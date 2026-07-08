"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, RefreshCw, PhoneCall } from "lucide-react";

function FailedContent() {
  const searchParams = useSearchParams();
  const errorReason = searchParams.get("reason") || "Transaction cancelled by user or bank server timeout.";

  return (
    <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
      <AlertCircle className="h-16 w-16 text-red-500 mx-auto animate-bounce" />
      
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payment Failed</h1>
        <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">
          We could not process your booking deposit. No amount was debited from your card or wallet.
        </p>
      </div>

      <div className="bg-red-50 text-red-650 border border-red-100 p-4 rounded-xl text-left text-xs leading-relaxed">
        <span className="font-bold block uppercase text-[9px] text-red-400 tracking-wider mb-1">Error Details:</span>
        {errorReason}
      </div>

      <div className="pt-2 flex flex-col gap-3">
        <Link
          href="/vehicles"
          className="w-full text-center py-3.5 bg-[#EB0A1E] hover:bg-red-750 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Try Booking Again
        </Link>
        <Link
          href="/contact"
          className="w-full text-center py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#EB0A1E]" /> Contact Relations Desk
        </Link>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Suspense fallback={<div className="text-xs text-slate-400">Loading error details...</div>}>
        <FailedContent />
      </Suspense>
    </div>
  );
}
