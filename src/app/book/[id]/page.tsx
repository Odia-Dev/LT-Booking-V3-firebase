"use client";

import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, CheckCircle } from "lucide-react";

const VEHICLE_DATA: Record<
  string,
  { name: string; price: string; bookingAmount: number; type: string; imageUrl: string }
> = {
  glanza: {
    name: "Toyota Glanza",
    price: "₹6.86 Lakh",
    bookingAmount: 11000,
    type: "Hatchback",
    imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600",
  },
  taisor: {
    name: "Toyota Taisor",
    price: "₹7.74 Lakh",
    bookingAmount: 11000,
    type: "Compact SUV",
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600",
  },
  rumion: {
    name: "Toyota Rumion",
    price: "₹10.44 Lakh",
    bookingAmount: 21000,
    type: "MPV",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600",
  },
  hyryder: {
    name: "Urban Cruiser Hyryder",
    price: "₹11.14 Lakh",
    bookingAmount: 21000,
    type: "SUV",
    imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800",
  },
  fortuner: {
    name: "Toyota Fortuner",
    price: "₹33.43 Lakh",
    bookingAmount: 100000,
    type: "SUV",
    imageUrl: "https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?auto=format&fit=crop&q=80&w=600",
  },
  hycross: {
    name: "Innova Hycross",
    price: "₹19.77 Lakh",
    bookingAmount: 50000,
    type: "MPV",
    imageUrl: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200",
  },
  landcruiser: {
    name: "Land Cruiser 300",
    price: "₹2.18 Crore",
    bookingAmount: 2000000,
    type: "Luxury SUV",
    imageUrl: "https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?auto=format&fit=crop&q=80&w=600",
  },
  camry: {
    name: "Toyota Camry",
    price: "₹46.17 Lakh",
    bookingAmount: 100000,
    type: "Luxury Sedan",
    imageUrl: "https://images.unsplash.com/photo-1503376710915-18861d9a2638?auto=format&fit=crop&q=80&w=600",
  },
  hilux: {
    name: "Toyota Hilux",
    price: "₹30.40 Lakh",
    bookingAmount: 100000,
    type: "Lifestyle Utility",
    imageUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=600",
  },
};

const VARIANT_LOOKUP: Record<string, string> = {
  'e-mt': 'E MT (Petrol)',
  's-mt': 'S MT (Petrol)',
  'g-hybrid': 'G Hybrid (e-CVT)',
  'v-hybrid': 'V Hybrid (e-CVT)',
  'gx-7str': 'GX 7STR (Petrol)',
  'vx-hybrid': 'VX Hybrid 7STR',
  'zx-o-hybrid': 'ZX(O) Hybrid 7STR',
};

const COLOR_LOOKUP: Record<string, string> = {
  'cafe-white': 'Cafe White',
  'speedy-blue': 'Speedy Blue',
  'sportin-red': 'Sportin Red',
  'midnight-black': 'Midnight Black',
  'platinum-white': 'Platinum White Pearl',
  'attitude-black': 'Attitude Black Mica',
  'ageha-glass': 'Blackish Ageha Glass Flake',
};

