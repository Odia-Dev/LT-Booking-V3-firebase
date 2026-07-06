"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import Lenis from 'lenis';
import { 
  Search, MapPin, Phone, Mail, 
  CheckCircle2, Star, ChevronRight, PlayCircle,
  Menu, X, Car, CreditCard, ShieldCheck, 
  ThumbsUp, HelpCircle, ChevronDown, MessageCircle
} from 'lucide-react';

// Lenis smooth scroll initialization hook
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
}

// Animated Counter Component for Trust Stats
function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.abs(Math.floor(totalMiliseconds / end));

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) {
        clearInterval(timer);
      }
    }, Math.max(incrementTime, 10));

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
}

const VEHICLES = [
  { 
    id: 'glanza', 
    name: 'Glanza', 
    spec: 'Smart Hatchback • 22+ km/l • Perfect for City Drives', 
    price: '6.81 Lakh', 
    booking: '11,000', 
    img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800', 
    badge: 'Sale' 
  },
  { 
    id: 'hyryder', 
    name: 'Hyryder', 
    spec: 'Self-Charging Hybrid SUV • 27.97 km/l • Premium Family SUV', 
    price: '11.14 Lakh', 
    booking: '21,000', 
    img: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&q=80&w=800', 
    badge: 'Popular' 
  },
  { 
    id: 'hycross', 
    name: 'Innova Hycross', 
    spec: 'Advanced Hybrid MPV • Spacious 7 Seater • Future Ready', 
    price: '19.77 Lakh', 
    booking: '50,000', 
    img: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800', 
    badge: 'High Demand' 
  },
  { 
    id: 'fortuner', 
    name: 'Fortuner', 
    spec: 'Legendary SUV • Command Every Road • Premium Ownership', 
    price: '33.43 Lakh', 
    booking: '1,00,000', 
    img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800', 
    badge: 'Iconic' 
  },
];

