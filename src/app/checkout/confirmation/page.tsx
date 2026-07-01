"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Valued Customer";
  const branch = searchParams.get("branch") || "Selected Branch";
  const [bookingRef, setBookingRef] = React.useState("");

  React.useEffect(() => {
    setBookingRef(`LT-${Math.floor(100000 + Math.random() * 900000)}`);
  }, []);

  return (
    <div className="max-w-md w-full border border-zinc-800/80 bg-zinc-900/40 p-8 rounded-2xl text-center space-y-6 backdrop-blur-md">
      <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-400 text-3xl font-bold border border-emerald-500/20">
        ✓
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-white">Reservation Confirmed</h2>
        <p className="text-xs text-zinc-500">Booking Reference: <span className="font-mono text-white font-bold">{bookingRef || "Generating..."}</span></p>
      </div>

      <div className="text-zinc-300 text-sm space-y-4 border-y border-zinc-800/60 py-4 text-left">
        <p>
          Thank you, <span className="font-semibold text-white">{name}</span>. Your priority reservation has been securely logged.
        </p>
        <p className="text-xs text-zinc-400">
          An executive from the <span className="font-semibold text-white">{branch} Dealership</span> will contact you shortly on your registered mobile number to confirm delivery scheduling.
        </p>
      </div>

      <div className="pt-2">
        <Link
          href="/"
          className="block w-full text-center text-xs font-bold uppercase tracking-wider bg-white text-zinc-950 py-3 rounded-full hover:bg-zinc-200 transition-all"
        >
          Return to Lineup
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-zinc-950 px-4">
      <Suspense fallback={
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-red-500" />
      }>
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
