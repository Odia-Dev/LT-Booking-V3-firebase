import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  TrendingUp, ShieldCheck, Building2, Calculator,
  ChevronRight, Phone, CheckCircle, Sparkles
} from "lucide-react";

export const metadata: Metadata = {
  title: "Toyota Finance & Insurance — Laxmi Toyota South Odisha",
  description: "Explore Toyota vehicle finance options from SBI, HDFC, ICICI, and Toyota Financial Services. Insurance, loan eligibility, and EMI calculator at Laxmi Toyota Odisha.",
  keywords: "Toyota finance Odisha, Toyota car loan, vehicle insurance Toyota, EMI calculator Toyota, HDFC Toyota loan",
};

const FINANCE_PARTNERS = [
  { name: "SBI Auto Loan", rate: "8.85%", tenure: "Up to 7 Years", highlight: "Best for Govt Employees" },
  { name: "HDFC Bank", rate: "8.90%", tenure: "Up to 7 Years", highlight: "Fastest Processing" },
  { name: "ICICI Bank", rate: "9.00%", tenure: "Up to 7 Years", highlight: "Digital Approval" },
  { name: "Toyota Financial Services", rate: "8.75%", tenure: "Up to 5 Years", highlight: "Toyota Official" },
  { name: "Axis Bank", rate: "9.15%", tenure: "Up to 7 Years", highlight: "Flexible EMI Options" },
  { name: "Kotak Mahindra", rate: "9.25%", tenure: "Up to 7 Years", highlight: "Quick Disbursement" },
];

const INSURANCE_TYPES = [
  {
    title: "Comprehensive Insurance",
    desc: "Full coverage including own damage, third-party liability, theft, fire, and natural calamities. Recommended for all new Toyota vehicles.",
    icon: ShieldCheck,
  },
  {
    title: "Third Party Insurance",
    desc: "Mandatory by law. Covers damages to third parties caused by your vehicle. Basic, affordable coverage option.",
    icon: Building2,
  },
  {
    title: "Add-On Covers",
    desc: "Zero Depreciation, Engine Protect, Roadside Assistance, Invoice Cover, and Return to Invoice — available as optional add-ons.",
    icon: TrendingUp,
  },
];

const BENEFITS = [
  "Instant loan eligibility check at any branch",
  "Paperwork processed within 24 hours",
  "Doorstep document collection available",
  "Special rates for government employees, teachers, and defence personnel",
  "No prepayment penalty with most partner banks",
  "Insurance bundled with finance for maximum convenience",
];

export default function InsuranceFinancePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Promo Banner */}
      <div className="bg-[#EB0A1E] text-white py-3 px-4 text-center text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 fill-white" />
        ⚡ Book online — ₹5,000 exclusive Toyota invoice discount!
      </div>

      {/* Hero */}
      <div className="bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#EB0A1E15,_transparent_60%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-6">
          <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] border border-red-900 bg-red-950/50 px-3 py-1 rounded">
            Finance & Insurance
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-2xl leading-tight">
            Drive Your Toyota Home Today.
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-xl">
            Flexible finance options from India&apos;s leading banks and Toyota Financial Services. 
            Competitive rates, fast approvals, and complete insurance support — all under one roof.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/car-loan-eligibility"
              className="inline-flex items-center gap-2 bg-[#EB0A1E] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-colors"
            >
              <Calculator className="w-4 h-4" /> Check Loan Eligibility
            </Link>
            <Link
              href="/toyota-emi-calculator"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-colors"
            >
              <TrendingUp className="w-4 h-4" /> EMI Calculator
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">

        {/* Finance Partners */}
        <section className="space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
              Finance Partners
            </span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Bank Partners & Interest Rates</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Indicative rates as of July 2026. Final rates may vary based on credit profile and tenure.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FINANCE_PARTNERS.map((bank) => (
              <div
                key={bank.name}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4 hover:shadow-md hover:border-[#EB0A1E]/30 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-slate-500" />
                  </div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                    {bank.highlight}
                  </span>
                </div>
                <div>
                  <h3 className="font-black text-slate-900">{bank.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Tenure: {bank.tenure}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#EB0A1E]">{bank.rate}</span>
                  <span className="text-xs text-slate-400 font-bold">p.a. onwards</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/toyota-emi-calculator"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#EB0A1E] hover:underline uppercase tracking-wider"
            >
              Calculate Your EMI <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Insurance */}
        <section className="space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
              Vehicle Insurance
            </span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Toyota Vehicle Insurance</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Comprehensive and third-party insurance processed at the dealership — no separate visits needed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INSURANCE_TYPES.map((ins) => {
              const Icon = ins.icon;
              return (
                <div
                  key={ins.title}
                  className="bg-white border border-slate-200/80 rounded-2xl p-7 shadow-sm space-y-4 hover:shadow-md hover:border-[#EB0A1E]/30 transition-all"
                >
                  <div className="h-12 w-12 bg-[#EB0A1E]/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#EB0A1E]" />
                  </div>
                  <h3 className="font-black text-slate-900">{ins.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{ins.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Benefits + Contact */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-slate-900">Finance & Insurance Benefits</h2>
            <ul className="space-y-3">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-slate-700 font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-950 text-white rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-black">Speak to Our Finance Team</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Our finance advisors at every Laxmi Toyota branch will walk you through loan eligibility, 
              EMI options, insurance add-ons, and subsidy schemes applicable in Odisha.
            </p>
            <div className="space-y-3">
              <Link
                href="/car-loan-eligibility"
                className="flex items-center justify-between bg-[#EB0A1E] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl transition-colors"
              >
                <span>Check Loan Eligibility</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-between bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl transition-colors"
              >
                <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> Call a Finance Advisor</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
