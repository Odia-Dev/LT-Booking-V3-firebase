"use client";

import { useAuth } from "@/context/AuthContext";
import VehicleCard from "@/components/VehicleCard";

const VEHICLE_LINEUP = [
  {
    id: "glanza",
    name: "Toyota Glanza",
    type: "Hatchback",
    startingPrice: "₹6.46 Lakh",
    bookingAmount: 11000,
    imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "hyryder",
    name: "Urban Cruiser Hyryder",
    type: "SUV",
    startingPrice: "₹10.99 Lakh",
    bookingAmount: 21000,
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "hycross",
    name: "Innova Hycross",
    type: "MPV",
    startingPrice: "₹18.70 Lakh",
    bookingAmount: 51000,
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "fortuner",
    name: "Toyota Fortuner",
    type: "SUV",
    startingPrice: "₹34.76 Lakh",
    bookingAmount: 100000,
    imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "landcruiser",
    name: "Land Cruiser 300",
    type: "Luxury SUV",
    startingPrice: "₹2.18 Crore",
    bookingAmount: 2000000,
    imageUrl: "https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?auto=format&fit=crop&q=80&w=600",
  },
];

export default function Home() {
  const { user, loading, signingIn, loginWithGoogle, isConfigured } = useAuth();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col bg-zinc-950 px-4 py-16 overflow-hidden">
      {/* Background radial gradients for ambient lighting */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-25 pointer-events-none">
        <div className="w-[800px] h-[800px] rounded-full bg-red-600/10 blur-[150px] translate-y-[-300px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-20">
        
        {/* Task 1: Premium Hero Section */}
        <section className="text-center space-y-8 max-w-4xl mx-auto pt-6">
          {!isConfigured && (
            <div className="mx-auto max-w-md rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-200 backdrop-blur-sm">
              <span className="font-semibold">⚠️ local dev mode:</span> running with local mock auth. Click login to simulate.
            </div>
          )}

          <div className="inline-flex items-center space-x-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-1.5 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold text-zinc-300 tracking-wide uppercase">
              Laxmi Toyota Digital Dealership
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent leading-none">
            THE UNCONTESTED LEADER
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-light">
            Welcome to the future of automotive selection. Explore performance, hybrid precision, and unmatched styling from our digital showroom. Reserve your vehicle online.
          </p>

          {!loading && !user && (
            <div className="pt-4">
              <button
                onClick={loginWithGoogle}
                disabled={signingIn}
                className="rounded-full bg-gradient-to-r from-red-600 to-red-500 px-8 py-3 text-sm font-semibold text-white shadow-xl shadow-red-950/20 hover:from-red-500 hover:to-red-400 hover:scale-[1.02] active:scale-[1] disabled:opacity-50 transition-all duration-200"
              >
                {signingIn ? "Signing In..." : "Sign In with Google to Book"}
              </button>
            </div>
          )}
        </section>

        {/* Task 2: Featured grid catalog */}
        <section id="lineup" className="space-y-8 pt-8">
          <div className="border-b border-zinc-800/85 pb-4">
            <h2 className="text-2xl font-bold tracking-tight text-white">Featured Fleet</h2>
            <p className="text-xs text-zinc-500 mt-1">Select a model below to secure allocation and place reservation deposit.</p>
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
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
