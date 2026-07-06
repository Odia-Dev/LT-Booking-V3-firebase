"use client";

import Link from "next/link";
import { Fuel, Gauge, Users, Cpu, ArrowRight } from "lucide-react";

interface VehicleCardProps {
  id: string;
  name: string;
  startingPrice: string;
  bookingAmount: number;
  imageUrl: string;
  type: string;
  fuelType: string;
  mileage: string;
  seating: string;
  transmission: string;
}

export default function VehicleCard({
  id,
  name,
  startingPrice,
  bookingAmount,
  imageUrl,
  type,
  fuelType,
  mileage,
  seating,
  transmission,
}: VehicleCardProps) {
  const formattedBooking = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(bookingAmount);

  return (
    <div className="group relative rounded-3xl border border-zinc-800/80 bg-zinc-900/30 overflow-hidden flex flex-col justify-between hover:border-[#EB0A1E]/40 hover:shadow-2xl hover:shadow-[#EB0A1E]/5 transition-all duration-500 hover:-translate-y-1">
      <div>
        {/* Image Container with Hover Scale */}
        <div className="w-full h-56 overflow-hidden relative bg-zinc-950">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent" />
          <span className="absolute top-4 left-4 bg-[#EB0A1E] text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-lg">
            {type}
          </span>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-5">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-[#EB0A1E] transition-colors duration-300">
              {name}
            </h3>
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 font-semibold uppercase block tracking-wider">From</span>
              <span className="text-base font-extrabold text-white">{startingPrice}</span>
            </div>
          </div>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs border-t border-zinc-800/80 pt-4 pb-1">
            <div className="flex items-center gap-2 text-zinc-400">
              <Fuel className="h-4 w-4 text-[#EB0A1E]/80 shrink-0" />
              <span>{fuelType}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <Gauge className="h-4 w-4 text-[#EB0A1E]/80 shrink-0" />
              <span>{mileage}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <Users className="h-4 w-4 text-[#EB0A1E]/80 shrink-0" />
              <span>{seating} Seats</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <Cpu className="h-4 w-4 text-[#EB0A1E]/80 shrink-0" />
              <span>{transmission}</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs border-t border-zinc-800/80 pt-4">
            <span className="text-zinc-500 font-medium">Reservation Deposit</span>
            <span className="font-bold text-[#F59E0B] font-mono text-sm">
              {formattedBooking}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 pt-0 grid grid-cols-2 gap-3">
        <Link
          href={`/book/${id}`}
          className="text-center text-xs font-semibold uppercase tracking-wider border border-zinc-700 text-zinc-300 py-3 rounded-full hover:bg-zinc-800 hover:text-white hover:border-zinc-500 active:scale-[0.98] transition-all duration-300"
        >
          View Details
        </Link>
        <Link
          href={`/book/${id}`}
          className="text-center text-xs font-bold uppercase tracking-wider bg-[#EB0A1E] text-white py-3 rounded-full hover:bg-red-700 shadow-lg shadow-red-950/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-1.5"
        >
          Book Now
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
