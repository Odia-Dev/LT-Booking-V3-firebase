"use client";

import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  AlertCircle,
  Calculator,
  Landmark
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
  razorpay_order_id?: string;
}

export default function DashboardPage() {
  const { user, loading, loginWithGoogle, isConfigured } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.email === "admin@laxmitoyota.co.in") {
      router.push("/admin/dashboard");
    }
  }, [user, router]);

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
    if (!user) return;
    setFetching(true);
    try {
      if (isConfigured) {
        const querySnapshot = await getDocs(collection(db, "bookings"));
        const list: Booking[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Booking;
          if (data.customerEmail === user.email) {
            list.push({ ...data, id: doc.id });
          }
        });
        // Sort by date descending (newest first)
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBookings(list);
      } else {
        const existingRaw = localStorage.getItem("laxmi_toyota_bookings");
        const list: Booking[] = existingRaw ? JSON.parse(existingRaw) : [];
        const filteredList = list.filter((bk) => bk.customerEmail === user.email);
        filteredList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBookings(filteredList);
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
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Reservation Desk</h1>
            <p className="text-zinc-500 text-xs mt-1">Logged in as: <span className="text-zinc-300 font-semibold">{user?.email}</span></p>
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

        {/* Customer Portal Listings */}
        {filteredBookings.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 p-16 text-center space-y-6 backdrop-blur-sm">
            <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500 border border-red-500/20">
              <Car className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">No Bookings Found</h3>
              <p className="text-zinc-500 text-xs max-w-sm mx-auto">
                You haven't reserved any Toyota model yet. Visit our showroom to explore features and priority allocations.
              </p>
            </div>
            <Link
              href="/"
              className="inline-block bg-[#EB0A1E] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors"
            >
              Explore Showroom
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBookings.map((bk) => (
              <div key={bk.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6 backdrop-blur-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{bk.vehicleType || "VEHICLE"}</span>
                      <h3 className="text-xl font-extrabold text-white">{bk.vehicleName}</h3>
                    </div>
                    <span className={`inline-flex items-center text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${
                      bk.status.toLowerCase() === "paid"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    }`}>
                      {bk.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs border-y border-zinc-850 py-4">
                    <div className="space-y-0.5">
                      <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Booking Date</span>
                      <p className="text-white font-medium">
                        {new Date(bk.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })} at {new Date(bk.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Allotted Branch</span>
                      <p className="text-white font-medium">{bk.branch}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Reservation Deposit</span>
                      <p className="text-emerald-400 font-bold text-sm">{bk.bookingAmount}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Razorpay Order ID</span>
                      <p className="text-zinc-300 font-mono text-[10px] break-all">{bk.razorpay_order_id || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => alert(`Downloading booking receipt for your ${bk.vehicleName} booking reference ID: ${bk.id}...`)}
                    className="flex-1 py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 rounded-lg text-xs font-bold uppercase tracking-wider text-center transition-all"
                  >
                    Download Receipt
                  </button>
                  <Link
                    href={`/book/${bk.vehicleId}`}
                    className="flex-1 py-2.5 bg-zinc-850 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider text-center border border-zinc-800 transition-all"
                  >
                    Book Another
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Next Steps for Your Toyota Section */}
        <section className="space-y-6 pt-10 border-t border-zinc-800/60">
          <h2 className="text-2xl font-bold text-white tracking-tight">Next Steps for Your Toyota</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Card 1: EMI Calculator */}
            <div className="bg-zinc-900/30 border border-zinc-855 p-6 rounded-2xl space-y-4 hover:border-red-500/30 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 bg-red-500/10 rounded-xl flex items-center justify-center text-[#EB0A1E]">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Calculate Your EMI</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Plan your monthly payments with our interactive calculator.
                  </p>
                </div>
              </div>
              <Link
                href="/toyota-emi-calculator"
                className="inline-flex items-center justify-center w-full bg-zinc-900 text-zinc-300 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#EB0A1E] hover:text-white border border-zinc-800 hover:border-transparent transition-all mt-4"
              >
                Go to Calculator
              </Link>
            </div>

            {/* Card 2: Loan Eligibility */}
            <div className="bg-zinc-900/30 border border-zinc-855 p-6 rounded-2xl space-y-4 hover:border-red-500/30 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 bg-red-500/10 rounded-xl flex items-center justify-center text-[#EB0A1E]">
                  <Landmark className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Check Loan Eligibility</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Get pre-approved for Toyota Finance with minimal documentation.
                  </p>
                </div>
              </div>
              <Link
                href="/car-loan-eligibility"
                className="inline-flex items-center justify-center w-full bg-zinc-900 text-zinc-300 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#EB0A1E] hover:text-white border border-zinc-800 hover:border-transparent transition-all mt-4"
              >
                Apply for Loan
              </Link>
            </div>

            {/* Card 3: Book a Test Drive */}
            <div className="bg-zinc-900/30 border border-zinc-855 p-6 rounded-2xl space-y-4 hover:border-red-500/30 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 bg-red-500/10 rounded-xl flex items-center justify-center text-[#EB0A1E]">
                  <Car className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Book a Test Drive</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Experience the drive before your delivery.
                  </p>
                </div>
              </div>
              <Link
                href="/book-test-drive"
                className="inline-flex items-center justify-center w-full bg-zinc-900 text-zinc-300 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#EB0A1E] hover:text-white border border-zinc-800 hover:border-transparent transition-all mt-4"
              >
                Book Test Drive
              </Link>
            </div>

            {/* Card 4: Car Exchange Valuation */}
            <div className="bg-zinc-900/30 border border-zinc-855 p-6 rounded-2xl space-y-4 hover:border-red-500/30 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 bg-red-500/10 rounded-xl flex items-center justify-center text-[#EB0A1E]">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Value Your Old Car (U-Trust)</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Get the best exchange value for your current vehicle to upgrade to your new Toyota.
                  </p>
                </div>
              </div>
              <Link
                href="/car-exchange-valuation"
                className="inline-flex items-center justify-center w-full bg-zinc-900 text-zinc-300 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#EB0A1E] hover:text-white border border-zinc-800 hover:border-transparent transition-all mt-4"
              >
                Value My Car
              </Link>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
