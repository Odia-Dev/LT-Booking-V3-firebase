import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Award, ShieldCheck, Users, Star, Leaf, Zap,
  TrendingUp, Heart, CheckCircle, ChevronRight, Sparkles
} from "lucide-react";

export const metadata: Metadata = {
  title: "Why Choose Laxmi Toyota — South Odisha's #1 Toyota Dealer",
  description: "Laxmi Toyota is the most trusted Toyota dealership in South Odisha. Toyota Gold Certified, transparent pricing, priority delivery, and 15+ years of service excellence.",
  keywords: "Why Laxmi Toyota, best Toyota dealer Odisha, Toyota authorized dealer, Toyota Brahmapur trusted",
};

const REASONS = [
  {
    icon: Award,
    title: "Toyota Gold Certified Dealer",
    desc: "Laxmi Toyota holds Toyota India's Gold Dealer certification — awarded for consistently exceeding customer satisfaction benchmarks over 5+ consecutive years.",
    badge: "Since 2015",
  },
  {
    icon: ShieldCheck,
    title: "100% Genuine Toyota Parts",
    desc: "Every spare part used in our workshop is sourced directly from Toyota India's official parts distribution network. Zero third-party substitutes.",
    badge: "OEM Guaranteed",
  },
  {
    icon: TrendingUp,
    title: "Priority Online Delivery",
    desc: "Online bookers receive priority allocation in our delivery queue — guaranteed before showroom walk-ins. Your timestamp is your priority rank.",
    badge: "Digital First",
  },
  {
    icon: Leaf,
    title: "Hybrid & EV Champions",
    desc: "South Odisha's dedicated Toyota Hybrid and Electric vehicle advisory. We offer hybrid-certified service and the widest hybrid/EV test drive fleet.",
    badge: "Green Mobility",
  },
  {
    icon: Users,
    title: "8-Branch Network",
    desc: "The widest Toyota dealership network in South Odisha — Brahmapur, Jeypore, Bargarh, Balangir, Rayagada, Bhawanipatna, Paralakhemundi, and Aska.",
    badge: "South Odisha Wide",
  },
  {
    icon: Star,
    title: "4.8★ Customer Rating",
    desc: "Rated 4.8 stars across 98 verified reviews from Toyota customers across our 8 branches. We let our customers speak for us.",
    badge: "98 Reviews",
  },
  {
    icon: Heart,
    title: "Post-Sales Care",
    desc: "Our relationship doesn't end at delivery. Dedicated relationship managers, service reminders, insurance renewal assistance, and exchange support.",
    badge: "Lifetime Support",
  },
  {
    icon: Zap,
    title: "Transparent Pricing",
    desc: "No hidden charges. No bait-and-switch. The price you see on our website is the exact price on your invoice — period.",
    badge: "Zero Hidden Costs",
  },
];

const STATS = [
  { value: "3,000+", label: "Vehicles Delivered", emoji: "🚗" },
  { value: "4.8 ★", label: "Customer Rating", emoji: "⭐" },
  { value: "15+", label: "Years of Service", emoji: "🏆" },
  { value: "8", label: "Showroom Branches", emoji: "📍" },
  { value: "150+", label: "Certified Staff", emoji: "👨‍💼" },
  { value: "₹5,000", label: "Online Booking Bonus", emoji: "💰" },
];

const COMPARISONS = [
  { feature: "Toyota Gold Certification", us: true, others: false },
  { feature: "100% Genuine OEM Parts", us: true, others: false },
  { feature: "Online Priority Booking", us: true, others: false },
  { feature: "Hybrid Certified Workshop", us: true, others: false },
  { feature: "8-Branch Odisha Network", us: true, others: false },
  { feature: "Post-Sale Relationship Manager", us: true, others: false },
  { feature: "Transparent Invoice Pricing", us: true, others: false },
];

export default function WhyChooseUsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Promo Banner */}
      <div className="bg-[#EB0A1E] text-white py-3 px-4 text-center text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 fill-white" />
        ⚡ Book online today — ₹5,000 exclusive invoice discount!
      </div>

      {/* Hero */}
      <div className="bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#EB0A1E20,_transparent_60%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-6 text-center">
          <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] border border-red-900 bg-red-950/50 px-3 py-1 rounded">
            Why Choose Laxmi Toyota
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-3xl mx-auto leading-tight">
            South Odisha&apos;s #1 Toyota Experience
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-xl mx-auto">
            Not just a car dealership — a 15-year-old institution of trust, transparency, 
            and Toyota excellence in South Odisha.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 bg-[#EB0A1E] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-colors"
            >
              <Sparkles className="w-4 h-4" /> Book Your Toyota Online
            </Link>
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-colors"
            >
              <Star className="w-4 h-4" /> Read Customer Reviews
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.label} className="space-y-1">
                <div className="text-3xl">{s.emoji}</div>
                <p className="text-2xl font-black text-slate-900">{s.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">

        {/* 8 Reasons Grid */}
        <section className="space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
              Our Differentiators
            </span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">8 Reasons to Choose Laxmi Toyota</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {REASONS.map((r, i) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.title}
                  className="bg-white border border-slate-200/80 rounded-2xl p-7 shadow-sm space-y-4 hover:shadow-md hover:border-[#EB0A1E]/30 transition-all relative overflow-hidden"
                >
                  <div className="absolute top-4 right-4 text-[40px] font-black text-slate-100 select-none leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="h-12 w-12 bg-[#EB0A1E]/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#EB0A1E]" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold tracking-widest uppercase text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                      {r.badge}
                    </span>
                    <h3 className="font-black text-slate-900 mt-2 leading-snug">{r.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{r.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Laxmi Toyota vs. Other Dealers</h2>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-black tracking-widest text-slate-500">
                    <th className="px-6 py-4">Feature</th>
                    <th className="px-6 py-4 text-[#EB0A1E]">Laxmi Toyota</th>
                    <th className="px-6 py-4 text-slate-400">Other Dealers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {COMPARISONS.map((c) => (
                    <tr key={c.feature} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-700">{c.feature}</td>
                      <td className="px-6 py-4">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300 text-lg font-black">—</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-950 text-white rounded-3xl p-10 sm:p-16 text-center space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#EB0A1E15,_transparent_70%)]" />
          <div className="relative z-10 space-y-6">
            <Award className="w-12 h-12 text-[#EB0A1E] mx-auto" />
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to Experience the Difference?
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Join 3,000+ Toyota owners across South Odisha who chose Laxmi Toyota. Book online in minutes.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/vehicles"
                className="inline-flex items-center gap-2 bg-[#EB0A1E] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-colors"
              >
                Explore & Book Online <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-colors"
              >
                Talk to Our Team
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