const BRANCHES = [
  { name: 'Brahmapur (HQ)', address: 'NH-16, Haladiapadar' },
  { name: 'Jeypore', address: 'NH-26, Jeypore Main Road' },
  { name: 'Bargarh', address: 'Bargarh Main Road' },
  { name: 'Balangir', address: 'Balangir Highway' },
  { name: 'Rayagada', address: 'Near Bus Stand Road' },
  { name: 'Bhawanipatna', address: 'Main Town Road' },
  { name: 'Paralakhemundi', address: 'Gajapati Palace Road' },
  { name: 'Aska', address: 'NH-59, Aska Main Road' }
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
  useLenis();
  const { user, loading, loginWithGoogle, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-[#EB0A1E] selection:text-white pb-20 lg:pb-0 scroll-smooth">
      
      {/* 5K BONUS BANNER */}
      <div className="w-full bg-[#EB0A1E] text-white py-3 px-4 text-center text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 z-[60] relative">
        <span>⚡ ONLINE EXCLUSIVE: Get ₹5,000 instant discount on your final invoice when you book online today.</span>
      </div>

      {/* FLOATING MOBILE BOOK NOW BUTTON (Left corner on mobile to avoid chatbot overlap) */}
      <div className="fixed bottom-6 left-6 lg:hidden z-50">
        <Link
          href="/#vehicles"
          className="bg-[#EB0A1E] text-white font-black uppercase tracking-widest text-[10px] px-5 py-3 rounded-full shadow-2xl flex items-center gap-1 active:scale-95 transition-all border border-red-500/20"
        >
          Book Now
        </Link>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center cursor-pointer">
              <span className="text-[#EB0A1E] text-2xl font-black tracking-tight">Laxmi Toyota</span>
            </Link>
            
            {/* Core / Revenue Page links */}
            <div className="hidden lg:flex space-x-6 items-center">
              <Link href="/" className="text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-[#EB0A1E] transition-colors">
                Home
              </Link>
              <Link href="/#vehicles" className="text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-[#EB0A1E] transition-colors">
                Vehicles
              </Link>
              <Link href="/book-test-drive" className="text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-[#EB0A1E] transition-colors">
                Test Drive
              </Link>
              <Link href="/toyota-emi-calculator" className="text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-[#EB0A1E] transition-colors">
                EMI Check
              </Link>
              <Link href="/#offers" className="text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-[#EB0A1E] transition-colors">
                Offer
              </Link>
              <Link href="/#contact-us" className="text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-[#EB0A1E] transition-colors">
                Contact
              </Link>
              <Link href="/blog" className="text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-[#EB0A1E] transition-colors">
                Blog
              </Link>
            </div>

            {/* Right Side Buttons (Book Now, Login) */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                href="/#vehicles"
                className="bg-[#EB0A1E] text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest shadow-md hover:bg-red-700 transition-all text-center"
              >
                Book Now
              </Link>

              {loading ? (
                <div className="h-8 w-8 rounded-full border border-gray-200 bg-gray-100 animate-pulse" />
              ) : user ? (
                <div className="flex items-center space-x-3">
                  <Link href="/dashboard" className="relative group cursor-pointer shrink-0">
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={user.displayName || "Profile"}
                        width={32}
                        height={32}
                        className="rounded-full border border-gray-200"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-[#EB0A1E] flex items-center justify-center text-white font-bold text-xs">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                  </Link>
                  <button
                    onClick={logout}
                    className="border border-gray-250 hover:border-[#EB0A1E] bg-white text-slate-700 hover:text-[#EB0A1E] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={loginWithGoogle}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest shadow-md transition-all text-center"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile hamburger */}
            <div className="lg:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-3.5 shadow-lg absolute w-full text-left">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold uppercase tracking-wider text-slate-700 hover:text-[#EB0A1E]">
              Home
            </Link>
            <Link href="/#vehicles" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold uppercase tracking-wider text-slate-700 hover:text-[#EB0A1E]">
              Vehicles
            </Link>
            <Link href="/book-test-drive" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold uppercase tracking-wider text-slate-700 hover:text-[#EB0A1E]">
              Test Drive
            </Link>
            <Link href="/toyota-emi-calculator" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold uppercase tracking-wider text-slate-700 hover:text-[#EB0A1E]">
              EMI Check
            </Link>
            <Link href="/#offers" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold uppercase tracking-wider text-slate-700 hover:text-[#EB0A1E]">
              Offer
            </Link>
            <Link href="/#contact-us" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold uppercase tracking-wider text-slate-700 hover:text-[#EB0A1E]">
              Contact
            </Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold uppercase tracking-wider text-slate-700 hover:text-[#EB0A1E]">
              Blog
            </Link>
            
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
              <Link
                href="/#vehicles"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-[#EB0A1E] text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md"
              >
                Book Now
              </Link>
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-slate-900 text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider"
                >
                  My Dashboard
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    loginWithGoogle();
                  }}
                  className="w-full text-center bg-slate-900 text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* --- CINEMATIC HERO SECTION --- */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-black px-4">
        {/* Background Video */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-75 pointer-events-none"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-modern-suv-car-driving-on-a-rainy-road-40292-large.mp4" type="video/mp4" />
        </video>
        
        {/* Gradient Overlay for high readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-950/60 z-0"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10 text-white">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-white/10"
          >
            <ShieldCheck className="w-4 h-4 text-[#EB0A1E]" />
            <span>Official Toyota Dealer for South Odisha</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-[44px] sm:text-[64px] lg:text-[80px] font-black tracking-tight mb-6 leading-none text-white drop-shadow-sm"
          >
            Reserve Your Toyota Car <br className="hidden md:inline"/>Online in Just 2 Minutes
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg lg:text-[18px] text-slate-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Secure your preferred variant and color with an authorized Toyota dealer serving South Odisha.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <a href="#vehicles" className="w-full sm:w-auto bg-[#EB0A1E] text-white px-8 py-4 rounded text-sm font-bold shadow-lg hover:bg-red-700 transition-colors flex items-center justify-center">
              Explore Vehicles <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* --- TRUST BAR WITH ANIMATED COUNTERS --- */}
      <div className="bg-white border-b border-gray-100 py-10 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-[#EB0A1E] mb-2" />
              <p className="text-3xl font-black text-slate-900">
                <AnimatedCounter value={3000} />+
              </p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Toyota Deliveries</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <MapPin className="w-6 h-6 text-[#EB0A1E] mb-2" />
              <p className="text-3xl font-black text-slate-900">
                <AnimatedCounter value={8} />
              </p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Locations Across Odisha</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Star className="w-6 h-6 text-[#EB0A1E] mb-2" />
              <p className="text-3xl font-black text-slate-900">4.8★</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Customer Rating</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#EB0A1E] mb-2" />
              <p className="text-3xl font-black text-slate-900">
                <AnimatedCounter value={4} />+ Years
              </p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Of Trust</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- FEATURED VEHICLES GRID --- */}
      <section id="vehicles" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-[48px] font-extrabold text-slate-900 mb-4 tracking-tight">Choose Your Toyota</h2>
          <p className="text-slate-500 text-sm">Select a model to view variants, colors, and secure your booking.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VEHICLES.map((v) => (
            <motion.div 
              key={v.id} 
              whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <div className="absolute top-3 right-3 z-10 bg-[#EB0A1E] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                    {v.badge}
                  </div>
                  <img 
                    src={v.img} 
                    alt={v.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-[24px] font-bold text-slate-900 mb-1">{v.name}</h3>
                  <p className="text-xs text-slate-500 mb-4 h-12 leading-relaxed">{v.spec}</p>
                </div>
              </div>
              
              <div className="p-5 pt-0">
                <div className="flex justify-between items-end mb-4 pt-4 border-t border-gray-105">
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
                  href={v.id === 'hyryder' ? '/vehicles/toyota-urban-cruiser-hyryder' : v.id === 'hycross' ? '/vehicles/toyota-innova-hycross' : `/book/${v.id}`}
                  className="w-full bg-slate-900 text-white py-2.5 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#EB0A1E] transition-colors flex items-center justify-center"
                >
                  Select Variant & Book
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- HOW ONLINE BOOKING WORKS --- */}
      <section id="how-it-works" className="py-24 bg-slate-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[48px] font-extrabold text-slate-900 mb-4 tracking-tight">How Online Booking Works</h2>
            <p className="text-slate-500 text-sm">A seamless, transparent process designed to give you priority allocation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <Car className="w-6 h-6 text-[#EB0A1E]"/>, title: 'Choose Toyota', desc: 'Select your preferred model, variant, and color.' },
              { icon: <CreditCard className="w-6 h-6 text-[#EB0A1E]"/>, title: 'Secure Payment', desc: 'Pay the official booking amount securely via Razorpay.' },
              { icon: <CheckCircle2 className="w-6 h-6 text-[#EB0A1E]"/>, title: 'Instant Confirmation', desc: 'Receive your official booking ID and receipt immediately.' },
              { icon: <Phone className="w-6 h-6 text-[#EB0A1E]"/>, title: 'Advisor Contact', desc: 'Your dedicated RM calls you to arrange finance and delivery.' }
            ].map((step, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 text-center relative shadow-sm">
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
      <section id="offers" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[48px] font-extrabold text-slate-900 mb-8 text-center tracking-tight">Exclusive Online Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {OFFERS.map((offer, i) => (
            <div key={i} className="border border-[#EB0A1E]/20 bg-red-50/30 p-6 rounded-xl relative overflow-hidden flex flex-col justify-between">
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
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[48px] font-extrabold mb-12 text-center tracking-tight">What our customers say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-between">
                <div>
                  <div className="flex text-[#F59E0B] mb-4">
                    {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-sm text-slate-300 italic mb-6">"{t.text}"</p>
                </div>
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
      <section id="branches" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[48px] font-extrabold text-slate-900 mb-2 text-center tracking-tight">Serving South Odisha</h2>
        <p className="text-center text-slate-500 text-sm mb-12">Select your nearest branch during checkout.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {BRANCHES.map((b, i) => (
            <div key={i} className="border border-gray-200 p-5 rounded-xl hover:border-[#EB0A1E] transition-colors cursor-default flex flex-col justify-between h-full">
              <div>
                <h3 className="font-bold text-slate-900 mb-2">{b.name}</h3>
                <div className="flex items-start text-xs text-slate-500 mb-2">
                  <MapPin className="w-3 h-3 mr-2 mt-0.5 text-[#EB0A1E]" /> {b.address}
                </div>
              </div>
              <a href="#vehicles" className="w-full bg-slate-50 text-slate-900 border border-slate-200 py-2.5 rounded text-xs font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors flex items-center justify-center mt-4">
                Book Now
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* --- FAQ & REFUND POLICY --- */}
      <section id="faq" className="py-24 bg-slate-50 border-t border-gray-100">
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

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          {/* Col 1 */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-[#EB0A1E] text-xl font-black tracking-tight mb-6">Laxmi Toyota</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              The authorized Toyota dealer for South Odisha. Committed to delivering premium automotive experiences and unparalleled service.
            </p>
          </div>
          
          {/* Col 2 */}
          <div>
            <h4 className="text-white font-bold mb-6">Vehicles</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#vehicles" className="hover:text-white transition-colors">Vehicles</a></li>
              <li><a href="#offers" className="hover:text-white transition-colors">Offers</a></li>
              <li><a href="#vehicles" className="hover:text-white transition-colors">Test Drive</a></li>
              <li><a href="#vehicles" className="hover:text-white transition-colors">Book Online</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Refund Policy</a></li>
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-white font-bold mb-6">Branches</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Brahmapur</li>
              <li>Jeypore</li>
              <li>Bargarh</li>
              <li>Balangir</li>
              <li>Rayagada</li>
              <li>Bhawanipatna</li>
              <li>Paralakhemundi</li>
              <li>Aska</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-xs mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Laxmi Toyota. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-slate-500">
            <span className="text-slate-400">Official Toyota Dealer for South Odisha</span>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
