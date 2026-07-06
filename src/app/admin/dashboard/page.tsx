"use client";

import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
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
  ShieldCheck,
  CheckCircle,
  Loader2,
  Trash2,
  AlertCircle
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
  const { user, loading, loginWithGoogle, loginWithEmail, logout, isConfigured } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      await loginWithEmail(emailInput, passwordInput);
    } catch (err: any) {
      setAuthError(err?.message || "Invalid credentials. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this booking lead?")) {
      return;
    }
    
    setUpdatingId(bookingId);
    setErrorMessage(null);
    try {
      if (isConfigured) {
        const docRef = doc(db, "bookings", bookingId);
        await deleteDoc(docRef);
      } else {
        const existingRaw = localStorage.getItem("laxmi_toyota_bookings");
        const list: Booking[] = existingRaw ? JSON.parse(existingRaw) : [];
        const updatedList = list.filter((bk) => bk.id !== bookingId);
        localStorage.setItem("laxmi_toyota_bookings", JSON.stringify(updatedList));
      }
      
      // Update local state
      setBookings((prev) => prev.filter((bk) => bk.id !== bookingId));
      setSuccessMessage("Booking deleted successfully.");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (error: any) {
      console.error("Error deleting booking:", error);
      setErrorMessage(error?.message || "Failed to delete booking. Permission denied or database error.");
    } finally {
      setUpdatingId(null);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    setUpdatingId(bookingId);
    try {
      if (isConfigured) {
        const docRef = doc(db, "bookings", bookingId);
        await updateDoc(docRef, { status: newStatus });
      } else {
        const existingRaw = localStorage.getItem("laxmi_toyota_bookings");
        const list: Booking[] = existingRaw ? JSON.parse(existingRaw) : [];
        const updatedList = list.map((bk) =>
          bk.id === bookingId ? { ...bk, status: newStatus } : bk
        );
        localStorage.setItem("laxmi_toyota_bookings", JSON.stringify(updatedList));
      }
      
      // Update local state immediately
      setBookings((prev) =>
        prev.map((bk) => (bk.id === bookingId ? { ...bk, status: newStatus } : bk))
      );
      
      // Trigger success feedback
      setSuccessId(bookingId);
      setTimeout(() => {
        setSuccessId(null);
      }, 3000);
    } catch (error) {
      console.error("Error updating booking status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

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

  // Access Control check
  if (user && user.email !== "admin@laxmitoyota.co.in") {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-zinc-950 px-4">
        <div className="max-w-md w-full border border-red-500/20 bg-zinc-900/40 p-8 rounded-2xl text-center space-y-6 backdrop-blur-md">
          <div className="h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Access Denied</h2>
          <p className="text-zinc-400 text-sm">
            The account <strong className="text-white">{user.email}</strong> is not authorized to access the Admin Dashboard.
          </p>
          <button
            onClick={() => logout()}
            className="w-full rounded-full bg-zinc-800 hover:bg-zinc-700 py-3 text-sm font-semibold text-white transition-all duration-200"
          >
            Sign Out & Switch Account
          </button>
        </div>
      </div>
    );
  }

  // Protection Gate
  if (!user) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-zinc-950 px-4">
        <div className="max-w-md w-full border border-zinc-800/80 bg-zinc-900/40 p-8 rounded-2xl space-y-6 backdrop-blur-md">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Admin Authentication Required</h2>
            <p className="text-zinc-500 text-xs">Please sign in with your authorized admin email credentials to view bookings.</p>
          </div>
          
          <form onSubmit={handleEmailSubmit} className="space-y-4 text-left">
            {authError && (
              <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-center font-medium">
                {authError}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Email Address</label>
              <input
                type="email"
                required
                placeholder="admin@laxmitoyota.co.in"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-855 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
            
            <button
              type="submit"
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-500 py-3 text-sm font-semibold text-white shadow-xl hover:from-red-500 hover:to-red-400 disabled:opacity-50 transition-all duration-200"
            >
              {authLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                "Sign In to Admin Dashboard"
              )}
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink mx-4 text-[10px] text-zinc-600 uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          <button
            onClick={loginWithGoogle}
            className="w-full rounded-lg bg-zinc-900 border border-zinc-800 py-3 text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-850 transition-all duration-200"
          >
            Sign In with Google Account
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
          </d        {/* Error/Success Feedback Banners */}
        {(errorMessage || successMessage) && (
          <div className="space-y-4">
            {errorMessage && (
              <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <div className="flex-1 font-medium">{errorMessage}</div>
                <button 
                  onClick={() => setErrorMessage(null)} 
                  className="text-xs hover:underline uppercase font-bold text-red-500"
                >
                  Dismiss
                </button>
              </div>
            )}
            {successMessage && (
              <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm">
                <CheckCircle className="h-5 w-5 shrink-0" />
                <div className="flex-1 font-medium">{successMessage}</div>
                <button 
                  onClick={() => setSuccessMessage(null)} 
                  className="text-xs hover:underline uppercase font-bold text-emerald-500"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        )}

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
                    <th className="py-4 px-6 text-right">Actions</th>
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
                        <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          bk.status.toLowerCase() === "paid"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                        }`}>
                          {bk.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-mono">
                        <div className="flex justify-end items-center gap-3">
                          {successId === bk.id ? (
                            <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold animate-pulse">
                              <CheckCircle className="h-4 w-4" />
                              Success
                            </div>
                          ) : bk.status === "Pending Payment" ? (
                            <button
                              onClick={() => updateBookingStatus(bk.id, "Paid")}
                              disabled={updatingId === bk.id}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-805 disabled:opacity-50 text-xs font-semibold text-white px-3 py-1.5 border border-zinc-800 hover:border-zinc-700 transition-all duration-150"
                            >
                              {updatingId === bk.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-500" />
                              ) : (
                                <CheckCircle className="h-3.5 w-3.5 text-zinc-500 hover:text-emerald-400 transition-colors" />
                              )}
                              Mark as Paid
                            </button>
                          ) : null}

                          <button
                            onClick={() => handleDelete(bk.id)}
                            disabled={updatingId === bk.id}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-zinc-600 hover:text-red-500 hover:bg-red-500/10 disabled:opacity-50 transition-all duration-150"
                            title="Delete Lead"
                          >
                            {updatingId === bk.id ? (
                              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
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
