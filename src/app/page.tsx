"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, ShoppingCart, MapPin, Phone, Mail, 
  CheckCircle2, Star, ChevronRight, PlayCircle,
  Menu, X, Car, CreditCard, ShieldCheck, 
  Clock, ThumbsUp, HelpCircle, ChevronDown, MessageCircle
} from 'lucide-react';

const VEHICLES = [
  { id: 'glanza', name: 'Glanza', desc: 'Premium Hatchback', price: '6.81 Lakh', booking: '11,000', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800', badge: 'Sale' },
  { id: 'hyryder', name: 'Hyryder', desc: 'Self-Charging Hybrid Electric SUV', price: '11.14 Lakh', booking: '21,000', img: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&q=80&w=800', badge: 'Popular' },
  { id: 'hycross', name: 'Innova Hycross', desc: 'Advanced MPV with Hybrid Tech', price: '19.77 Lakh', booking: '50,000', img: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800', badge: 'High Demand' },
  { id: 'fortuner', name: 'Fortuner', desc: 'Legendary SUV', price: '33.43 Lakh', booking: '1,00,000', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800', badge: 'Iconic' },
];

const BRANCHES = [
  { name: 'Brahmapur (HQ)', address: 'NH-16, Haladiapadar', phone: '+91 98765 43212' },
  { name: 'Jeypore', address: 'NH-26, Jeypore Main Road', phone: '+91 98765 43214' },
  { name: 'Bargarh', address: 'Bargarh Main Road', phone: '+91 98765 43211' },
  { name: 'Balangir', address: 'Balangir Highway', phone: '+91 98765 43215' },
];

const OFFERS = [
  { title: 'Exchange Bonus', desc: 'Get up to ₹70,000 bonus on exchanging your old car.', valid: 'Ends in 5 days' },
  { title: 'Hybrid Benefits', desc: 'Special warranty & benefits up to ₹1.60 Lakh on Hyryder.', valid: 'Limited Time' },
  { title: 'Corporate Discount', desc: 'Exclusive pricing for registered corporate employees.', valid: 'Ongoing' },
];

const FAQS = [
  { q: "Is online booking secure?", a: "Yes, we use Razorpay's 128-bit encryption. Your payment is 100% safe and directly credited to Laxmi Toyota's official account." },
  { q: "Is the booking amount refundable?", a: "Absolutely. 100% of your booking amount is refundable until the vehicle is invoiced and allocated to you." },
  { q: "Can I change my variant or color later?", a: "Yes! You can change your variant or color anytime before the final allocation by contacting your dedicated sales advisor." },
  { q: "How quickly will someone contact me?", a: "A dedicated relationship manager will contact you within 2 working hours of your successful online booking." },
];

const TESTIMONIALS = [
  { name: "Rahul Dash", location: "Brahmapur", text: "Booked my Hyryder completely online. The transparency and speed of Laxmi Toyota's digital process is unmatched.", rating: 5 },
  { name: "Priyanka Sahu", location: "Jeypore", text: "Got instant confirmation for my Glanza. The sales team called within an hour to explain the next steps. Very premium experience.", rating: 5 },
  { name: "Amit Patnaik", location: "Bargarh", text: "I was skeptical about booking a Fortuner online, but the Razorpay gateway and instant official receipt gave me total confidence.", rating: 5 },
];

export default function UltimateStorefront() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-[#EB0A1E] selection:text-white pb-20 lg:pb-0">
      
      {/* --- NAVIGATION --- */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center cursor-pointer">
              <span className="text-[#EB0A1E] text-2xl font-black tracking-tight">Laxmi Toyota</span>
            </div>
            
            <div className="hidden lg:flex space-x-8 items-center">
              {['Vehicles', 'How it Works', 'Offers', 'Branches', 'FAQ'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-[#EB0A1E] transition-colors">
                  {item}
                </a>
              ))}
              <Link href="/dashboard" className="text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-[#EB0A1E] transition-colors">
                CRM Portal
              </Link>
            </div>

            <div className="hidden lg:flex items-center space-x-6">
              <a href="#vehicles" className="bg-[#EB0A1E] text-white px-6 py-2.5 rounded text-sm font-bold shadow-md hover:bg-red-700 transition-all flex items-center justify-center">
                Book Online
              </a>
            </div>

            <div className="lg:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-4 shadow-lg absolute w-full">
            {['Vehicles', 'How it Works', 'Offers', 'Branches', 'FAQ'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="block text-base font-semibold text-slate-800 hover:text-[#EB0A1E]">
                {item}
              </a>
            ))}
            <Link href="/dashboard" className="block text-base font-semibold text-slate-800 hover:text-[#EB0A1E]">
              CRM Portal
            </Link>
            <div className="pt-4 border-t border-gray-100">
              <a href="#vehicles" className="block w-full text-center bg-[#EB0A1E] text-white px-6 py-3 rounded text-sm font-bold shadow-md">
                Book Online
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="bg-slate-50 pt-20 pb-24 px-4 relative border-b border-gray-100">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-red-50 text-[#EB0A1E] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Toyota Dealer for South Odisha</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Reserve Your Toyota Car Online <br/>in Just 2 Minutes
          </h1>
          <p className="text-sm md:text-base text-slate-600 mb-10 max-w-2xl mx-auto">
            Secure your preferred variant and color with an authorized Toyota dealer serving South Odisha.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a href="#vehicles" className="w-full sm:w-auto bg-[#EB0A1E] text-white px-8 py-4 rounded text-sm font-bold shadow-lg hover:bg-red-700 transition-colors flex items-center justify-center">
              Explore Vehicles <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </section>

      {/* --- TRUST BAR --- */}
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-[#EB0A1E] mb-2" />
              <p className="text-xl font-black text-slate-900">10,000+</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Secure Online Payments</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <MapPin className="w-6 h-6 text-[#EB0A1E] mb-2" />
              <p className="text-xl font-black text-slate-900">8</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Locations Across Odisha</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Star className="w-6 h-6 text-[#EB0A1E] mb-2" />
              <p className="text-xl font-black text-slate-900">4.8</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Instant Confirmation</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#EB0A1E] mb-2" />
              <p className="text-xl font-black text-slate-900">20+ Years</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Official Toyota Dealer</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- FEATURED VEHICLES --- */}
      <section id="vehicles" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Choose Your Toyota</h2>
          <p className="text-slate-500 text-sm">Select a model to view variants, colors, and secure your booking.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VEHICLES.map((v) => (
            <div key={v.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all group flex flex-col justify-between">
              <div>
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <div className="absolute top-3 right-3 z-10 bg-[#EB0A1E] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                    {v.badge}
                  </div>
                  <img src={v.img} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900">{v.name}</h3>
                  <p className="text-xs text-slate-500 mb-4 h-8">{v.desc}</p>
                </div>
              </div>
              
              <div className="p-5 pt-0">
                <div className="flex justify-between items-end mb-4 pt-4 border-t border-gray-50">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Starts At</p>
                    <p className="text-sm font-bold text-slate-900">₹ {v.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#EB0A1E] uppercase font-bold tracking-wider">Booking Amt.</p>
                    <p className="text-sm font-black text-[#EB0A1E]">₹ {v.booking}</p>
                  </div>
                </div>
                
                <Link 
                  href={`/book/${v.id}`}
                  className="w-full bg-slate-900 text-white py-2.5 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#EB0A1E] transition-colors flex items-center justify-center"
                >
                  Select Variant & Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- HOW ONLINE BOOKING WORKS --- */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">How Online Booking Works</h2>
            <p className="text-slate-500 text-sm">A seamless, transparent process designed to give you priority allocation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <Car className="w-6 h-6 text-[#EB0A1E]"/>, title: 'Choose Toyota', desc: 'Select your preferred model, variant, and color.' },
              { icon: <CreditCard className="w-6 h-6 text-[#EB0A1E]"/>, title: 'Secure Payment', desc: 'Pay the official booking amount securely via Razorpay.' },
              { icon: <CheckCircle2 className="w-6 h-6 text-[#EB0A1E]"/>, title: 'Instant Confirmation', desc: 'Receive your official booking ID and receipt immediately.' },
              { icon: <Phone className="w-6 h-6 text-[#EB0A1E]"/>, title: 'Advisor Contact', desc: 'Your dedicated RM calls you to arrange finance and delivery.' }
            ].map((step, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 text-center relative">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                {i !== 3 && <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-gray-200"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CURRENT OFFERS --- */}
      <section id="offers" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-8 text-center">Exclusive Online Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {OFFERS.map((offer, i) => (
            <div key={i} className="border border-[#EB0A1E]/20 bg-red-50/30 p-6 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#EB0A1E] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">
                {offer.valid}
              </div>
              <h3 className="text-lg font-bold text-[#EB0A1E] mb-2">{offer.title}</h3>
              <p className="text-sm text-slate-700">{offer.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold mb-12 text-center">What our customers say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex text-[#F59E0B] mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm text-slate-300 italic mb-6">"{t.text}"</p>
                <div>
                  <p className="font-bold text-sm">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BRANCHES --- */}
      <section id="branches" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2 text-center">Serving South Odisha</h2>
        <p className="text-center text-slate-500 text-sm mb-12">Select your nearest branch during checkout.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {BRANCHES.map((b, i) => (
            <div key={i} className="border border-gray-200 p-5 rounded-xl hover:border-[#EB0A1E] transition-colors cursor-default">
              <h3 className="font-bold text-slate-900 mb-2">{b.name}</h3>
              <div className="flex items-start text-xs text-slate-500 mb-2">
                <MapPin className="w-3 h-3 mr-2 mt-0.5 text-[#EB0A1E]" /> {b.address}
              </div>
              <div className="flex items-center text-xs text-slate-500">
                <Phone className="w-3 h-3 mr-2 text-[#EB0A1E]" /> {b.phone}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FAQ & REFUND POLICY --- */}
      <section id="faq" className="py-20 bg-slate-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {FAQS.map((faq, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                      className="w-full text-left px-5 py-4 font-bold text-sm text-slate-900 flex justify-between items-center"
                    >
                      {faq.q}
                      <ChevronDown className={`w-4 h-4 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-gray-50 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-28">
                <ShieldCheck className="w-8 h-8 text-[#EB0A1E] mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-3">100% Refund Policy</h3>
                <ul className="text-xs text-slate-600 space-y-3 mb-6">
                  <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500 shrink-0"/> Booking amount is fully refundable.</li>
                  <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500 shrink-0"/> Refunds processed to original payment method within 5-7 working days.</li>
                  <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500 shrink-0"/> Change variant/color anytime before invoicing.</li>
                </ul>
                <button className="text-[10px] uppercase tracking-widest font-bold text-[#EB0A1E] hover:underline">
                  Read Full Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Ready to secure your Toyota?</h2>
          <p className="text-slate-500 text-sm mb-8">Join thousands of happy customers in Odisha. Book online for priority allocation.</p>
          <a href="#vehicles" className="inline-block bg-[#EB0A1E] text-white px-10 py-4 rounded text-sm font-bold shadow-lg hover:bg-red-700 transition-colors">
            Start Your Booking
          </a>
        </div>
      </section>

      {/* --- STICKY MOBILE CTA --- */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 flex gap-3 lg:hidden z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <a href="#vehicles" className="flex-grow flex-1 bg-[#EB0A1E] text-white rounded py-3 text-xs font-bold uppercase tracking-widest justify-center items-center flex">
          Book Now
        </a>
        <a href="https://wa.me/919876543212" target="_blank" rel="noopener noreferrer" className="w-12 bg-green-500 text-white rounded flex justify-center items-center shrink-0">
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>

    </div>
  );
}
