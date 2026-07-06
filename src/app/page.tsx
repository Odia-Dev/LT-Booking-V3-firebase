"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import VehicleCard from "@/components/VehicleCard";
import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  ArrowRight, 
  Clock, 
  Star, 
  HelpCircle, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  CreditCard, 
  BadgePercent, 
  MessageCircle,
  ThumbsUp,
  Map,
  Compass,
  ArrowUpRight
} from "lucide-react";

// Section 2: Fleet Data with all required specs
const VEHICLE_LINEUP = [
  {
    id: "glanza",
    name: "Toyota Glanza",
    type: "Hatchback",
    startingPrice: "₹6.86 Lakh",
    bookingAmount: 11000,
    imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600",
    fuelType: "Petrol / CNG",
    mileage: "22.35 km/l",
    seating: "5",
    transmission: "MT / AMT",
  },
  {
    id: "taisor",
    name: "Toyota Taisor",
    type: "Compact SUV",
    startingPrice: "₹7.74 Lakh",
    bookingAmount: 11000,
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600",
    fuelType: "Petrol / CNG",
    mileage: "21.50 km/l",
    seating: "5",
    transmission: "5MT / 6AT",
  },
  {
    id: "rumion",
    name: "Toyota Rumion",
    type: "Premium MPV",
    startingPrice: "₹10.44 Lakh",
    bookingAmount: 21000,
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600",
    fuelType: "Petrol / CNG",
    mileage: "20.51 km/l",
    seating: "7",
    transmission: "5MT / 6AT",
  },
  {
    id: "hyryder",
    name: "Urban Cruiser Hyryder",
    type: "Hybrid SUV",
    startingPrice: "₹11.14 Lakh",
    bookingAmount: 21000,
    imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=600",
    fuelType: "Petrol / Hybrid",
    mileage: "27.97 km/l",
    seating: "5",
    transmission: "e-CVT / MT / AT",
  },
  {
    id: "fortuner",
    name: "Toyota Fortuner",
    type: "Legendary SUV",
    startingPrice: "₹33.43 Lakh",
    bookingAmount: 100000,
    imageUrl: "https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?auto=format&fit=crop&q=80&w=600",
    fuelType: "Diesel / Petrol",
    mileage: "14.60 km/l",
    seating: "7",
    transmission: "6MT / 6AT 4x4",
  },
  {
    id: "hycross",
    name: "Innova Hycross",
    type: "Premium MPV/SUV",
    startingPrice: "₹19.77 Lakh",
    bookingAmount: 50000,
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600",
    fuelType: "Petrol / Hybrid",
    mileage: "23.24 km/l",
    seating: "7 / 8",
    transmission: "e-CVT / Direct Shift",
  },
];

// Section 8: Branch Locations
const BRANCH_LOCATIONS = [
  { name: "Brahmapur", address: "Main Road, Near Khallikote College, Brahmapur, Odisha 760001", phone: "+91 94370 00001" },
  { name: "Jeypore", address: "NH-26, Jeypore Bypass Road, Jeypore, Odisha 764001", phone: "+91 94370 00002" },
  { name: "Bargarh", address: "Canal Avenue Road, Near Toll Gate, Bargarh, Odisha 768028", phone: "+91 94370 00003" },
  { name: "Balangir", address: "Sambalpur Road, Near RTO Office, Balangir, Odisha 767001", phone: "+91 94370 00004" },
  { name: "Rayagada", address: "JK Road, Near Railway Station, Rayagada, Odisha 765001", phone: "+91 94370 00005" },
  { name: "Bhawanipatna", address: "Junagarh Road, Bhawanipatna, Odisha 766001", phone: "+91 94370 00006" },
  { name: "Paralakhemundi", address: "Forest Gate Road, Paralakhemundi, Odisha 761200", phone: "+91 94370 00007" },
  { name: "Aska", address: "Bhanjanagar Road, Aska, Odisha 761111", phone: "+91 94370 00008" },
];

