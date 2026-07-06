"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Search, ShoppingCart, MapPin, Phone, Mail, 
  CheckCircle2, Star, ChevronRight, PlayCircle
} from 'lucide-react';

const VEHICLES = [
  { id: 'glanza', name: 'Glanza', desc: 'Premium Hatchback', price: '6.81 Lakh', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800', badge: 'Sale' },
  { id: 'hyryder', name: 'Hyryder', desc: 'Self-Charging Hybrid Electric SUV', price: '11.14 Lakh', img: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&q=80&w=800', badge: 'New' },
  { id: 'hycross', name: 'Innova Hycross', desc: 'Advanced MPV with Hybrid Tech', price: '19.77 Lakh', img: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800', badge: 'Popular' },
  { id: 'fortuner', name: 'Fortuner', desc: 'Legendary SUV', price: '33.43 Lakh', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800', badge: 'Sale' },
  { id: 'camry', name: 'Camry', desc: 'Luxury Hybrid Sedan', price: '46.17 Lakh', img: 'https://images.unsplash.com/photo-1503376710915-18861d9a2638?auto=format&fit=crop&q=80&w=800', badge: '' },
  { id: 'hilux', name: 'Hilux', desc: 'Unbeatable Lifestyle Utility', price: '30.40 Lakh', img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800', badge: 'Sale' },
];

const FEATURES = [
  { title: 'Trusted dealership', desc: 'Over 20 years of delivering smiles and premium Toyota experiences to our customers.', icon: <CheckCircle2 className="w-6 h-6 text-[#EB0A1E]" /> },
  { title: 'Multiple locations', desc: 'Conveniently located branches across South Odisha to serve you better.', icon: <MapPin className="w-6 h-6 text-[#EB0A1E]" /> },
  { title: 'Expert maintenance', desc: 'Toyota certified technicians ensuring your vehicle performs at its absolute best.', icon: <Search className="w-6 h-6 text-[#EB0A1E]" /> },
  { title: 'Highest standards', desc: 'We adhere strictly to Toyota global quality and customer service standards.', icon: <Star className="w-6 h-6 text-[#EB0A1E]" /> },
];

const BRANCHES = [
  { name: 'Aska Branch', address: 'NH-59, Aska Main Road, Ganjam', phone: '+91 98765 43210', email: 'aska@laxmitoyota.co.in' },
  { name: 'Bargarh Branch', address: 'Bargarh Main Road, Near Toll Gate', phone: '+91 98765 43211', email: 'bargarh@laxmitoyota.co.in' },
  { name: 'Berhampur (HQ)', address: 'NH-16, Haladiapadar, Berhampur', phone: '+91 98765 43212', email: 'sales@laxmitoyota.co.in' },
  { name: 'Bhubaneswar Branch', address: 'Patia Industrial Estate, KIIT Square', phone: '+91 98765 43213', email: 'bbsr@laxmitoyota.co.in' },
  { name: 'Jeypore Branch', address: 'NH-26, Jeypore Main Road, Koraput', phone: '+91 98765 43214', email: 'jeypore@laxmitoyota.co.in' },
  { name: 'Paralakhemundi Branch', address: 'Gajapati Main Road, Near Bus Stand', phone: '+91 98765 43215', email: 'pkd@laxmitoyota.co.in' },
];

export default function PremiumStorefront() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-slate-900 selection:bg-[#EB0A1E] selection:text-white">
      
      {/* --- HERO SECTION --- */}
      <section className="bg-slate-900 pt-28 pb-40 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Awaken your drive
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light">
            Experience the perfect blend of innovation, reliability, and performance with Toyota.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a href="#lineup" className="w-full sm:w-auto bg-[#EB0A1E] text-white px-8 py-3.5 rounded-md text-sm font-bold shadow-lg hover:bg-red-700 transition-colors flex items-center justify-center">
              View Vehicles
            </a>
            <a href="#lineup" className="w-full sm:w-auto bg-transparent border-2 border-white text-white px-8 py-3.5 rounded-md text-sm font-bold hover:bg-white hover:text-slate-900 transition-colors flex items-center justify-center">
              Book a Test Drive
            </a>
          </div>
        </div>
      </section>

      {/* --- FLOATING SEARCH BAR --- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Find your perfect Toyota</h2>
          <p className="text-sm text-slate-500 mb-8">Select your preferences below to quickly find your next vehicle.</p>
          
          <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6 items-end">
            <div className="w-full">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Body Type</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]/20 focus:border-[#EB0A1E] appearance-none">
                <option>All Types</option>
                <option>Hatchback</option>
                <option>SUV</option>
                <option>Sedan</option>
                <option>MPV</option>
              </select>
            </div>
            <div className="w-full">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fuel Type</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]/20 focus:border-[#EB0A1E] appearance-none">
                <option>All Fuel Types</option>
                <option>Petrol</option>
                <option>Hybrid</option>
                <option>Diesel</option>
              </select>
            </div>
            <div className="w-full">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Price Range</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]/20 focus:border-[#EB0A1E] appearance-none">
                <option>Any Price</option>
                <option>Under 10 Lakh</option>
                <option>10L - 20L</option>
                <option>Above 20L</option>
              </select>
            </div>
            <div className="w-full">
              <button className="w-full bg-[#EB0A1E] text-white rounded-lg px-4 py-3 text-sm font-bold shadow-md hover:bg-red-700 transition-colors flex justify-center items-center h-[46px]">
                <Search className="w-4 h-4 mr-2" /> Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- FEATURED VEHICLES --- */}
      <section id="lineup" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Featured vehicles</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Explore our most popular Toyota models, perfectly suited for Indian roads.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {VEHICLES.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
              <div>
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  {vehicle.badge && (
                    <div className="absolute top-4 right-4 z-10 bg-[#EB0A1E] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                      {vehicle.badge}
                    </div>
                  )}
                  <img 
                    src={vehicle.img} 
                    alt={vehicle.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{vehicle.name}</h3>
                  <p className="text-sm text-slate-500 mb-6 h-10">{vehicle.desc}</p>
                </div>
              </div>
              
              <div className="p-6 pt-0">
                <div className="flex justify-between items-end pt-4 border-t border-slate-50">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Starting at</p>
                    <p className="text-lg font-black text-[#EB0A1E]">₹ {vehicle.price}</p>
                  </div>
                  <Link 
                    href={`/book/${vehicle.id}`}
                    className="bg-slate-900 text-white px-5 py-2.5 rounded-md text-xs font-bold hover:bg-[#EB0A1E] transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- WHY CHOOSE US --- */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Why choose Laxmi Toyota</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">The premier destination for Toyota in South Odisha.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="bg-[#F9FAFB] p-8 rounded-2xl flex items-start space-x-6 border border-slate-50 hover:border-slate-200 transition-colors">
                <div className="flex-shrink-0 w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- RED BANNER CTA --- */}
      <section className="bg-[#EB0A1E] py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Experience Toyota firsthand</h2>
          <p className="text-red-100 text-lg mb-10">Book a test drive today and feel the difference of driving a Toyota.</p>
          <a href="#lineup" className="bg-white text-[#EB0A1E] px-8 py-4 rounded-md font-bold shadow-lg hover:bg-slate-50 transition-colors inline-flex items-center">
            Schedule Test Drive <PlayCircle className="w-5 h-5 ml-2" />
          </a>
        </div>
      </section>

      {/* --- BRANCHES --- */}
      <section className="py-24 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Visit our branches</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Choose your nearest location in South Odisha.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BRANCHES.map((branch, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col h-full">
                <h3 className="text-xl font-bold text-slate-900 mb-4">{branch.name}</h3>
                
                <div className="space-y-4 mb-8 flex-grow">
                  <div className="flex items-start text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mr-3 mt-1 flex-shrink-0 text-[#EB0A1E]" />
                    <span>{branch.address}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Phone className="w-4 h-4 mr-3 flex-shrink-0 text-[#EB0A1E]" />
                    <span>{branch.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Mail className="w-4 h-4 mr-3 flex-shrink-0 text-[#EB0A1E]" />
                    <span>{branch.email}</span>
                  </div>
                </div>

                <a href="#lineup" className="w-full bg-slate-50 text-slate-900 border border-slate-200 py-3 rounded-md text-sm font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors flex items-center justify-center">
                  Visit Branch
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRE-FOOTER CTA --- */}
      <section className="bg-slate-900 py-20 px-4 text-center border-b border-slate-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Ready to bring home your Toyota?</h2>
          <p className="text-slate-400 text-lg mb-10">Start your journey with us today. Book online and secure your allocation.</p>
          <a href="#lineup" className="bg-[#EB0A1E] text-white px-10 py-4 rounded-md font-bold shadow-lg hover:bg-red-700 transition-colors">
            Book Online Now
          </a>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Col 1 */}
          <div>
            <h3 className="text-[#EB0A1E] text-xl font-black tracking-tight mb-6">Laxmi Toyota</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              The authorized Toyota dealership for South Odisha. Committed to delivering premium automotive experiences and unparalleled service.
            </p>
          </div>
          
          {/* Col 2 */}
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Offers</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-bold mb-6">Popular Vehicles</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Fortuner</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Innova Hycross</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hyryder</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Glanza</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-white font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start">
                <Phone className="w-4 h-4 mr-3 mt-1 text-[#EB0A1E]" />
                <span>1800-XXX-XXXX<br/><span className="text-xs text-slate-500">Toll Free</span></span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-[#EB0A1E]" />
                <span>support@laxmitoyota.co.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-xs mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Laxmi Toyota. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
