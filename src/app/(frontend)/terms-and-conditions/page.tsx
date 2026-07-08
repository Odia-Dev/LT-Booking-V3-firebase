"use client";

import React from "react";
import Link from "next/link";
import { FileText } from "lucide-react";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-[#EB0A1E]" />
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Terms & Conditions</h1>
            <p className="text-slate-400 text-xs mt-0.5">Last Updated: July 2026</p>
          </div>
        </div>

        <div className="text-slate-650 text-xs leading-relaxed space-y-4 pt-4 border-t border-slate-100">
          <p>
            Welcome to the Laxmi Toyota digital ecosystem. By booking a vehicle or requesting service appointments on this platform, you agree to comply with our terms.
          </p>
          <h3 className="font-bold text-sm text-slate-900 pt-2">1. Booking Allocation Ranks</h3>
          <p>
            An online reservation locks your allocation position. Ranks are strictly assigned in order of payment timestamp confirmations. The final vehicle allocation is subject to factory shipment schedules.
          </p>
          <h3 className="font-bold text-sm text-slate-900 pt-2">2. Pricing Parameters</h3>
          <p>
            All listed base prices represent the starting ex-showroom values. Local road tax, registration fees, dealership charges, and insurance premiums are calculated at the showroom before final invoicing.
          </p>
          <h3 className="font-bold text-sm text-slate-900 pt-2">3. Payment & Transactions</h3>
          <p>
            Razorpay transaction tokens represent fully refundable booking deposits. Laxmi Toyota reserves the right to verify customer badge documents prior to invoicing.
          </p>
        </div>
      </div>
    </div>
  );
}
