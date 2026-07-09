import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BRANCHES } from "@/lib/data";
import { MapPin, Phone, Mail, Clock, ArrowLeft, Calendar, ShieldCheck, ExternalLink } from "lucide-react";

interface BranchPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BranchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const branch = BRANCHES[slug.toLowerCase()];

  if (!branch) {
    return {
      title: "Branch Not Found | Laxmi Toyota",
      description: "The requested Laxmi Toyota branch showroom could not be found.",
    };
  }

  return {
    title: `Laxmi Toyota ${branch.name} Showroom | Authorized Toyota Dealer in Odisha`,
    description: `Contact Laxmi Toyota showroom in ${branch.name}, Odisha. Phone: ${branch.phone}, Address: ${branch.address}. Schedule localized test drives and car maintenance appointments.`,
    keywords: `Toyota Showroom ${branch.name}, Laxmi Toyota ${branch.name}, Toyota dealer ${branch.name}, Toyota service center ${branch.name}`,
  };
}

export default async function BranchDetailPage({ params }: BranchPageProps) {
  const { slug } = await params;
  const branch = BRANCHES[slug.toLowerCase()];

  if (!branch) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Back Link */}
        <Link href="/branches" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors gap-1.5">
          <ArrowLeft className="w-4 h-4" /> View All Branches
        </Link>

        {/* Hero Section Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-100/80 space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
              Laxmi Toyota {branch.name}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 pt-2">
              Laxmi Toyota {branch.name} Showroom
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
              Welcome to the authorized Laxmi Toyota dealership in {branch.name}. We offer premium sales, spares, and service support for the entire Toyota passenger vehicle lineup.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-sm">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#EB0A1E] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Showroom Address</span>
                  <p className="text-slate-800 font-medium mt-0.5 leading-relaxed">{branch.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#EB0A1E] shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Contact Number</span>
                  <a href={`tel:${branch.phone.replace(/\s+/g, "")}`} className="text-slate-800 font-medium mt-0.5 hover:text-[#EB0A1E] hover:underline transition-colors block">
                    {branch.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-slate-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Email Address</span>
                  <p className="text-slate-800 font-medium mt-0.5">{slug.toLowerCase()}@laxmitoyota.co.in</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4 text-slate-500" /> Working Hours
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                {branch.hours}
              </p>
              <div className="pt-2">
                <a 
                  href={branch.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#EB0A1E] hover:underline"
                >
                  Open in Google Maps <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 border border-slate-800">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-extrabold">Ready to schedule a visit?</h3>
            <p className="text-slate-400 text-xs max-w-md">Book a priority showroom consultation or a door-step test drive with our sales advisors.</p>
          </div>
          <Link
            href={`/book-test-drive?branch=${branch.name}`}
            className="inline-flex items-center justify-center bg-[#EB0A1E] hover:bg-red-750 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-500/10 transition-all gap-1.5 shrink-0"
          >
            <Calendar className="w-4 h-4" /> Schedule Appointment
          </Link>
        </div>

      </div>
    </div>
  );
}
