"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Car, ShieldCheck, Zap, MapPin, ChevronRight, 
  Phone, Star, Calendar, ArrowRight, Clock, 
  ShieldAlert, CreditCard, ChevronDown
} from 'lucide-react';

const VEHICLES = [
  { id: 'fortuner', name: 'Fortuner', price: '₹35.93 Lakh', booking: '₹1,00,000', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80', type: 'SUV' },
  { id: 'hycross', name: 'Innova Hycross', price: '₹19.77 Lakh', booking: '₹51,000', img: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=80&type=MPV', type: 'MPV' },
  { id: 'hyryder', name: 'Hyryder', price: '₹11.14 Lakh', booking: '₹21,000', img: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&w=600&q=80', type: 'SUV' },
  { id: 'glanza', name: 'Glanza', price: '₹6.81 Lakh', booking: '₹11,000', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80', type: 'Hatchback' },
];

const Section = ({ children, title, className = "", id = "" }: { children: React.ReactNode, title?: string, className?: string, id?: string }) => (
  <section id={id} className={`py-16 px-6 max-w-7xl mx-auto ${className}`}>
    {title && <h2 className="text-3xl font-bold text-slate-950 mb-10 tracking-tight">{title}</h2>}
    {children}
  </section>
);

export default function Storefront() {
  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans">
      
      {/* --- NAV --- */}
      <nav className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-extrabold text-xl tracking-tighter">LAXMI <span className="text-[#EB0A1E]">TOYOTA</span></div>
          <div className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-600">
            <a href="#catalog" className="hover:text-[#EB0A1E]">Vehicles</a>
            <Link href="/dashboard" className="hover:text-[#EB0A1E]">CRM Dashboard</Link>
            <Link href="/admin/dashboard" className="hover:text-[#EB0A1E]">Admin Panel</Link>
          </div>
          <a href="#catalog" className="bg-slate-900 text-white px-5 py-2 rounded-full text-[10px] font-bold tracking-widest hover:bg-[#EB0A1E] transition">BOOK NOW</a>
        </div>
      </nav>

      {/* --- HERO --- */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-950 leading-[1.1] mb-6">
              Reserve Your Toyota <span className="text-[#EB0A1E]">Online</span>.
            </h1>
            <p className="text-slate-600 text-sm md:text-base mb-8 max-w-lg leading-relaxed">
              Official Toyota Dealer for South Odisha. Secure your vehicle, choose your branch, and enjoy instant, authorized confirmation.
            </p>
            <div className="flex gap-4">
              <a href="#catalog" className="bg-[#EB0A1E] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-red-700 transition flex items-center justify-center">Start Booking</a>
              <a href="#catalog" className="bg-slate-100 text-slate-900 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition flex items-center justify-center">View Inventory</a>
            </div>
            <div className="mt-10 flex gap-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-[#EB0A1E]" /> Authorized Dealer</span>
              <span className="flex items-center gap-2"><CreditCard size={14} className="text-[#EB0A1E]" /> Secure Payment</span>
            </div>
          </div>
          <div className="flex-1">
            <img src="https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80" className="rounded-3xl shadow-2xl" alt="Toyota" />
          </div>
        </div>
      </section>

      {/* --- VEHICLES --- */}
      <Section id="catalog" title="Featured Lineup">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VEHICLES.map((v) => (
            <div key={v.id} className="border border-slate-100 rounded-2xl p-5 hover:shadow-xl transition-shadow bg-slate-50/50 flex flex-col justify-between">
              <div>
                <img src={v.img} alt={v.name} className="w-full h-32 object-cover rounded-xl mb-4" />
                <div className="text-[10px] font-bold text-[#EB0A1E] uppercase tracking-widest mb-1">{v.type}</div>
                <h3 className="text-lg font-bold text-slate-950 mb-4">{v.name}</h3>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-6">
                  <span>Start: {v.price}</span>
                  <span className="font-bold text-slate-900">Booking: {v.booking}</span>
                </div>
                <Link 
                  href={`/book/${v.id}`} 
                  className="block text-center w-full py-2.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold uppercase tracking-widest hover:border-[#EB0A1E] hover:text-[#EB0A1E] transition"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-950 mb-16 text-center">Process Made Simple</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: 'Choose', desc: 'Select your preferred Toyota from catalog.' },
              { title: 'Details', desc: 'Input your documents and branch.' },
              { title: 'Secure', desc: 'Pay booking amount via gateway.' },
              { title: 'Confirm', desc: 'Instant allocation receipt.' }
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-[#EB0A1E] shadow-sm">
                  {i + 1}
                </div>
                <h4 className="font-bold text-slate-950 mb-1 text-sm">{step.title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