export default function Home() {
  const { user, loading, signingIn, loginWithGoogle, isConfigured } = useAuth();
  
  // Section 6: Countdown Timer Setup
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 22, seconds: 58 });
  
  // Section 7: Testimonial Carousel Setup
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonials = [
    {
      name: "Debasish Mohanty",
      location: "Brahmapur",
      review: "The hybrid Hycross delivers phenomenal mileage in city traffic. Booking online via Laxmi Toyota was extremely smooth, and the advisor called within 15 minutes of my deposit receipt.",
      rating: 5,
      vehicle: "Innova Hycross Hybrid",
      deliveryImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400"
    },
    {
      name: "Sujata Patnaik",
      location: "Jeypore",
      review: "Absolutely love my new Glanza! Online payment via Razorpay was secured by 3D authentication. Received email updates daily until keys were handed over at Jeypore branch.",
      rating: 5,
      vehicle: "Toyota Glanza",
      deliveryImage: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400"
    },
    {
      name: "Rajesh Sahu",
      location: "Rayagada",
      review: "Booked a Fortuner online. Got priority allocation and transparent financing. Laxmi Toyota is the gold standard for premium automotive dealerships in South Odisha.",
      rating: 5,
      vehicle: "Toyota Fortuner",
      deliveryImage: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=400"
    }
  ];

  // Section 9: FAQ Accordion Setup
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = [
    { q: "Is online booking secure?", a: "Yes, 100%. All transactions are processed through Razorpay's bank-grade 256-bit SSL encrypted secure payment gateway. We do not store your card details." },
    { q: "Is booking refundable?", a: "Yes, fully. Booking deposits are 100% refundable prior to invoicing or vehicle allotment. No questions asked. Cancellations can be requested via your dashboard." },
    { q: "Can I change my variant later?", a: "Absolutely. You can modify your preferred variant, engine type, or transmission options prior to invoicing in coordination with your assigned sales advisor." },
    { q: "Can I change my color later?", a: "Yes. Color choice is flexible and can be updated at any time depending on production batch and stock availability at our dealerships." },
    { q: "Is this an official Toyota booking?", a: "Yes, Laxmi Toyota is the official authorized dealer for Toyota Kirloskar Motor serving South Odisha. Your reservation acts as a legal order booking." },
    { q: "How quickly will someone contact me?", a: "Once booking confirmation is sent, a dedicated relationship manager from your selected branch will contact you within 2 working hours to verify documents." },
    { q: "Can I finance my vehicle after booking?", a: "Yes. Our team assists with paperless loan processing, offering schemes from major banks (SBI, HDFC, ICICI, etc.) along with exchange evaluation." }
  ];

  // Analytics Conversion Scroll Tracker & Countdown Timer logic
  useEffect(() => {
    // Scroll depth tracking mock-up
    const handleScroll = () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollDepth === 25 || scrollDepth === 50 || scrollDepth === 75 || scrollDepth === 95) {
        console.log(`[Analytics] User reached ${scrollDepth}% scroll depth`);
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Countdown Timer decrements
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0B0F19] text-white overflow-hidden font-sans">
      
      {/* SEO Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AutoDealer",
            "name": "Laxmi Toyota South Odisha",
            "image": "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=600",
            "@id": "https://laxmitoyota-odisha.com",
            "url": "https://laxmitoyota-odisha.com",
            "telephone": "+919437000001",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Main Road, Near Khallikote College",
              "addressLocality": "Brahmapur",
              "addressRegion": "Odisha",
              "postalCode": "760001",
              "addressCountry": "IN"
            },
            "priceRange": "₹6,86,000 - ₹2,18,00,000",
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
              "opens": "09:00",
              "closes": "19:00"
            }
          })
        }}
      />

      {/* Ambient backgrounds */}
      <div className="absolute top-0 inset-x-0 h-[1000px] bg-gradient-to-b from-[#EB0A1E]/10 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-[20%] left-[-20%] w-[600px] h-[600px] rounded-full bg-[#EB0A1E]/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-20%] w-[650px] h-[650px] rounded-full bg-[#F59E0B]/5 blur-[140px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-24 sm:space-y-32 pt-8 pb-24">
        
        {/* Section 1 — Hero Section Enhancement */}
        <section className="text-center space-y-8 max-w-5xl mx-auto pt-12 sm:pt-20">
          {!isConfigured && (
            <div className="mx-auto max-w-md rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-200 backdrop-blur-sm animate-pulse">
              <span className="font-semibold">⚠️ local dev mode:</span> Running with local mock auth. Click login to simulate.
            </div>
          )}

          <div className="inline-flex items-center space-x-2 rounded-full border border-zinc-800/80 bg-zinc-900/40 px-4 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#EB0A1E] animate-pulse" />
            <span className="text-xs font-semibold text-zinc-300 tracking-wide uppercase font-display">
              Official Dealer for South Odisha
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-display bg-gradient-to-b from-white via-white to-zinc-400 bg-clip-text text-transparent leading-none max-w-4xl mx-auto">
            Reserve Your New <br className="hidden sm:inline"/>
            <span className="text-gradient-red">Toyota Online</span> In Just 2 Minutes
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-light">
            Official Toyota Dealer for Odisha • Secure Online Booking • Instant Confirmation. <br/>
            Skip the dealership delays. Lock in your delivery slot instantly.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#lineup"
              onClick={() => console.log("[Conversion] Clicked Hero Primary CTA")}
              className="w-full sm:w-auto text-center rounded-full bg-[#EB0A1E] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-[#EB0A1E]/20 hover:bg-red-700 hover:scale-[1.02] active:scale-[1] transition-all duration-300"
            >
              Book Your Toyota
            </a>
            <a
              href="#lineup"
              className="w-full sm:w-auto text-center rounded-full border border-zinc-800 bg-zinc-900/40 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all duration-300"
            >
              Explore Vehicles
            </a>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 text-xs text-zinc-400 font-medium">
            <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-zinc-900/25 border border-zinc-900/80">
              <Award className="h-4 w-4 text-[#EB0A1E]" />
              <span>Authorized Dealer</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-zinc-900/25 border border-zinc-900/80">
              <CreditCard className="h-4 w-4 text-[#F59E0B]" />
              <span>Secure Razorpay Payments</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-zinc-900/25 border border-zinc-900/80">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span>Google Login Protected</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-zinc-900/25 border border-zinc-900/80">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span>8 Branch Support</span>
            </div>
          </div>

          {/* Hero Featured Car Image Box */}
          <div className="pt-8 max-w-4xl mx-auto relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] to-transparent z-10 bottom-0 h-24" />
            <img
              src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200"
              alt="Toyota Premium Fleet"
              className="w-full h-[300px] sm:h-[450px] object-cover rounded-3xl border border-zinc-800 shadow-2xl transition-transform duration-700 group-hover:scale-[1.01]"
              loading="eager"
            />
            <div className="absolute bottom-6 left-6 z-20 text-left bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800 backdrop-blur-md">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Featured Model</p>
              <h4 className="text-lg font-bold text-white">Urban Cruiser Hyryder Hybrid</h4>
              <p className="text-xs text-[#F59E0B]">Best In Class 27.97 km/l Mileage</p>
            </div>
          </div>
        </section>

        {/* Section 2 — Featured Vehicles Section */}
        <section id="lineup" className="space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display">Featured Fleet lineup</h2>
            <p className="text-sm text-zinc-400">Select a model to lock your booking allocation priority and place your refundable reservation deposit.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {VEHICLE_LINEUP.map((car) => (
              <VehicleCard
                key={car.id}
                id={car.id}
                name={car.name}
                type={car.type}
                startingPrice={car.startingPrice}
                bookingAmount={car.bookingAmount}
                imageUrl={car.imageUrl}
                fuelType={car.fuelType}
                mileage={car.mileage}
                seating={car.seating}
                transmission={car.transmission}
              />
            ))}
          </div>
        </section>

        {/* Section 3 — How Online Booking Works */}
        <section className="space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold text-[#EB0A1E] uppercase tracking-widest bg-[#EB0A1E]/10 px-3.5 py-1.5 rounded-full">Simple & Secured</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display pt-2">How Online Booking Works</h2>
            <p className="text-sm text-zinc-400">Our transparent online reservation system bypasses traditional paperwork delays.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="space-y-4 p-6 bg-zinc-900/20 border border-zinc-900 rounded-3xl relative">
              <span className="absolute top-4 right-4 text-4xl font-black text-zinc-800">01</span>
              <div className="h-10 w-10 bg-[#EB0A1E]/10 rounded-2xl flex items-center justify-center text-[#EB0A1E] font-bold">1</div>
              <h3 className="text-lg font-bold text-white">Choose Your Toyota</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Select from South Odisha's leading Toyota models. Explore detailed specs, configurations, and variant details directly online.</p>
            </div>
            
            <div className="space-y-4 p-6 bg-zinc-900/20 border border-zinc-900 rounded-3xl relative">
              <span className="absolute top-4 right-4 text-4xl font-black text-zinc-800">02</span>
              <div className="h-10 w-10 bg-[#EB0A1E]/10 rounded-2xl flex items-center justify-center text-[#EB0A1E] font-bold">2</div>
              <h3 className="text-lg font-bold text-white">Select Variant & Color</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Customize your booking allocation with desired variants (Petrol, Hybrid, MT, AT) and preferred factory color palettes.</p>
            </div>

            <div className="space-y-4 p-6 bg-zinc-900/20 border border-zinc-900 rounded-3xl relative">
              <span className="absolute top-4 right-4 text-4xl font-black text-zinc-800">03</span>
              <div className="h-10 w-10 bg-[#EB0A1E]/10 rounded-2xl flex items-center justify-center text-[#EB0A1E] font-bold">3</div>
              <h3 className="text-lg font-bold text-white">Secure Online Deposit</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Make a 100% refundable token deposit safely through Razorpay checkout integration with instant confirmation invoice.</p>
            </div>

            <div className="space-y-4 p-6 bg-zinc-900/20 border border-zinc-900 rounded-3xl relative">
              <span className="absolute top-4 right-4 text-4xl font-black text-zinc-800">04</span>
              <div className="h-10 w-10 bg-[#EB0A1E]/10 rounded-2xl flex items-center justify-center text-[#EB0A1E] font-bold">4</div>
              <h3 className="text-lg font-bold text-white">Instant Confirmation</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Receive automated booking confirmations, SMS alerts, and access to your custom dealer dashboard showing order status.</p>
            </div>

            <div className="space-y-4 p-6 bg-zinc-900/20 border border-zinc-900 rounded-3xl relative">
              <span className="absolute top-4 right-4 text-4xl font-black text-zinc-800">05</span>
              <div className="h-10 w-10 bg-[#EB0A1E]/10 rounded-2xl flex items-center justify-center text-[#EB0A1E] font-bold">5</div>
              <h3 className="text-lg font-bold text-white">Advisor Matchmaking</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">A dedicated branch representative contacts you within 2 working hours to confirm color priorities and verify details.</p>
            </div>

            <div className="space-y-4 p-6 bg-zinc-900/20 border border-zinc-900 rounded-3xl relative">
              <span className="absolute top-4 right-4 text-4xl font-black text-zinc-800">06</span>
              <div className="h-10 w-10 bg-[#EB0A1E]/10 rounded-2xl flex items-center justify-center text-[#EB0A1E] font-bold">6</div>
              <h3 className="text-lg font-bold text-white">Finance & Quick Delivery</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Assisted finance approvals, evaluation of exchange offers, documentation processing, and prioritize delivery timelines.</p>
            </div>
          </div>
        </section>

        {/* Section 4 — Why Book Online With Laxmi Toyota */}
        <section className="space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest bg-[#F59E0B]/10 px-3.5 py-1.5 rounded-full">Owner Privileges</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display pt-2">Why Book Online</h2>
            <p className="text-sm text-zinc-400">Unique advantages designed exclusively for Laxmi Toyota's online reservation portal.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-zinc-900/30 border border-zinc-850 hover:border-[#EB0A1E]/30 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-[#EB0A1E] mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Priority Vehicle Allocation</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Get prioritized queue slot numbering. Be first in line when new inventory units are dispatched from factory batches.</p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/30 border border-zinc-850 hover:border-[#EB0A1E]/30 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-[#F59E0B] mb-6 group-hover:scale-110 transition-transform">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Preferred Color Selection</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Lock in rare and high-demand colors with absolute priority, avoiding factory allocation shortages later.</p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/30 border border-zinc-850 hover:border-[#EB0A1E]/30 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Faster Delivery Processing</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Pre-entered details fast-track logistics. Enjoy up to 10 days earlier deliveries compared to standard offline queues.</p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/30 border border-zinc-850 hover:border-[#EB0A1E]/30 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Dedicated Relationship Manager</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Get a single, experienced point-of-contact advisor for transparent support from reservation up to delivery day.</p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/30 border border-zinc-850 hover:border-[#EB0A1E]/30 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Finance & Exchange Support</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Custom paperwork processing for zero-down payment schemes, quick old car valuations, and bank partnerships.</p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/30 border border-zinc-850 hover:border-[#EB0A1E]/30 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-500 mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Secure Booking Confirmation</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Bank-authenticated payments and digital receipts. No hidden brokerage or unofficial booking slips.</p>
            </div>
          </div>
        </section>

        {/* Section 5 — Trust and Brand Section */}
        <section className="p-8 sm:p-12 rounded-3xl bg-zinc-900/20 border border-zinc-850/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-48 w-48 bg-[#EB0A1E]/5 blur-[80px] pointer-events-none" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-zinc-800">
            <div className="space-y-2 pt-6 lg:pt-0">
              <p className="text-4xl sm:text-5xl font-black text-white tracking-tight font-display">10,000+</p>
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Happy Customers</p>
            </div>
            <div className="space-y-2 pt-6 lg:pt-0">
              <p className="text-4xl sm:text-5xl font-black text-[#EB0A1E] tracking-tight font-display">8</p>
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Locations In South Odisha</p>
            </div>
            <div className="space-y-2 pt-6 lg:pt-0">
              <p className="text-4xl sm:text-5xl font-black text-white tracking-tight font-display">20+ Yrs</p>
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Trust Serving Odisha</p>
            </div>
            <div className="space-y-2 pt-6 lg:pt-0">
              <div className="flex items-center justify-center gap-1">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight font-display">4.8</span>
                <Star className="h-6 w-6 text-[#F59E0B] fill-[#F59E0B]" />
              </div>
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Google Rating</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-12 pt-8 border-t border-zinc-850/80 text-xs text-zinc-500 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <Award className="h-5 w-5 text-[#EB0A1E]" />
              Toyota Authorized Dealer
            </span>
            <span className="hidden sm:inline text-zinc-800">•</span>
            <span className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#F59E0B]" />
              Secure Payment Verified
            </span>
            <span className="hidden sm:inline text-zinc-800">•</span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              Google Authenticated Portal
            </span>
          </div>
        </section>

        {/* Section 6 — Current Offers Section */}
        <section className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest bg-green-500/10 px-3.5 py-1.5 rounded-full">Limited Season Benefits</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display pt-2">Exclusive Online Booking Benefits</h2>
            </div>
            
            {/* Offer Expiry Countdown Timer UI */}
            <div className="bg-zinc-900/50 border border-zinc-800 px-6 py-3 rounded-2xl flex items-center gap-4">
              <Clock className="h-5 w-5 text-[#F59E0B] shrink-0" />
              <div className="text-xs font-semibold">
                <span className="text-zinc-500 block uppercase text-[9px] tracking-widest">Offers End In</span>
                <span className="font-mono text-sm text-white tracking-wide">
                  {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-zinc-900/30 border border-zinc-850 relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-16 w-16 bg-green-500/10 rounded-bl-3xl flex items-center justify-center font-bold text-green-400 text-xs">Active</div>
              <h3 className="text-[#A1A1AA] text-xs font-bold uppercase tracking-wider">Exchange Bonus</h3>
              <p className="text-2xl font-black text-white mt-2 font-display">Up to ₹50,000</p>
              <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">Upgrade your existing hatchback or SUV. Evaluated at your doorstep.</p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900/30 border border-zinc-850 relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-16 w-16 bg-green-500/10 rounded-bl-3xl flex items-center justify-center font-bold text-green-400 text-xs">Active</div>
              <h3 className="text-[#A1A1AA] text-xs font-bold uppercase tracking-wider">Hybrid Benefits</h3>
              <p className="text-2xl font-black text-white mt-2 font-display">Up to ₹1.50 Lakh</p>
              <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">Specialized subsidy packages on Strong Hybrid variants of Hyryder & Hycross.</p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900/30 border border-zinc-850 relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-16 w-16 bg-green-500/10 rounded-bl-3xl flex items-center justify-center font-bold text-green-400 text-xs">Active</div>
              <h3 className="text-[#A1A1AA] text-xs font-bold uppercase tracking-wider">Corporate discount</h3>
              <p className="text-2xl font-black text-white mt-2 font-display">Corporate Schemes</p>
              <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">Special price lists for government officials, corporate employees, and doctors.</p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900/30 border border-zinc-850 relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-16 w-16 bg-green-500/10 rounded-bl-3xl flex items-center justify-center font-bold text-green-400 text-xs">Active</div>
              <h3 className="text-[#A1A1AA] text-xs font-bold uppercase tracking-wider">Financing rates</h3>
              <p className="text-2xl font-black text-white mt-2 font-display">7.99% Interest</p>
              <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">Special online applicant interest rates from state and private banks.</p>
            </div>
          </div>
        </section>

        {/* Section 7 — Customer Testimonials Carousel */}
        <section className="space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3.5 py-1.5 rounded-full">Google Reviews & Stories</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display pt-2">What Our Customers Say</h2>
            <p className="text-sm text-zinc-400">Real verified feedback from Toyota buyers across South Odisha locations.</p>
          </div>

          <div className="bg-zinc-900/25 border border-zinc-850 p-6 sm:p-12 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto relative">
            <div className="space-y-6">
              <div className="flex gap-1 text-[#F59E0B]">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[#F59E0B]" />
                ))}
              </div>
              
              <blockquote className="text-base sm:text-lg font-medium text-white italic leading-relaxed">
                "{testimonials[activeTestimonial].review}"
              </blockquote>

              <div>
                <p className="text-sm font-bold text-white">{testimonials[activeTestimonial].name}</p>
                <p className="text-xs text-zinc-500">{testimonials[activeTestimonial].vehicle} • {testimonials[activeTestimonial].location} Branch</p>
              </div>

              {/* Slider Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${activeTestimonial === idx ? "w-6 bg-[#EB0A1E]" : "w-2 bg-zinc-700"}`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Testimonial Photo Column */}
            <div className="relative rounded-2xl overflow-hidden h-[240px] md:h-[300px] border border-zinc-800">
              <img
                src={testimonials[activeTestimonial].deliveryImage}
                alt="Toyota Handover Delivery"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 to-transparent flex items-end p-4">
                <div className="text-[10px] font-bold tracking-widest text-[#F59E0B] uppercase bg-amber-500/10 px-2 py-1 rounded backdrop-blur-sm">
                  Verified Delivery
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8 — South Odisha Branch Coverage */}
        <section className="space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3.5 py-1.5 rounded-full">Odisha Dealership Network</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display pt-2">Serving Toyota Customers Across South Odisha</h2>
            <p className="text-sm text-zinc-400">Choose from any of our 8 fully-equipped branch offices during variant checkout.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BRANCH_LOCATIONS.map((loc, i) => (
              <div key={i} className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-900 flex flex-col justify-between hover:border-zinc-850 transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-bold text-white">{loc.name}</h3>
                    <Map className="h-4 w-4 text-[#EB0A1E]/80" />
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">{loc.address}</p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-zinc-850/80 space-y-3">
                  <a href={`tel:${loc.phone.replace(/\s+/g, '')}`} className="flex items-center gap-2 text-xs text-zinc-300 hover:text-[#EB0A1E] font-medium transition-colors">
                    <Phone className="h-3.5 w-3.5 text-[#EB0A1E]/70" />
                    <span>{loc.phone}</span>
                  </a>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=Laxmi+Toyota+${loc.name}+Odisha`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 text-center text-[10px] uppercase font-bold tracking-wider py-2 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white rounded-lg transition-all duration-200"
                  >
                    <span>Google Maps Directions</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 9 — FAQ Section Accordion */}
        <section className="space-y-12 max-w-4xl mx-auto">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3.5 py-1.5 rounded-full">Help Desk & Support</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display pt-2">Frequently Asked Questions</h2>
            <p className="text-sm text-zinc-400">Everything you need to know about the Laxmi Toyota digital ordering portal.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded-2xl border border-zinc-900 bg-zinc-900/20 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex justify-between items-center gap-4 text-white hover:text-[#EB0A1E] transition-colors"
                  >
                    <span className="font-semibold text-sm sm:text-base">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-zinc-500 shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-zinc-500 shrink-0" />
                    )}
                  </button>

                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-[200px] border-t border-zinc-850 p-6 bg-zinc-950/45" : "max-h-0"
                    }`}
                  >
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 10 — Refund Policy Summary */}
        <section className="p-8 sm:p-10 rounded-3xl bg-[#EB0A1E]/5 border border-[#EB0A1E]/20 max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3 text-[#EB0A1E]">
            <ShieldCheck className="h-6 w-6 shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">100% Refundable Secure Reservation Policy</h2>
          </div>
          
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
            We value your peace of mind. Prior to vehicle invoicing or final dealer allotment matching, you are fully entitled to request booking cancellations. All online deposits are returned to your source account within 5-7 working days. Variant options (MT to AT) and color choices can also be updated post-booking without penalty fees.
          </p>

          <div className="pt-2">
            <Link 
              href="/checkout"
              className="text-xs font-semibold text-[#EB0A1E] hover:underline flex items-center gap-1.5"
            >
              <span>Read Full Refund & Booking Terms</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        {/* Section 12 — Final Conversion CTA */}
        <section className="relative rounded-3xl overflow-hidden border border-zinc-900 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-8 sm:p-16 text-center space-y-8 max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-[radial-gradient(#EB0A1E_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
          
          <div className="space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">Ready to Reserve Your Toyota?</h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed font-light">
              Book online today and secure your preferred variant and color allocation. Instant allocation queue placement.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 pt-2">
            <a
              href="#lineup"
              className="w-full sm:w-auto text-center rounded-full bg-[#EB0A1E] px-8 py-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 active:scale-[0.98] transition-all duration-300 shadow-xl shadow-[#EB0A1E]/20"
            >
              Book Online Now
            </a>
            <a
              href="#lineup"
              className="w-full sm:w-auto text-center rounded-full border border-zinc-800 bg-zinc-900/40 px-8 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:bg-zinc-850 hover:text-white transition-all duration-300"
            >
              Explore Fleet
            </a>
            <a
              href="tel:+919437000001"
              className="w-full sm:w-auto text-center rounded-full border border-zinc-800 bg-zinc-900/40 px-8 py-4 text-xs font-semibold uppercase tracking-wider text-[#F59E0B] hover:bg-zinc-850 transition-all duration-300"
            >
              Speak With Advisor
            </a>
          </div>
        </section>

      </div>

      {/* Section 11 — Sticky Mobile CTA Bar (Fixed Bottom on Mobile Viewports) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-zinc-950/95 border-t border-zinc-900 py-3.5 px-4 backdrop-blur-md z-50 flex items-center justify-between shadow-2xl">
        <div className="text-left">
          <span className="text-[9px] text-zinc-500 font-bold block uppercase tracking-wider">Bookings From</span>
          <span className="text-sm font-extrabold text-[#F59E0B] font-mono">₹11,000</span>
        </div>
        
        <div className="flex gap-2">
          <a
            href="tel:+919437000001"
            className="h-10 w-10 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-full flex items-center justify-center hover:bg-zinc-800 hover:text-white transition-colors"
            title="Call Advisor"
            aria-label="Call Sales Advisor"
          >
            <Phone className="h-4 w-4" />
          </a>
          <a
            href="https://wa.me/919437000001?text=Hi%2C%20I%20am%20interested%20in%20booking%20a%20Toyota%20online."
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full flex items-center justify-center hover:bg-green-500/20 transition-colors"
            title="WhatsApp Support"
            aria-label="WhatsApp Advisor"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
          <a
            href="#lineup"
            className="h-10 px-5 bg-[#EB0A1E] text-white text-xs font-bold uppercase tracking-wider rounded-full flex items-center justify-center hover:bg-red-700 transition-colors active:scale-[0.98]"
          >
            Book Now
          </a>
        </div>
      </div>

    </div>
  );
}
