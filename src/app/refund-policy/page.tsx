"use client";

import React from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <RotateCcw className="w-8 h-8 text-[#EB0A1E]" />
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Refund Policy</h1>
            <p className="text-slate-400 text-xs mt-0.5">Last Updated: July 2026</p>
          </div>
        </div>

        <div className="text-slate-650 text-xs leading-relaxed space-y-4 pt-4 border-t border-slate-100">
          <p>
            We believe in complete customer flexibility. Our transparent refund policy ensures you can book your vehicle online with absolute peace of mind.
          </p>
          <h3 className="font-bold text-sm text-slate-900 pt-2">1. 100% Refund Guarantee</h3>
          <p>
            Any booking deposit made through our self-serve website is **100% refundable**. If you decide to cancel your booking before the vehicle registration invoice is generated, no cancellation fees will apply.
          </p>
          <h3 className="font-bold text-sm text-slate-900 pt-2">2. Processing Timelines</h3>
          <p>
            Once a cancellation is requested, your refund will be processed back to the original payment source (credit card, UPI, bank account) within **5 to 7 working days**.
          </p>
          <h3 className="font-bold text-sm text-slate-900 pt-2">3. How to Request Cancellation</h3>
          <p>
            To cancel your booking, log into your User Dashboard, navigate to your bookings section, and click the cancellation request button. Alternatively, you can write to us at support@laxmitoyota.co.in.
          </p>
        </div>
      </div>
    </div>
  );
}
