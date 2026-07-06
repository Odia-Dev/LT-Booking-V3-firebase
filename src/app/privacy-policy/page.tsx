"use client";

import React from "react";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-[#EB0A1E]" />
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Privacy Policy</h1>
            <p className="text-slate-400 text-xs mt-0.5">Last Updated: July 2026</p>
          </div>
        </div>

        <div className="text-slate-650 text-xs leading-relaxed space-y-4 pt-4 border-t border-slate-100">
          <p>
            At Laxmi Toyota, we prioritize your data security. This privacy policy outlines how we collect, process, and safeguard your personal details when you interact with our self-serve digital dealership portal.
          </p>
          <h3 className="font-bold text-sm text-slate-900 pt-2">1. Information We Collect</h3>
          <p>
            We collect the following personal parameters: Full Name, mobile phone number, email address, vehicle preferences, and registration numbers when you reserve a car, submit inquiries, or log callback requests.
          </p>
          <h3 className="font-bold text-sm text-slate-900 pt-2">2. How We Use Your Data</h3>
          <p>
            Your parameters are processed to initialize your Razorpay transaction tokens, verify authentication badges via SMS, register booking slots, and follow up via our assigned relationship CRM desk.
          </p>
          <h3 className="font-bold text-sm text-slate-900 pt-2">3. Third-Party Integrations</h3>
          <p>
            We securely pass minimal parameters to Firebase Authentication for SMS verification and Razorpay for payment checkout. We never sell, trade, or transfer your contact info to unauthorized third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
