"use client";

import Link from "next/link";

interface VehicleCardProps {
  id: string;
  name: string;
  startingPrice: string;
  bookingAmount: number;
  imageUrl: string;
  type: string;
}

export default function VehicleCard({
  id,
  name,
  startingPrice,
  bookingAmount,
  imageUrl,
  type,
}: VehicleCardProps) {
  // Format booking amount as Indian Currency for visual display
  const formattedBooking = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(bookingAmount);

  return (
    <div className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden flex flex-col justify-between hover:border-red-500/30 hover:shadow-xl hover:shadow-red-950/5 transition-all duration-300">
      <div>
        {/* Image Container with Hover Scale */}
        <div className="w-full h-48 overflow-hidden relative bg-zinc-950">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
          <span className="absolute top-4 left-4 bg-red-600/90 text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full backdrop-blur-sm">
            {type}
          </span>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-red-400 transition-colors">
              {name}
            </h3>
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 font-medium uppercase block">From</span>
              <span className="text-sm font-extrabold text-white">{startingPrice}</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs border-t border-zinc-800/80 pt-4">
            <span className="text-zinc-500">Booking Amount</span>
            <span className="font-semibold text-zinc-300 font-mono">
              {formattedBooking}
            </span>
          </div>
        </div>
      </div>

      {/* Book Now Button */}
      <div className="p-6 pt-0">
        <Link
          href={`/book/${id}`}
          className="block w-full text-center text-xs font-bold uppercase tracking-wider bg-white text-zinc-950 py-3 rounded-full hover:bg-zinc-200 active:scale-[0.98] transition-all"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
