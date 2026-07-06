"use client";

import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import Link from "next/link";
import { 
  TrendingUp, 
  Clock, 
  MapPin, 
  Search, 
  Car, 
  Calendar, 
  User as UserIcon,
  Phone,
  ShieldCheck,
  RefreshCw,
  Trash2,
  Loader2,
  CheckCircle,
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

export default function DashboardPage() {
  const { user, loading, loginWithGoogle, isConfigured } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleMarkAsPaid = async (bookingId: string) => {
    setActionLoadingId(bookingId);
    setErrorMessage(null);
    try {
      if (isConfigured) {
        const docRef = doc(db, "bookings", bookingId);
        await updateDoc(docRef, { status: "Paid" });
      } else {
        const existingRaw = localStorage.getItem("laxmi_toyota_bookings");
        const list: Booking[] = existingRaw ? JSON.parse(existingRaw) : [];
        const updatedList = list.map((bk) =>
          bk.id === bookingId ? { ...bk, status: "Paid" } : bk
        );
        localStorage.setItem("laxmi_toyota_bookings", JSON.stringify(updatedList));
      }
      
      // Update local state
      setBookings((prev) =>
        prev.map((bk) => (bk.id === bookingId ? { ...bk, status: "Paid" } : bk))
      );
      setSuccessMessage("Booking marked as Paid successfully!");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (error: any) {
      console.error("Error marking booking as paid:", error);
      setErrorMessage(error?.message || "Failed to mark booking as paid. Permission denied or database error.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this booking lead?")) {
      return;
    }
    
    setActionLoadingId(bookingId);
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
      setActionLoadingId(null);
    }
  };

  const loadData = async () => {
    setFetching(true);
    try {
      if (isConfigured) {
        const querySnapshot = await getDocs(collection(db, "bookings"));
        const list: Booking[] = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Booking);
        });
        // Sort by date descending (newest first)
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBookings(list);
      } else {
        const existingRaw = localStorage.getItem("laxmi_toyota_bookings");
        const list: Booking[] = existingRaw ? JSON.parse(existingRaw) : [];
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBookings(list);
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setFetching(false);
    }
  }, [user, isConfigured]);

  if (loading || (user && fetching)) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-zinc-950 gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-800 border-t-red-500" />
        <span className="text-zinc-500 text-xs tracking-wider animate-pulse">Fetching Dealership Leads...</span>
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
          <h2 className="text-xl font-bold text-white">Dealership Authentication Required</h2>
          <p className="text-zinc-400 text-sm">Please sign in with your Google account to access CRM lead allocations.</p>
          <button
            onClick={loginWithGoogle}
            className="w-full rounded-full bg-gradient-to-r from-red-600 to-red-500 py-3 text-sm font-semibold text-white shadow-xl hover:from-red-500 hover:to-red-400 transition-all duration-200"
          >
            Sign In to Access CRM
          </button>
        </div>
      </div>
    );
  }

  // KPI Calculations
  const totalBookings = bookings.length;
  
  // Calculate Recent Leads (Last 7 Days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentLeads = bookings.filter((b) => new Date(b.createdAt) >= sevenDaysAgo).length;

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
      item.branch.toLowerCase().includes(q) ||
      item.customerPhone.includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-zinc-950 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-800/80 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Dealership CRM</h1>
            <p className="text-zinc-500 text-xs mt-1">Sleek leader allocation tracking. Firestore synchronization verified.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            {!isConfigured && (
              <span className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] px-3 py-1.5 rounded-full font-semibold uppercase tracking-wider">
                Demo Database fallbacks
              </span>
            )}
          </div>
        </div>

        {/* Task 4: KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1: Total Bookings */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-6 flex items-center justify-between backdrop-blur-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Total Bookings</span>
              <p className="text-3xl font-extrabold text-white">{totalBookings}</p>
            </div>
            <div className="h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 border border-red-500/10">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>

          {/* Card 2: Recent Leads (Last 7 Days) */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-6 flex items-center justify-between backdrop-blur-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Recent Leads (7 Days)</span>
              <p className="text-3xl font-extrabold text-white">{recentLeads}</p>
            </div>
            <div className="h-12 w-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 border border-emerald-500/10">
              <Clock className="h-6 w-6" />
            </div>
          </div>

          {/* Card 3: Top Branch */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-6 flex items-center justify-between backdrop-blur-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Top Branch</span>
              <p className="text-3xl font-extrabold text-white">{topBranch}</p>
            </div>
            <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 border border-blue-500/10">
              <MapPin className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Error/Success Feedback Banners */}
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

        {/* Task 3: Modern Table Section */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/10 backdrop-blur-sm overflow-hidden">
          
          {/* Search Box */}
          <div className="p-6 border-b border-zinc-800/80 flex items-center bg-zinc-900/20">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer, phone, vehicle, or branch..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-16 text-zinc-500 text-sm">
                No leads recorded matching your search query.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800/85 bg-zinc-900/30 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Customer Name</th>
                    <th className="py-4 px-6">Mobile</th>
                    <th className="py-4 px-6">Vehicle</th>
                    <th className="py-4 px-6">Branch</th>
                    <th className="py-4 px-6 text-center">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-zinc-300 divide-y divide-zinc-850">
                  {filteredBookings.map((bk) => (
                    <tr key={bk.id} className="hover:bg-zinc-900/20 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs text-zinc-400">
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
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <UserIcon className="h-3.5 w-3.5 text-zinc-500" />
                          {bk.customerName}
                        </div>
                        <span className="text-[10px] text-zinc-500 block mt-0.5">{bk.customerEmail}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-zinc-300 font-mono text-xs">
                          <Phone className="h-3.5 w-3.5 text-zinc-600" />
                          {bk.customerPhone}
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
                      <td className="py-4 px-6 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className={`inline-flex items-center text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                            bk.status.toLowerCase() === "paid"
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                              : bk.status.toLowerCase() === "pending" || bk.status.toLowerCase() === "pending payment"
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                              : "bg-zinc-800 border-zinc-700 text-zinc-400"
                          }`}>
                            {bk.status}
                          </span>
                          {(bk.status.toLowerCase() === "pending" || bk.status.toLowerCase() === "pending payment") && (
                            <button
                              onClick={() => handleMarkAsPaid(bk.id)}
                              disabled={actionLoadingId !== null}
                              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-2 py-0.5 transition-colors"
                            >
                              {actionLoadingId === bk.id ? (
                                <Loader2 className="h-2.5 w-2.5 animate-spin text-white" />
                              ) : (
                                <CheckCircle className="h-2.5 w-2.5" />
                              )}
                              Mark as Paid
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(bk.id)}
                          disabled={actionLoadingId !== null}
                          className="inline-flex items-center justify-center p-2 rounded-lg text-zinc-600 hover:text-red-500 hover:bg-red-500/10 disabled:opacity-50 transition-all duration-150"
                          title="Delete Lead"
                        >
                          {actionLoadingId === bk.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
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