function BookContent() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, loginWithGoogle, isConfigured } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [branch, setBranch] = useState("Berhampur");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  const vehicle = VEHICLE_DATA[id];
  const variantParam = searchParams ? searchParams.get("variant") : null;
  const colorParam = searchParams ? searchParams.get("color") : null;

  const selectedVariantName = variantParam ? (VARIANT_LOOKUP[variantParam] || variantParam) : null;
  const selectedColorName = colorParam ? (COLOR_LOOKUP[colorParam] || colorParam) : null;

  useEffect(() => {
    if (user) {
      setFullName(user.displayName || "");
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-red-500" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-zinc-950 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Vehicle Not Found</h2>
        <p className="text-zinc-400">The vehicle you are looking for does not exist in our fleet.</p>
        <Link href="/" className="text-red-500 hover:underline flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Return to Showroom
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-zinc-950 px-4">
        <div className="max-w-md w-full border border-zinc-800/80 bg-zinc-900/40 p-8 rounded-2xl text-center space-y-6 backdrop-blur-md">
          <div className="h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Authentication Required</h2>
          <p className="text-zinc-400 text-sm">Please sign in with your Google account to explore checkout options and secure allocations.</p>
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

  // Firestore Utility function
  const addBooking = async (bookingData: any) => {
    console.log("DEBUG [addBooking]: isConfigured =", isConfigured, "db =", db);
    if (isConfigured) {
      return await addDoc(collection(db, "bookings"), bookingData);
    } else {
      // Local storage fallback for developer preview
      const existingRaw = localStorage.getItem("laxmi_toyota_bookings");
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const newBooking = { id: `booking-${Date.now()}`, ...bookingData };
      existing.push(newBooking);
      localStorage.setItem("laxmi_toyota_bookings", JSON.stringify(existing));
      return newBooking;
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleProceed = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanedPhone = phone.trim();
    if (!/^\d{10}$/.test(cleanedPhone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    setIsProcessing(true);

    const generatedRef = `LT-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRef(generatedRef);

    const bookingData = {
      bookingRef: generatedRef,
      userUid: user.uid,
      customerEmail: user.email,
      customerName: fullName,
      customerPhone: cleanedPhone,
      branch: branch,
      vehicleId: id,
      vehicleName: vehicle.name,
      vehicleType: vehicle.type,
      bookingAmount: `₹${vehicle.bookingAmount.toLocaleString("en-IN")}`,
      price: vehicle.price,
      selectedVariant: selectedVariantName || "Default",
      selectedColor: selectedColorName || "Default",
      status: "Pending Payment",
      createdAt: new Date().toISOString(),
    };

    try {
      // 1. Save initial booking document
      const savedBooking = await addBooking(bookingData);
      const bookingId = savedBooking.id;

      // 2. Call local API endpoint to initialize Razorpay Order
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, amount: vehicle.bookingAmount }),
      });
      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.error || "Failed to create payment order");
      }

      // 3. Fallback for mock environment checkout
      if (orderData.mock) {
        console.log("Mock Payment Mode active. Auto-capturing payment.");
        if (!isConfigured) {
          const existingRaw = localStorage.getItem("laxmi_toyota_bookings");
          if (existingRaw) {
            const existing = JSON.parse(existingRaw);
            const index = existing.findIndex((b: any) => b.id === bookingId);
            if (index !== -1) {
              existing[index].status = "Paid";
              localStorage.setItem("laxmi_toyota_bookings", JSON.stringify(existing));
            }
          }
        } else {
          // If Firestore is connected, update the document status to Paid
          const { doc, updateDoc } = await import("firebase/firestore");
          await updateDoc(doc(db, "bookings", bookingId), {
            status: "Paid",
          });
        }
        setSuccess(true);
        return;
      }

      // 4. Inject Razorpay JS script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load. Please verify your internet connection.");
      }

      // 5. Open checkout payment dialog modal
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Laxmi Toyota",
        description: `Booking deposit for ${vehicle.name}`,
        order_id: orderData.id,
        handler: async function (paymentResponse: any) {
          console.log("Razorpay Payment Success Callback:", paymentResponse);
          try {
            if (isConfigured) {
              const { doc, updateDoc } = await import("firebase/firestore");
              await updateDoc(doc(db, "bookings", bookingId), {
                status: "Paid",
                razorpayPaymentId: paymentResponse.razorpay_payment_id,
                razorpaySignature: paymentResponse.razorpay_signature,
              });
            } else {
              const existingRaw = localStorage.getItem("laxmi_toyota_bookings");
              if (existingRaw) {
                const existing = JSON.parse(existingRaw);
                const index = existing.findIndex((b: any) => b.id === bookingId);
                if (index !== -1) {
                  existing[index].status = "Paid";
                  existing[index].razorpayPaymentId = paymentResponse.razorpay_payment_id;
                  localStorage.setItem("laxmi_toyota_bookings", JSON.stringify(existing));
                }
              }
            }
          } catch (updateErr) {
            console.error("Error updating status to Paid:", updateErr);
          }
          setSuccess(true);
        },
        prefill: {
          name: fullName,
          email: user.email,
          contact: phone,
        },
        notes: {
          bookingId: bookingId,
        },
        theme: {
          color: "#ef4444",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        console.error("Razorpay Payment Failed:", response.error);
        setError(`Payment Failed: ${response.error.description}`);
      });
      paymentObject.open();

    } catch (err: any) {
      console.error("Checkout submission error:", err);
      setError(err.message || "Failed to process booking reservation. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Format booking amount currency
  const formattedBooking = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(vehicle.bookingAmount);

  if (success) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-zinc-950 px-4 animate-fade-in">
        <div className="max-w-md w-full border border-zinc-800/80 bg-zinc-900/40 p-8 rounded-2xl text-center space-y-6 backdrop-blur-md">
          <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white">Reservation Confirmed</h2>
            <p className="text-xs text-zinc-500">Booking Reference: <span className="font-mono text-white font-bold">{bookingRef}</span></p>
            <p className="text-xs text-zinc-500">Status: <span className="text-emerald-400 font-semibold">Paid</span></p>
          </div>
          <div className="text-zinc-300 text-sm space-y-4 border-y border-zinc-800/60 py-4 text-left">
            <p>
              Thank you, <span className="font-semibold text-white">{fullName}</span>. Your priority reservation has been securely logged.
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              An executive from the <span className="font-semibold text-white">{branch} Dealership</span> will contact you shortly on your registered mobile number to confirm delivery scheduling.
            </p>
            {(selectedVariantName || selectedColorName) && (
              <div className="bg-zinc-950/40 border border-zinc-800/40 rounded-xl p-3 text-xs space-y-1.5 text-zinc-400 mt-2">
                {selectedVariantName && (
                  <div className="flex justify-between">
                    <span>Variant</span>
                    <span className="text-white font-semibold">{selectedVariantName}</span>
                  </div>
                )}
                {selectedColorName && (
                  <div className="flex justify-between">
                    <span>Color</span>
                    <span className="text-white font-semibold">{selectedColorName}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="pt-2 space-y-3">
            <Link
              href="/dashboard"
              className="block w-full text-center text-xs font-bold uppercase tracking-wider bg-white text-zinc-950 py-3 rounded-full hover:bg-zinc-200 transition-all"
            >
              Go to My Bookings
            </Link>
            <Link
              href="/"
              className="block w-full text-center text-xs font-bold uppercase tracking-wider border border-zinc-800 text-zinc-400 py-3 rounded-full hover:bg-zinc-900 transition-all"
            >
              Return to Showroom
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 px-4 py-12">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Order Summary Card */}
        <section className="space-y-6">
          <div className="border-b border-zinc-800/80 pb-4">
            <Link href="/" className="text-zinc-500 hover:text-white text-xs flex items-center gap-1 mb-2 transition-colors">
              &larr; Back to Showroom
            </Link>
            <h1 className="text-3xl font-extrabold text-white">Booking Allocation</h1>
            <p className="text-zinc-500 text-xs mt-1">Verify your allocation parameters and lock down priority ranks.</p>
          </div>

          <div className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/20 overflow-hidden flex flex-col justify-between">
            <div className="w-full h-44 overflow-hidden relative bg-zinc-950">
              <img
                src={vehicle.imageUrl}
                alt={vehicle.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-red-500">{vehicle.type}</span>
                <h3 className="text-2xl font-bold text-white mt-1">{vehicle.name}</h3>
              </div>

              <div className="space-y-3 text-sm border-t border-zinc-800/60 pt-4">
                {selectedVariantName && (
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Selected Variant</span>
                    <span className="font-bold text-white">{selectedVariantName}</span>
                  </div>
                )}
                {selectedColorName && (
                  <div className="flex justify-between text-xs border-t border-zinc-800/10 pt-2">
                    <span className="text-zinc-500">Selected Color</span>
                    <span className="font-bold text-white">{selectedColorName}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-zinc-800/20 pt-3">
                  <span className="text-zinc-500">Ex-Showroom Price</span>
                  <span className="font-semibold text-white">{vehicle.price}</span>
                </div>
                <div className="flex justify-between border-t border-zinc-800/20 pt-3">
                  <span className="text-zinc-500">Booking Amount (Refundable)</span>
                  <span className="font-extrabold text-red-400">{formattedBooking}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fintech-style checkout form */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-sm self-start space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">Complete Booking</h2>
            <p className="text-zinc-500 text-xs mt-1">Please provide dealer verification details.</p>
          </div>

          <form onSubmit={handleProceed} className="space-y-5">
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
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
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
                placeholder="10-digit mobile number"
                maxLength={10}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="branch" className="block text-xs font-bold text-zinc-400 uppercase">
                Select Dealership Branch
              </label>
              <select
                id="branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              >
                <option value="Berhampur">Berhampur Branch</option>
                <option value="Jeypore">Jeypore Branch</option>
                <option value="Bargarh">Bargarh Branch</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full rounded-full bg-gradient-to-r from-red-600 to-red-500 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-xl hover:from-red-500 hover:to-red-400 disabled:opacity-50 transition-all"
            >
              {isProcessing ? "Processing Allocation..." : "Proceed to Payment"}
            </button>

            <p className="text-[10px] text-zinc-500 text-center leading-relaxed">
              By proceeding, you authorize booking entries into the 'bookings' collection. Deposits are fully refundable prior to invoicing.
            </p>
          </form>
        </section>

      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-red-500" />
      </div>
    }>
      <BookContent />
    </Suspense>
  );
}
