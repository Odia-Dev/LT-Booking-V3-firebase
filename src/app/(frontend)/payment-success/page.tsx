"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, FileText, ArrowRight, ShieldCheck } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentId = searchParams.get("payment_id") || "PAY_MOCK_XYZ123";
  const orderId = searchParams.get("order_id") || "ORD_MOCK_XYZ123";

  return (
    <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
      <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
      
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Booking Locked</h1>
        <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">
          We have secured your payment. Your booking allocation rank is registered on our CRM dispatch portal.
        </p>
      </div>

      <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl text-left space-y-2 text-[10px] text-slate-555">
        <div className="flex justify-between">
          <span className="font-bold text-slate-400 uppercase tracking-wider">Payment ID:</span>
          <span className="font-mono text-slate-800">{paymentId}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold text-slate-400 uppercase tracking-wider">Order ID:</span>
          <span className="font-mono text-slate-800">{orderId}</span>
        </div>
      </div>

      <div className="pt-2 flex flex-col gap-3">
        <Link
          href="/dashboard"
          className="w-full text-center py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5" /> View My Dashboard <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/"
          className="w-full text-center py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
        >
          Return to Fleet
        </Link>
      </div>

      <div className="flex items-center justify-center gap-1 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
        <ShieldCheck className="w-4 h-4 text-emerald-500" /> Fully Secured by Razorpay
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Suspense fallback={<div className="text-xs text-slate-400">Loading receipt details...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
