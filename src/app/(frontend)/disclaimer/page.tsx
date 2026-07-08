"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-[#EB0A1E]" />
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Disclaimer</h1>
            <p className="text-slate-400 text-xs mt-0.5">Last Updated: July 2026</p>
          </div>
        </div>

        <div className="text-slate-650 text-xs leading-relaxed space-y-4 pt-4 border-t border-slate-100">
          <p>
            All information on Laxmi Toyota's website is published in good faith and for general information purposes only.
          </p>
          <h3 className="font-bold text-sm text-slate-900 pt-2">1. Accuracy of Specifications</h3>
          <p>
            While we strive to display accurate ex-showroom prices, waitlist durations, and color hex codes, actual parameters are subject to changes from Toyota Kirloskar Motor. Please consult your advisor to confirm final specifications.
          </p>
          <h3 className="font-bold text-sm text-slate-900 pt-2">2. External Links</h3>
          <p>
            Our website may contain links to external sites (such as Razorpay or government registries). We have no control over the content and nature of these external domains.
          </p>
          <h3 className="font-bold text-sm text-slate-905 pt-2">3. Dealership Affiliation</h3>
          <p>
            Laxmi Toyota is an authorized third-party dealership representing Toyota Kirloskar Motor Pvt. Ltd. in the South Odisha region.
          </p>
        </div>
      </div>
    </div>
  );
}
