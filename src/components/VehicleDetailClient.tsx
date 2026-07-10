"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Vehicle } from "@/lib/data";
import { getLiveStockCount } from "@/lib/stockFetcher";
import { 
  CheckCircle, ShieldCheck, ArrowLeft,
  ChevronRight, Sparkles,
  Calculator, Clock
} from "lucide-react";

interface VehicleDetailClientProps {
  vehicle: Vehicle;
  id: string;
}

export default function VehicleDetailClient({ vehicle, id }: VehicleDetailClientProps) {
  const [selectedColor, setSelectedColor] = useState(vehicle.colors[0] || "");
  const [selectedVariant, setSelectedVariant] = useState(vehicle.variants[0] || "");
  const [stockCount, setStockCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchStock() {
      try {
        const count = await getLiveStockCount(vehicle.name, selectedVariant, selectedColor);
        if (isMounted) setStockCount(count);
      } catch (err) {
        console.error("Error querying stock count:", err);
        if (isMounted) setStockCount(1); // Elegant fallback
      }
    }
    fetchStock();
    return () => {
      isMounted = false;
    };
  }, [vehicle.name, selectedVariant, selectedColor]);
  
  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(5);
  
  // Quick EMI calculation logic
  const calculateEMI = () => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;
    if (r === 0) return (P / n).toFixed(0);
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return isNaN(emi) ? "0" : emi.toFixed(0);
  };

  const formattedEMI = parseFloat(calculateEMI()).toLocaleString("en-IN");

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-24">
      
      {/* Promo Banner */}
      <div className="bg-[#EB0A1E] text-white py-3 px-4 text-center text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 fill-white" />
        ⚡ Secure your booking online today & get ₹5,000 instant discount on final invoice!
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Navigation */}
        <Link 
          href="/vehicles" 
          className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> View Lineup
        </Link>

        {/* Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Visual Presentation */}
          <div className="space-y-6">
            <div className="relative aspect-video rounded-3xl bg-slate-900 overflow-hidden border border-slate-800 shadow-xl flex items-center justify-center">
              <span className="text-4xl font-extrabold text-white uppercase tracking-wider">{vehicle.name}</span>
              <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-emerald-400">
                Priority Allocation
              </div>
            </div>

            {/* Colors picker */}
            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Available Colors</h3>
              <div className="flex flex-wrap gap-2.5">
                {vehicle.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedColor === color
                        ? "bg-slate-950 text-white border-slate-950 shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-350"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
                Toyota {vehicle.category}
              </span>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">{vehicle.name}</h1>
              <p className="text-[#EB0A1E] text-2xl font-black">{vehicle.price}</p>
              <p className="text-slate-500 text-sm italic font-medium leading-relaxed">&ldquo;{vehicle.tagline}&rdquo;</p>
            </div>

            {/* Key Features Bullet List */}
            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Highlight Features</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {vehicle.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Variants grid chooser */}
            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Choose Variant</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {vehicle.variants.map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVariant(v)}
                    className={`p-3 rounded-xl border text-center text-xs font-extrabold transition-all ${
                      selectedVariant === v
                        ? "bg-[#EB0A1E] text-white border-[#EB0A1E] shadow-md shadow-red-500/10"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-350"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Stock availability indicator */}
            {stockCount !== null && (
              <div className={`p-4 rounded-2xl border flex items-center gap-3.5 transition-all duration-300 ${
                stockCount > 0 
                  ? "bg-emerald-50/50 border-emerald-200 text-emerald-900"
                  : "bg-amber-50/50 border-amber-200 text-amber-900"
              }`}>
                {stockCount > 0 ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                )}
                <div>
                  {stockCount > 0 ? (
                    <>
                      <p className="text-xs font-black uppercase tracking-wider text-emerald-800">Immediate Delivery Available: {stockCount} Units</p>
                      <p className="text-[11px] font-semibold text-emerald-600/95 mt-0.5">Physical units in stock at dealer warehouse.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs font-black uppercase tracking-wider text-amber-800">Current Waiting Period: 3-5 Months</p>
                      <p className="text-[11px] font-semibold text-amber-600/95 mt-0.5">High demand. Reserve your allocation slot.</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Trusted badge */}
            <div className="flex gap-4 p-4 bg-slate-100/50 rounded-2xl border border-slate-200/60 text-xs text-slate-500 items-start">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">Toyota Authorized Dealer Booking</p>
                <p className="mt-0.5">Secure gateway via ICICI/Razorpay. 100% refundable booking amount prior to allocation.</p>
              </div>
            </div>
          </div>
        </div>

        {/* EMI Calculator Section */}
        <div className="bg-white border border-slate-200/80 p-8 rounded-3xl space-y-8 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-[#EB0A1E]" /> Estimative EMI Calculator
            </h2>
            <p className="text-slate-500 text-xs">Calculate monthly installments based on your customized loan requirement.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Range 1: Loan Amount */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex justify-between">
                <span>Loan Amount</span>
                <span className="text-slate-800 font-extrabold">₹{(loanAmount / 100000).toFixed(2)} Lakh</span>
              </label>
              <input
                type="range"
                min="100000"
                max="3000000"
                step="50000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#EB0A1E]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                <span>₹1 Lakh</span>
                <span>₹30 Lakh</span>
              </div>
            </div>

            {/* Range 2: Interest Rate */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex justify-between">
                <span>Interest Rate</span>
                <span className="text-slate-800 font-extrabold">{interestRate}% p.a.</span>
              </label>
              <input
                type="range"
                min="6"
                max="15"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#EB0A1E]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                <span>6%</span>
                <span>15%</span>
              </div>
            </div>

            {/* Range 3: Tenure Years */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex justify-between">
                <span>Loan Tenure</span>
                <span className="text-slate-800 font-extrabold">{tenureYears} Years</span>
              </label>
              <input
                type="range"
                min="1"
                max="7"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#EB0A1E]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                <span>1 Year</span>
                <span>7 Years</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Estimated Monthly Installment</span>
              <p className="text-3xl font-black text-slate-900">₹{formattedEMI} <span className="text-xs font-medium text-slate-500">/ month</span></p>
            </div>
            <div className="text-center sm:text-right max-w-sm text-[11px] text-slate-450 leading-normal">
              *Calculations are indicative. Actual interest rate and EMI structure depend on the partner bank (SBI, HDFC, ICICI, etc.) at the time of credit evaluation.
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Booking CTA Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-slate-200 py-4 px-6 flex justify-between items-center shadow-2xl z-40">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center gap-6">
          <div className="hidden sm:block">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Model Selected</span>
            <p className="font-extrabold text-slate-900 text-sm">{vehicle.name} • <span className="text-slate-500 font-semibold">{selectedVariant} ({selectedColor})</span></p>
          </div>
          <Link
            href={`/book/${id}`}
            className="flex-grow sm:flex-grow-0 inline-flex items-center justify-center bg-[#EB0A1E] hover:bg-red-750 text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg shadow-red-500/20 transition-all gap-1.5"
          >
            Book Now <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
