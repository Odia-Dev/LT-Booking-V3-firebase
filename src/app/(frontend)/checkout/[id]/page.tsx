"use client";

import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import Link from "next/link";
import { BRANCHES } from "@/lib/data";

const VEHICLE_DATA: Record<string, { name: string; price: string; bookingAmount: string; type: string; gradient: string }> = {
  glanza: {
    name: "Toyota Glanza",
    price: "₹6.81 Lakh*",
    bookingAmount: "₹11,000",
    type: "Premium Hatchback",
    gradient: "from-blue-600 to-cyan-500",
  },
  hyryder: {
    name: "Urban Cruiser Hyryder",
    price: "₹11.14 Lakh*",
    bookingAmount: "₹21,000",
    type: "Premium Hybrid SUV",
    gradient: "from-emerald-600 to-teal-500",
  },
  hycross: {
    name: "Innova Hycross",
    price: "₹19.77 Lakh*",
    bookingAmount: "₹51,000",
    type: "Luxury Hybrid MPV",
    gradient: "from-purple-600 to-indigo-500",
  },
  fortuner: {
    name: "Toyota Fortuner",
    price: "₹35.93 Lakh*",
    bookingAmount: "₹1,00,000",
    type: "Premium SUV",
    gradient: "from-red-600 to-amber-500",
  },
};

export default function CheckoutPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user, loading, loginWithGoogle, isConfigured } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [branch, setBranch] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isOther, setIsOther] = useState(false);
  const [cityPincode, setCityPincode] = useState({ city: "", pincode: "" });

  const handleBranchChange = (value: string) => {
    setBranch(value);
    setIsOther(value === "other");
  };

  const vehicle = VEHICLE_DATA[id];

  useEffect(() => {
    if (user) {
      setFullName(user.displayName || "");
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-red-500" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-zinc-950 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Vehicle Not Found</h2>
        <p className="text-zinc-400">The vehicle you are looking for does not exist in our lineup.</p>
        <Link href="/" className="text-red-500 hover:underline">Return Home</Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-zinc-950 px-4">
        <div className="max-w-md w-full border border-zinc-800/80 bg-zinc-900/40 p-8 rounded-2xl text-center space-y-6 backdrop-blur-md">
          <div className="h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500 text-xl font-bold">!</div>
          <h2 className="text-xl font-bold text-white">Authentication Required</h2>
          <p className="text-zinc-400 text-sm">You must be logged in to book a vehicle and secure your priority ranking.</p>
          <button
            onClick={loginWithGoogle}
            className="w-full rounded-full bg-gradient-to-r from-red-600 to-red-500 py-3 text-sm font-semibold text-white shadow-xl hover:from-red-500 hover:to-red-400 transition-all duration-200"
          >
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Phone Validation
    const cleanedPhone = phone.trim();
    if (!/^\d{10}$/.test(cleanedPhone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!branch) {
      setError("Please select a dealership branch.");
      return;
    }

    setSubmitting(true);

    const bookingData = {
      vehicleId: id,
      vehicleName: vehicle.name,
      vehicleType: vehicle.type,
      bookingAmount: vehicle.bookingAmount,
      price: vehicle.price,
      customerName: fullName,
      customerPhone: cleanedPhone,
      customerEmail: user.email,
      branch: branch === "other" ? "Other / Home Delivery" : branch,
      deliveryCity: branch === "other" ? cityPincode.city : "",
      deliveryPincode: branch === "other" ? cityPincode.pincode : "",
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    try {
      if (isConfigured) {
        // Write directly to Firestore
        await addDoc(collection(db, "bookings"), bookingData);
      } else {
        // Write mock data to localStorage
        const existingRaw = localStorage.getItem("laxmi_toyota_bookings");
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        existing.push({
          id: `booking-${Date.now()}`,
          ...bookingData,
        });
        localStorage.setItem("laxmi_toyota_bookings", JSON.stringify(existing));
      }

      // Route to confirmation screen
      router.push(`/checkout/confirmation?id=${id}&name=${encodeURIComponent(fullName)}&branch=${encodeURIComponent(branch)}`);
    } catch (err: any) {
      console.error("Booking Error:", err);
      setError("Failed to process booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 px-4 py-12">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Col: Vehicle specs card summary */}
        <div className="space-y-6">
          <div className="border-b border-zinc-800/80 pb-4">
            <Link href="/" className="text-zinc-500 hover:text-white text-xs flex items-center gap-1 mb-2 transition-colors">
              &larr; Back to Catalog
            </Link>
            <h1 className="text-3xl font-extrabold text-white">Booking Checkout</h1>
            <p className="text-zinc-500 text-xs mt-1">Review the details and complete your reservation booking.</p>
          </div>

          <div className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 flex flex-col justify-between overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${vehicle.gradient} rounded-t-2xl`} />
            
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-red-500">{vehicle.type}</span>
                <h3 className="text-2xl font-bold text-white mt-1">{vehicle.name}</h3>
              </div>

              <div className="w-full h-32 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/60 flex items-center justify-center relative">
                <div className={`absolute inset-0 bg-gradient-to-tr ${vehicle.gradient} opacity-5`} />
                <span className="text-[10px] text-zinc-600 uppercase font-mono tracking-widest">Digital Model Swatch</span>
              </div>

              <div className="space-y-3 text-sm border-t border-zinc-800/60 pt-4">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Ex-Showroom Price</span>
                  <span className="font-semibold text-white">{vehicle.price}</span>
                </div>
                <div className="flex justify-between border-t border-zinc-800/20 pt-3">
                  <span className="text-zinc-500">Booking Deposit</span>
                  <span className="font-bold text-red-400">{vehicle.bookingAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Capture details form */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-sm self-start">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-zinc-800/60 pb-3">Customer Details</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-xs font-bold text-zinc-400 uppercase">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-xs font-bold text-zinc-400 uppercase">
                Mobile Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="branch" className="block text-xs font-bold text-zinc-400 uppercase">
                Dealership Branch
              </label>
              <select
                id="branch"
                value={branch}
                onChange={(e) => handleBranchChange(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
              >
                <option value="">-- Choose Branch --</option>
                {Object.entries(BRANCHES).map(([key, b]) => (
                  <option key={key} value={b.name}>{b.name} Branch</option>
                ))}
                <option value="other">Other / Home Delivery</option>
              </select>
            </div>

            {isOther && (
              <div className="grid grid-cols-2 gap-4 mt-4 animate-in fade-in">
                <div className="space-y-1">
                  <input
                    placeholder="Your City"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                    onChange={(e) => setCityPincode({ ...cityPincode, city: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <input
                    placeholder="Pincode"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                    onChange={(e) => setCityPincode({ ...cityPincode, pincode: e.target.value })}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-gradient-to-r from-red-600 to-red-500 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-xl hover:from-red-500 hover:to-red-400 disabled:opacity-50 transition-all"
            >
              {submitting ? "Processing Reservation..." : `Authorize Deposit of ${vehicle.bookingAmount}`}
            </button>

            <p className="text-[10px] text-zinc-500 text-center leading-relaxed">
              By submitting, you agree to the dealership verification process. Booking deposits are fully refundable prior to invoice execution.
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}
