"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle, ShieldCheck, Info, ArrowLeft,
  ChevronRight, Star, AlertCircle, Phone
} from 'lucide-react';

const vehicleDatabase: Record<string, {
  checkoutId: string;
  name: string;
  desc: string;
  basePrice: string;
  bookingAmount: string;
  images: string[];
  variants: { id: string; name: string; price: string }[];
  colors: { id: string; name: string; hex: string }[];
}> = {
  'toyota-urban-cruiser-hyryder': {
    checkoutId: 'hyryder',
    name: 'Urban Cruiser Hyryder',
    desc: 'Self-Charging Hybrid Electric SUV',
    basePrice: '₹11.14 Lakh',
    bookingAmount: '₹25,000',
    images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&q=80&w=1200'],
    variants: [
      { id: 'e-mt', name: 'E MT (Petrol)', price: '₹11.31 Lakh' },
      { id: 's-mt', name: 'S MT (Petrol)', price: '₹12.82 Lakh' },
      { id: 'g-hybrid', name: 'G Hybrid (e-CVT)', price: '₹19.24 Lakh' },
      { id: 'v-hybrid', name: 'V Hybrid (e-CVT)', price: '₹19.99 Lakh' }
    ],
    colors: [
      { id: 'cafe-white', name: 'Cafe White', hex: '#F5F5F5' },
      { id: 'speedy-blue', name: 'Speedy Blue', hex: '#1D4ED8' },
      { id: 'sportin-red', name: 'Sportin Red', hex: '#DC2626' },
      { id: 'midnight-black', name: 'Midnight Black', hex: '#000000' }
    ]
  },
  'hyryder': {
    checkoutId: 'hyryder',
    name: 'Urban Cruiser Hyryder',
    desc: 'Self-Charging Hybrid Electric SUV',
    basePrice: '₹11.14 Lakh',
    bookingAmount: '₹25,000',
    images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&q=80&w=1200'],
    variants: [
      { id: 'e-mt', name: 'E MT (Petrol)', price: '₹11.31 Lakh' },
      { id: 's-mt', name: 'S MT (Petrol)', price: '₹12.82 Lakh' },
      { id: 'g-hybrid', name: 'G Hybrid (e-CVT)', price: '₹19.24 Lakh' },
      { id: 'v-hybrid', name: 'V Hybrid (e-CVT)', price: '₹19.99 Lakh' }
    ],
    colors: [
      { id: 'cafe-white', name: 'Cafe White', hex: '#F5F5F5' },
      { id: 'speedy-blue', name: 'Speedy Blue', hex: '#1D4ED8' },
      { id: 'sportin-red', name: 'Sportin Red', hex: '#DC2626' },
      { id: 'midnight-black', name: 'Midnight Black', hex: '#000000' }
    ]
  },
  'toyota-innova-hycross': {
    checkoutId: 'hycross',
    name: 'Innova Hycross',
    desc: 'Advanced MPV with Hybrid Tech',
    basePrice: '₹18.86 Lakh',
    bookingAmount: '₹50,000',
    images: ['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200'],
    variants: [
      { id: 'gx-7str', name: 'GX 7STR (Petrol)', price: '₹19.53 Lakh' },
      { id: 'vx-hybrid', name: 'VX Hybrid 7STR', price: '₹26.76 Lakh' },
      { id: 'zx-o-hybrid', name: 'ZX(O) Hybrid 7STR', price: '₹31.84 Lakh' }
    ],
    colors: [
      { id: 'platinum-white', name: 'Platinum White Pearl', hex: '#FAFAFA' },
      { id: 'attitude-black', name: 'Attitude Black Mica', hex: '#111111' },
      { id: 'ageha-glass', name: 'Blackish Ageha Glass Flake', hex: '#1E3A8A' }
    ]
  },
  'hycross': {
    checkoutId: 'hycross',
    name: 'Innova Hycross',
    desc: 'Advanced MPV with Hybrid Tech',
    basePrice: '₹18.86 Lakh',
    bookingAmount: '₹50,000',
    images: ['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200'],
    variants: [
      { id: 'gx-7str', name: 'GX 7STR (Petrol)', price: '₹19.53 Lakh' },
      { id: 'vx-hybrid', name: 'VX Hybrid 7STR', price: '₹26.76 Lakh' },
      { id: 'zx-o-hybrid', name: 'ZX(O) Hybrid 7STR', price: '₹31.84 Lakh' }
    ],
    colors: [
      { id: 'platinum-white', name: 'Platinum White Pearl', hex: '#FAFAFA' },
      { id: 'attitude-black', name: 'Attitude Black Mica', hex: '#111111' },
      { id: 'ageha-glass', name: 'Blackish Ageha Glass Flake', hex: '#1E3A8A' }
    ]
  }
};

