import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { BRANCHES } from "@/lib/data";
import {
  MapPin, Phone, Mail, Clock, ArrowLeft, Car,
  Wrench, ChevronRight, ExternalLink, CheckCircle, Navigation
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const BRANCH_EXTRAS: Record<string, {
  description: string;
  services: string[];
  showroomModels: string[];
  imgUrl: string;
  gmapEmbed: string;
}> = {
  brahmapur: {
    description: "Our flagship Brahmapur showroom on NH-16 is the largest Laxmi Toyota facility in South Odisha, spanning 15,000+ sq ft with a fully equipped drive-in service bay and a digital display floor.",
    services: ["New Vehicle Sales", "Vehicle Finance & Insurance", "Genuine Toyota Accessories", "Workshop & Body Shop", "Toyota Loyalty Program", "Home Test Drive"],
    showroomModels: ["Toyota Glanza", "Toyota Taisor", "Urban Cruiser Hyryder", "Innova Hycross", "Toyota Fortuner"],
    imgUrl: "https://images.unsplash.com/photo-1567449303078-57ad995bd17e?auto=format&fit=crop&q=80&w=1200",
    gmapEmbed: "https://maps.google.com/maps?q=Brahmapur+Odisha&output=embed",
  },
  jeypore: {
    description: "The Jeypore branch serves the Koraput district and surrounding tribal belt, providing Toyota's full model lineup with a dedicated workshop certified for hybrid vehicle servicing.",
    services: ["New Vehicle Sales", "Vehicle Finance & Insurance", "Genuine Toyota Accessories", "Workshop & Body Shop", "Hybrid Certified Service"],
    showroomModels: ["Toyota Glanza", "Toyota Taisor", "Urban Cruiser Hyryder", "Toyota Fortuner"],
    imgUrl: "https://images.unsplash.com/photo-1562519819-016930ada31a?auto=format&fit=crop&q=80&w=1200",
    gmapEmbed: "https://maps.google.com/maps?q=Jeypore+Odisha&output=embed",
  },
  bargarh: {
    description: "Bargarh's strategic location on NH-53 makes it the prime destination for customers from Sambalpur, Jharsuguda, and Bolangir districts. Full vehicle portfolio available.",
    services: ["New Vehicle Sales", "Vehicle Finance & Insurance", "Genuine Toyota Accessories", "Workshop & Body Shop", "Exchange & Evaluation"],
    showroomModels: ["Toyota Glanza", "Toyota Rumion", "Urban Cruiser Hyryder", "Toyota Fortuner"],
    imgUrl: "https://images.unsplash.com/photo-1519574226792-a5c7082b91d4?auto=format&fit=crop&q=80&w=1200",
    gmapEmbed: "https://maps.google.com/maps?q=Bargarh+Odisha&output=embed",
  },
  balangir: {
    description: "Balangir showroom caters to Western Odisha's growing vehicle market with a full service setup and experienced Toyota-certified sales team.",
    services: ["New Vehicle Sales", "Vehicle Finance & Insurance", "Genuine Toyota Accessories", "Workshop & Body Shop"],
    showroomModels: ["Toyota Glanza", "Toyota Taisor", "Urban Cruiser Hyryder"],
    imgUrl: "https://images.unsplash.com/photo-1441148345475-03e0e1ecff96?auto=format&fit=crop&q=80&w=1200",
    gmapEmbed: "https://maps.google.com/maps?q=Balangir+Odisha&output=embed",
  },
  rayagada: {
    description: "Rayagada branch serves the mining and industrial belt of Southern Odisha, offering commercial vehicle consultation alongside Toyota's full personal vehicle lineup.",
    services: ["New Vehicle Sales", "Vehicle Finance & Insurance", "Genuine Toyota Accessories", "Workshop & Body Shop", "Fleet Sales"],
    showroomModels: ["Toyota Taisor", "Urban Cruiser Hyryder", "Innova Hycross", "Toyota Fortuner", "Toyota Hilux"],
    imgUrl: "https://images.unsplash.com/photo-1612859197716-d677e7bb4ca6?auto=format&fit=crop&q=80&w=1200",
    gmapEmbed: "https://maps.google.com/maps?q=Rayagada+Odisha&output=embed",
  },
  bhawanipatna: {
    description: "Serving Kalahandi and the surrounding districts, Bhawanipatna provides reliable Toyota sales and service to a wide rural and semi-urban customer base.",
    services: ["New Vehicle Sales", "Vehicle Finance & Insurance", "Genuine Toyota Accessories", "Workshop & Body Shop"],
    showroomModels: ["Toyota Glanza", "Toyota Taisor", "Urban Cruiser Hyryder"],
    imgUrl: "https://images.unsplash.com/photo-1547987083-b2e07e2c0e35?auto=format&fit=crop&q=80&w=1200",
    gmapEmbed: "https://maps.google.com/maps?q=Bhawanipatna+Odisha&output=embed",
  },
  paralakhemundi: {
    description: "Paralakhemundi branch covers the southern tip of Odisha bordering Andhra Pradesh. Known for quick delivery timelines and a dedicated customer care team.",
    services: ["New Vehicle Sales", "Vehicle Finance & Insurance", "Genuine Toyota Accessories", "Workshop & Body Shop", "Home Test Drive"],
    showroomModels: ["Toyota Glanza", "Toyota Taisor", "Urban Cruiser Hyryder"],
    imgUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200",
    gmapEmbed: "https://maps.google.com/maps?q=Paralakhemundi+Odisha&output=embed",
  },
  aska: {
    description: "Aska showroom is our newest facility, built to serve the rapidly growing Ganjam district interior market with Toyota's latest lineup and certified service infrastructure.",
    services: ["New Vehicle Sales", "Vehicle Finance & Insurance", "Genuine Toyota Accessories", "Workshop & Body Shop"],
    showroomModels: ["Toyota Glanza", "Toyota Taisor", "Urban Cruiser Hyryder", "Innova Hycross"],
    imgUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200",
    gmapEmbed: "https://maps.google.com/maps?q=Aska+Odisha&output=embed",
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const branch = BRANCHES[slug];
  if (!branch) return { title: "Branch Not Found | Laxmi Toyota" };
  return {
    title: `Laxmi Toyota ${branch.name} Showroom — Address, Phone & Hours | Odisha`,
    description: `Visit Laxmi Toyota ${branch.name} at ${branch.address}. Explore our vehicle lineup, book a test drive, and get Toyota-certified service. Call ${branch.phone}.`,
    keywords: `Laxmi Toyota ${branch.name}, Toyota dealer ${branch.name}, Toyota showroom Odisha, ${branch.name} Toyota`,
  };
}

export async function generateStaticParams() {
  return Object.keys(BRANCHES).map((slug) => ({ slug }));
}

export default async function BranchDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const branch = BRANCHES[slug];
  const extras = BRANCH_EXTRAS[slug];

  if (!branch) notFound();

  const otherBranches = Object.entries(BRANCHES)
    .filter(([key]) => key !== slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Image */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={extras?.imgUrl || "https://images.unsplash.com/photo-1567449303078-57ad995bd17e?auto=format&fit=crop&q=80&w=1200"}
          alt={`Laxmi Toyota ${branch.name} Showroom`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-7xl mx-auto">
            <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-white bg-[#EB0A1E] px-3 py-1 rounded mb-3">
              Laxmi Toyota Network — Odisha
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {branch.name} Showroom
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-8">
          <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/branches" className="hover:text-slate-700 transition-colors">Branches</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600">{branch.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          {/* Left: Main Content */}
          <div className="space-y-8">
            {/* Branch Info Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900">
                  Laxmi Toyota — {branch.name}
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {extras?.description || `Toyota authorized dealership serving ${branch.name} and surrounding areas.`}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-[#EB0A1E] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Address</p>
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">{branch.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <Phone className="w-5 h-5 text-[#EB0A1E] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Phone</p>
                    <a href={`tel:${branch.phone}`} className="text-xs font-bold text-slate-900 hover:text-[#EB0A1E] transition-colors">
                      {branch.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <Clock className="w-5 h-5 text-[#EB0A1E] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Working Hours</p>
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">{branch.hours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <Mail className="w-5 h-5 text-[#EB0A1E] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Email</p>
                    <a href={`mailto:${slug}@laxmitoyota.co.in`} className="text-xs font-bold text-slate-900 hover:text-[#EB0A1E] transition-colors">
                      {slug}@laxmitoyota.co.in
                    </a>
                  </div>
                </div>
              </div>

              {/* Map directions button */}
              <a
                href={branch.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-slate-950 hover:bg-[#EB0A1E] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Get Directions on Google Maps
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Services */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 mb-5 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#EB0A1E]" />
                Services Available
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(extras?.services || ["New Vehicle Sales", "Workshop & Body Shop"]).map((service) => (
                  <li key={service} className="flex items-center gap-2.5 text-sm text-slate-700 font-semibold">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            {/* Models on Display */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 mb-5 flex items-center gap-2">
                <Car className="w-5 h-5 text-[#EB0A1E]" />
                Models on Display
              </h2>
              <div className="flex flex-wrap gap-2">
                {(extras?.showroomModels || ["Toyota Glanza", "Urban Cruiser Hyryder"]).map((model) => (
                  <span key={model} className="px-3.5 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold">
                    {model}
                  </span>
                ))}
              </div>
              <Link
                href="/vehicles"
                className="inline-flex items-center gap-1.5 mt-5 text-xs font-bold text-[#EB0A1E] hover:underline uppercase tracking-wider"
              >
                View Full Lineup <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Map Embed */}
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-100">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#EB0A1E]" /> Location Map
                </h2>
              </div>
              <div className="h-64 bg-slate-100 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <MapPin className="w-8 h-8 text-[#EB0A1E] mx-auto" />
                  <p className="text-sm font-semibold text-slate-600">Laxmi Toyota {branch.name}</p>
                  <p className="text-xs text-slate-400">{branch.address}</p>
                  <a
                    href={branch.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EB0A1E] hover:underline"
                  >
                    Open in Google Maps <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-slate-950 text-white rounded-2xl p-6 space-y-4">
              <p className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E]">Book at {branch.name}</p>
              <p className="text-sm font-bold leading-snug">Ready to own your Toyota? Book online and get priority allocation.</p>
              <Link
                href="/vehicles"
                className="block text-center bg-[#EB0A1E] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-colors"
              >
                Book a Vehicle Online
              </Link>
              <Link
                href="/book-test-drive"
                className="block text-center bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-colors"
              >
                Schedule a Test Drive
              </Link>
            </div>

            {/* Contact Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Talk to Our Team</p>
              <a
                href={`tel:${branch.phone}`}
                className="flex items-center gap-3 group"
              >
                <div className="h-10 w-10 bg-[#EB0A1E]/10 rounded-xl flex items-center justify-center">
                  <Phone className="w-4 h-4 text-[#EB0A1E]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-[#EB0A1E] transition-colors">{branch.phone}</p>
                  <p className="text-[10px] text-slate-400">Mon–Sat 9AM–8PM</p>
                </div>
              </a>
              <a
                href={`mailto:${slug}@laxmitoyota.co.in`}
                className="flex items-center gap-3 group"
              >
                <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Mail className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-[#EB0A1E] transition-colors">{slug}@laxmitoyota.co.in</p>
                  <p className="text-[10px] text-slate-400">We reply within 24 hours</p>
                </div>
              </a>
            </div>

            {/* Other Branches */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Other Branches</p>
              <div className="space-y-2">
                {otherBranches.map(([key, b]) => (
                  <Link
                    key={key}
                    href={`/branches/${key}`}
                    className="flex items-center justify-between group py-2 border-b border-slate-100 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#EB0A1E]" />
                      <span className="text-xs font-bold text-slate-700 group-hover:text-[#EB0A1E] transition-colors">{b.name}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#EB0A1E] transition-colors" />
                  </Link>
                ))}
              </div>
              <Link
                href="/branches"
                className="block text-center text-xs font-bold text-[#EB0A1E] hover:underline uppercase tracking-wider pt-1"
              >
                View All 8 Branches
              </Link>
            </div>

            {/* Back */}
            <Link
              href="/branches"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> All Branches
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
