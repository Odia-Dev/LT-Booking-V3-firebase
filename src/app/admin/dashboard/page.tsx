"use client";

import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { 
  TrendingUp, 
  DollarSign, 
  MapPin, 
  Search, 
  Car, 
  Calendar, 
  User as UserIcon,
  Phone,
  ShieldCheck
} from "lucide-react";

interface Booking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleType: string;
  bookingAmount: string;
  price: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  branch: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { user, loading, loginWithGoogle, isConfigured } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user) {
      setFetching(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        if (isConfigured) {
          const querySnapshot = await getDocs(collection(db, "bookings"));
          const list: Booking[] = [];
          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as Booking);
          });
          // Sort by date descending
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setBookings(list);
        } else {
          const existingRaw = localStorage.getItem("laxmi_toyota_bookings");
          const list: Booking[] = existingRaw ? JSON.parse(existingRaw) : [];
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setBookings(list);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchBookings();
  }, [user, isConfigured]);

  if (loading || (user && fetching)) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-red-500" />
      </div>
    );
  }

  // Protection Gate
  if (!user) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-zinc-950 px-4">
        <div className="max-w-md w-full border border-zinc-800/80 bg-zinc-900/40 p-8 rounded-2xl text-center space-y-6 backdrop-blur-md">
          <div className="h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Admin Authentication Required</h2>
          <p className="text-zinc-400 text-sm">Please sign in with your authorized credentials to view the dealership bookings dashboard.</p>
          <button
            onClick={loginWithGoogle}
            className="w-full rounded-full bg-gradient-to-r from-red-600 to-red-500 py-3 text-sm font-semibold text-white shadow-xl hover:from-red-500 hover:to-red-400 transition-all duration-200"
          >
            Sign In to Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  // KPI Calculations
  const totalBookings = bookings.length;
  
  const totalRevenue = bookings.reduce((sum, item) => {
    // Parse currency values e.g. "₹51,000" to number
    const numericStr = item.bookingAmount.replace(/[₹,]/g, "");
    const amt = parseFloat(numericStr) || 0;
    return sum + amt;
  }, 0);

  // Format revenue as Indian Rupees
  const formattedRevenue = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(totalRevenue);

  // Calculate top branch
  const branchCounts = bookings.reduce((acc, item) => {
    acc[item.branch] = (acc[item.branch] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  let topBranch = "N/A";
  let maxCount = 0;
  Object.entries(branchCounts).forEach(([br, cnt]) => {
    if (cnt > maxCount) {
      maxCount = cnt;
      topBranch = br;
    }
  });

  // Filter Bookings
  const filteredBookings = bookings.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.customerName.toLowerCase().includes(q) ||
      item.vehicleName.toLowerCase().includes(q) ||
      item.branch.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-zinc-950 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-800/80 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Dealership Bookings</h1>
            <p className="text-zinc-500 text-xs mt-1">Real-time tracking of allocations, customer reservations, and branch loads.</p>
          </div>
          {!isConfigured && (
            <span className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] px-3 py-1 rounded-full font-semibold uppercase">
              Mock Database View
            </span>
          )}
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1: Total Bookings */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 flex items-center justify-between backdrop-blur-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Total Bookings</span>
              <p className="text-3xl font-extrabold text-white">{totalBookings}</p>
            </div>
            <div className="h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>

          {/* Card 2: Total Revenue */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 flex items-center justify-between backdrop-blur-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Total Revenue</span>
              <p className="text-3xl font-extrabold text-white">{formattedRevenue}</p>
            </div>
            <div className="h-12 w-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>

          {/* Card 3: Top Branch */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 flex items-center justify-between backdrop-blur-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Top Branch</span>
              <p className="text-3xl font-extrabold text-white">{topBranch}</p>
            </div>
            <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400">
              <MapPin className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Search and Table section */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/10 backdrop-blur-sm overflow-hidden">
          
          {/* Search bar */}
          <div className="p-6 border-b border-zinc-800/80 flex items-center bg-zinc-900/20">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer, vehicle, or branch..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>

          {/* Searchable Data Table */}
          <div className="overflow-x-auto">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-16 text-zinc-500 text-sm">
                No reservation bookings found matching the query.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800/80 bg-zinc-900/30 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Customer</th>
                    <th className="py-4 px-6">Vehicle</th>
                    <th className="py-4 px-6">Branch</th>
                    <th className="py-4 px-6">Deposit</th>
                    <th className="py-4 px-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-zinc-300 divide-y divide-zinc-800/40">
                  {filteredBookings.map((bk) => (
                    <tr key={bk.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-zinc-600" />
                          {new Date(bk.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <UserIcon className="h-3.5 w-3.5 text-zinc-600" />
                            {bk.customerName}
                          </div>
                          <div className="text-xs text-zinc-500 flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-zinc-700" />
                            {bk.customerPhone}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-red-500" />
                          <div>
                            <span className="font-semibold text-white block">{bk.vehicleName}</span>
                            <span className="text-[10px] text-zinc-500 block uppercase tracking-wider">{bk.vehicleType}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium text-white">{bk.branch}</td>
                      <td className="py-4 px-6 font-semibold text-emerald-400">{bk.bookingAmount}</td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center text-xs font-semibold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 text-amber-400">
                          {bk.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