export default function VehicleDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const vehicle = vehicleDatabase[id];

  const [selectedVariant, setSelectedVariant] = useState(
    vehicle ? vehicle.variants[0] : null
  );
  const [selectedColor, setSelectedColor] = useState(
    vehicle ? vehicle.colors[0] : null
  );

  if (!vehicle || !selectedVariant || !selectedColor) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center p-6">
        <AlertCircle className="w-16 h-16 text-[#EB0A1E] mb-4" />
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Vehicle Not Found</h2>
        <p className="text-slate-500 max-w-md mb-8">The vehicle you are looking for does not exist in our system or might have been moved.</p>
        <Link href="/" className="bg-slate-900 text-white px-8 py-3 rounded font-bold hover:bg-[#EB0A1E] transition-colors inline-flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Fleet
        </Link>
      </div>
    );
  }

  const handleBooking = () => {
    router.push(`/checkout/${vehicle.checkoutId}?variant=${selectedVariant.id}&color=${selectedColor.id}`);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-slate-900 selection:bg-[#EB0A1E] selection:text-white pb-32 lg:pb-12">
      
      {/* Top Header / Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link href="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-[#EB0A1E] transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Fleet
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column - Media */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-200/60 shadow-sm relative group">
            <div className="absolute top-4 left-4 z-10 bg-[#EB0A1E] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded shadow-sm">
              Official Allocations Only
            </div>
            <img 
              src={vehicle.images[0]} 
              alt={vehicle.name} 
              className="w-full max-h-[600px] object-cover"
            />
          </div>

          {/* Quick trust stamps below the media */}
          <div className="grid grid-cols-3 gap-4 bg-white p-5 rounded-2xl border border-gray-200/60 text-center">
            <div>
              <ShieldCheck className="w-5 h-5 text-[#EB0A1E] mx-auto mb-1.5" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">100% Refundable</p>
            </div>
            <div>
              <CheckCircle className="w-5 h-5 text-[#EB0A1E] mx-auto mb-1.5" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Official Confirmation</p>
            </div>
            <div>
              <Star className="w-5 h-5 text-[#EB0A1E] mx-auto mb-1.5" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dedicated Advisor</p>
            </div>
          </div>
        </div>

        {/* Right Column - Configuration */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#EB0A1E] bg-red-50 px-2.5 py-1 rounded">
              Laxmi Toyota Exclusive
            </span>
            <h1 className="text-4xl font-extrabold text-slate-900 mt-4 mb-2 tracking-tight">
              {vehicle.name}
            </h1>
            <p className="text-sm text-slate-500">{vehicle.desc}</p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">
                {selectedVariant.price}
              </span>
              <span className="text-xs text-slate-400 font-bold uppercase">
                Ex-Showroom Base
              </span>
            </div>
          </div>

          {/* Variant Selector */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                1. Select Variant
              </h3>
              <p className="text-xs text-slate-500 mt-1">Choose engine, transmission, and features configuration.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {vehicle.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center ${
                    selectedVariant.id === v.id
                      ? 'border-[#EB0A1E] bg-red-50/20 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div>
                    <p className={`text-sm font-bold ${selectedVariant.id === v.id ? 'text-[#EB0A1E]' : 'text-slate-900'}`}>
                      {v.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Ex-Showroom Price</p>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{v.price}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                2. Select Color
              </h3>
              <span className="text-xs font-bold text-slate-700">{selectedColor.name}</span>
            </div>

            <div className="flex gap-3">
              {vehicle.colors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedColor(c)}
                  style={{ backgroundColor: c.hex }}
                  className={`w-10 h-10 rounded-full border transition-all relative ${
                    selectedColor.id === c.id
                      ? 'ring-2 ring-offset-2 ring-[#EB0A1E] border-transparent'
                      : 'border-gray-300 hover:scale-105'
                  }`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Configuration Summary card (Desktop) */}
          <div className="hidden lg:block bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Booking Deposit</p>
                <p className="text-2xl font-black text-[#EB0A1E]">{vehicle.bookingAmount}</p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p className="font-bold">100% Refundable</p>
                <p className="text-[10px]">Prior to invoicing</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Selected Model</span>
                <span className="font-bold text-slate-800">{vehicle.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Selected Variant</span>
                <span className="font-bold text-slate-800">{selectedVariant.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Selected Color</span>
                <span className="font-bold text-slate-800">{selectedColor.name}</span>
              </div>
            </div>

            <button
              onClick={handleBooking}
              className="w-full bg-[#EB0A1E] text-white py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg shadow-red-600/10 flex justify-center items-center"
            >
              Proceed to Secure Booking <ChevronRight className="w-4 h-4 ml-1" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Razorpay Encrypted Checkout
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile CTA (Bottom of screen on mobile) */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 flex flex-col md:flex-row justify-between items-center gap-3 lg:hidden z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
        <div className="w-full flex justify-between items-center md:w-auto">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Booking Deposit</p>
            <p className="text-xl font-black text-[#EB0A1E]">{vehicle.bookingAmount}</p>
          </div>
          <div className="text-right text-[10px] text-slate-400 md:hidden font-bold uppercase">
            {selectedVariant.name}
          </div>
        </div>
        <button
          onClick={handleBooking}
          className="w-full md:w-auto bg-[#EB0A1E] text-white py-3 px-8 rounded-lg text-xs font-bold uppercase tracking-widest flex justify-center items-center shrink-0"
        >
          Secure Booking <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

    </div>
  );
}
