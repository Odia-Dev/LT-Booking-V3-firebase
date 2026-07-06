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
  AlertCircle,
  Briefcase,
  Landmark,
  Image as ImageIcon,
  CheckSquare
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

interface TestDrive {
  id: string;
  fullName: string;
  phone: string;
  vehicleName: string;
  branch: string;
  preferredDate: string;
  status: string;
  createdAt: string;
  customerEmail: string;
  authEmail?: string | null;
}

interface FinanceLead {
  id: string;
  fullName: string;
  phone: string;
  occupation: string;
  monthlyIncome: number;
  preferredBank: string;
  vehicleName: string;
  status: string;
  submittedAt: string;
  customerEmail: string;
  authEmail?: string | null;
}

interface ExchangeLead {
  id: string;
  fullName: string;
  phone: string;
  carMake: string;
  carModel: string;
  kmsDriven: number;
  registrationYear: number;
  status: string;
  submittedAt: string;
  customerEmail: string;
  authEmail?: string | null;
  images?: string[];
}

type TabType = "bookings" | "test_drives" | "finance_leads" | "exchange_leads";

export default function AdminDashboard() {
  const { user, loading, loginWithGoogle, loginWithEmail, logout, isConfigured } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [testDrives, setTestDrives] = useState<TestDrive[]>([]);
  const [financeLeads, setFinanceLeads] = useState<FinanceLead[]>([]);
  const [exchangeLeads, setExchangeLeads] = useState<ExchangeLead[]>([]);
  
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

  const loadData = async () => {
    if (!user) return;
    setFetching(true);
    try {
      if (isConfigured) {
        // Fetch Bookings
        const bookingSnapshot = await getDocs(collection(db, "bookings"));
        const bList: Booking[] = [];
        bookingSnapshot.forEach((doc) => {
          bList.push({ id: doc.id, ...doc.data() } as Booking);
        });
        bList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBookings(bList);

        // Fetch Test Drives
        const tdSnapshot = await getDocs(collection(db, "test_drives"));
        const tdList: TestDrive[] = [];
        tdSnapshot.forEach((doc) => {
          tdList.push({ id: doc.id, ...doc.data() } as TestDrive);
        });
        tdList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setTestDrives(tdList);

        // Fetch Finance Leads
        const finSnapshot = await getDocs(collection(db, "finance_leads"));
        const finList: FinanceLead[] = [];
        finSnapshot.forEach((doc) => {
          finList.push({ id: doc.id, ...doc.data() } as FinanceLead);
        });
        finList.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        setFinanceLeads(finList);

        // Fetch Exchange Leads
        const exSnapshot = await getDocs(collection(db, "exchange_leads"));
        const exList: ExchangeLead[] = [];
        exSnapshot.forEach((doc) => {
          exList.push({ id: doc.id, ...doc.data() } as ExchangeLead);
        });
        exList.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        setExchangeLeads(exList);
      } else {
        // Mock data from localStorage
        const existingBookings = localStorage.getItem("laxmi_toyota_bookings");
        const bList: Booking[] = existingBookings ? JSON.parse(existingBookings) : [];
        bList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBookings(bList);

        const existingTd = localStorage.getItem("laxmi_toyota_test_drives");
        const tdList: TestDrive[] = existingTd ? JSON.parse(existingTd) : [];
        tdList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setTestDrives(tdList);

        const existingFin = localStorage.getItem("laxmi_toyota_finance_leads");
        const finList: FinanceLead[] = existingFin ? JSON.parse(existingFin) : [];
        finList.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        setFinanceLeads(finList);

        const existingEx = localStorage.getItem("laxmi_toyota_exchange_leads");
        const exList: ExchangeLead[] = existingEx ? JSON.parse(existingEx) : [];
        exList.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        setExchangeLeads(exList);
      }
    } catch (error) {
      console.error("Error loading admin leads:", error);
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

  const handleDelete = async (id: string, collectionName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete this lead?`)) {
      return;
    }
    
    setUpdatingId(id);
    setErrorMessage(null);
    try {
      if (isConfigured) {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
      } else {
        const localKey = collectionName === "bookings" 
          ? "laxmi_toyota_bookings"
          : collectionName === "test_drives"
          ? "laxmi_toyota_test_drives"
          : collectionName === "finance_leads"
          ? "laxmi_toyota_finance_leads"
          : "laxmi_toyota_exchange_leads";
          
        const existingRaw = localStorage.getItem(localKey);
        const list = existingRaw ? JSON.parse(existingRaw) : [];
        const updatedList = list.filter((item: any) => item.id !== id);
        localStorage.setItem(localKey, JSON.stringify(updatedList));
      }
      
      // Update local state
      if (collectionName === "bookings") setBookings(prev => prev.filter(i => i.id !== id));
      if (collectionName === "test_drives") setTestDrives(prev => prev.filter(i => i.id !== id));
      if (collectionName === "finance_leads") setFinanceLeads(prev => prev.filter(i => i.id !== id));
      if (collectionName === "exchange_leads") setExchangeLeads(prev => prev.filter(i => i.id !== id));

      setSuccessMessage("Lead deleted successfully.");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (error: any) {
      console.error("Error deleting lead:", error);
      setErrorMessage(error?.message || "Failed to delete lead document.");
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
      
      setBookings((prev) =>
        prev.map((bk) => (bk.id === bookingId ? { ...bk, status: newStatus } : bk))
      );
      
      setSuccessId(bookingId);
      setTimeout(() => setSuccessId(null), 3000);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const updateLeadStatus = async (id: string, collectionName: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      if (isConfigured) {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, { status: newStatus });
      } else {
        const localKey = collectionName === "test_drives"
          ? "laxmi_toyota_test_drives"
          : collectionName === "finance_leads"
          ? "laxmi_toyota_finance_leads"
          : "laxmi_toyota_exchange_leads";
          
        const existingRaw = localStorage.getItem(localKey);
        const list = existingRaw ? JSON.parse(existingRaw) : [];
        const updatedList = list.map((item: any) =>
          item.id === id ? { ...item, status: newStatus } : item
        );
        localStorage.setItem(localKey, JSON.stringify(updatedList));
      }

      if (collectionName === "test_drives") {
        setTestDrives(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
      } else if (collectionName === "finance_leads") {
        setFinanceLeads(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
      } else if (collectionName === "exchange_leads") {
        setExchangeLeads(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
      }

      setSuccessId(id);
      setTimeout(() => setSuccessId(null), 3000);
    } catch (error) {
      console.error("Error updating lead status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

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

  // Cross-reference VIP Helper
  const isVipCustomer = (email?: string | null, phone?: string) => {
    return bookings.some(
      (b) =>
        (email && b.customerEmail === email) ||
        (phone && b.customerPhone === phone)
    );
  };

  // Render VIP Tag Badge
  const renderVipBadge = (email?: string | null, phone?: string) => {
    const isVip = isVipCustomer(email, phone);
    if (isVip) {
      return (
        <span className="inline-flex items-center text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-green-950/60 border border-green-800/80 text-emerald-400 animate-pulse">
          🌟 Booked Customer
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500">
        Cold Lead
      </span>
    );
  };

  // KPI Calculations
  const totalBookings = bookings.length;
  const totalTd = testDrives.length;
  const totalFin = financeLeads.length;
  const totalEx = exchangeLeads.length;

  const totalRevenue = bookings.reduce((sum, item) => {
    const numericStr = item.bookingAmount.replace(/[₹,]/g, "");
    const amt = parseFloat(numericStr) || 0;
    return sum + amt;
  }, 0);

  const formattedRevenue = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(totalRevenue);

  const formatINR = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Filter logic based on active tab
  const getFilteredList = () => {
    const q = searchQuery.toLowerCase();
    if (activeTab === "bookings") {
      return bookings.filter(
        (i) =>
          i.customerName.toLowerCase().includes(q) ||
          i.vehicleName.toLowerCase().includes(q) ||
          i.branch.toLowerCase().includes(q) ||
          i.customerPhone.includes(q)
      );
    } else if (activeTab === "test_drives") {
      return testDrives.filter(
        (i) =>
          i.fullName.toLowerCase().includes(q) ||
          i.vehicleName.toLowerCase().includes(q) ||
          i.branch.toLowerCase().includes(q) ||
          i.phone.includes(q)
      );
    } else if (activeTab === "finance_leads") {
      return financeLeads.filter(
        (i) =>
          i.fullName.toLowerCase().includes(q) ||
          i.vehicleName.toLowerCase().includes(q) ||
          i.preferredBank.toLowerCase().includes(q) ||
          i.phone.includes(q)
      );
    } else {
      return exchangeLeads.filter(
        (i) =>
          i.fullName.toLowerCase().includes(q) ||
          i.carMake.toLowerCase().includes(q) ||
          i.carModel.toLowerCase().includes(q) ||
          i.phone.includes(q)
      );
    }
  };

  const filteredItems = getFilteredList();

  return (
    <div className="min-h-screen bg-zinc-950 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-800/80 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Dealership CRM Desk</h1>
            <p className="text-zinc-500 text-xs mt-1">Real-time tracking of allocations, customer reservations, and cross-tab leads.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-850 text-zinc-400 hover:text-white transition-colors"
              title="Refresh CRM"
            >
              <RefreshCwIcon />
            </button>
            {!isConfigured && (
              <span className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] px-3 py-1.5 rounded-full font-semibold uppercase">
                Mock Database View
              </span>
            )}
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 flex items-center justify-between backdrop-blur-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Bookings (Paid)</span>
              <p className="text-3xl font-extrabold text-white">{totalBookings}</p>
            </div>
            <div className="h-12 w-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 flex items-center justify-between backdrop-blur-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Test Drive Leads</span>
              <p className="text-3xl font-extrabold text-white">{totalTd}</p>
            </div>
            <div className="h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center text-[#EB0A1E]">
              <Car className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 flex items-center justify-between backdrop-blur-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Finance Leads</span>
              <p className="text-3xl font-extrabold text-white">{totalFin}</p>
            </div>
            <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400">
              <Landmark className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 flex items-center justify-between backdrop-blur-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Exchange Leads</span>
              <p className="text-3xl font-extrabold text-white">{totalEx}</p>
            </div>
            <div className="h-12 w-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* CRM Tabs Switcher */}
        <div className="flex border-b border-zinc-800/80 space-x-6 text-sm font-bold uppercase tracking-widest text-zinc-500 pb-1">
          <button
            onClick={() => { setActiveTab("bookings"); setSearchQuery(""); }}
            className={`pb-3 transition-colors ${activeTab === "bookings" ? "border-b-2 border-[#EB0A1E] text-white" : "hover:text-zinc-300"}`}
          >
            Reservations ({totalBookings})
          </button>
          <button
            onClick={() => { setActiveTab("test_drives"); setSearchQuery(""); }}
            className={`pb-3 transition-colors ${activeTab === "test_drives" ? "border-b-2 border-[#EB0A1E] text-white" : "hover:text-zinc-300"}`}
          >
            Test Drives ({totalTd})
          </button>
          <button
            onClick={() => { setActiveTab("finance_leads"); setSearchQuery(""); }}
            className={`pb-3 transition-colors ${activeTab === "finance_leads" ? "border-b-2 border-[#EB0A1E] text-white" : "hover:text-zinc-300"}`}
          >
            Finance Leads ({totalFin})
          </button>
          <button
            onClick={() => { setActiveTab("exchange_leads"); setSearchQuery(""); }}
            className={`pb-3 transition-colors ${activeTab === "exchange_leads" ? "border-b-2 border-[#EB0A1E] text-white" : "hover:text-zinc-300"}`}
          >
            Exchanges ({totalEx})
          </button>
        </div>

        {/* Error/Success Feedback Banners */}
        {(errorMessage || successMessage) && (
          <div className="space-y-4">
            {errorMessage && (
              <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <div className="flex-1 font-medium">{errorMessage}</div>
                <button onClick={() => setErrorMessage(null)} className="text-xs hover:underline uppercase font-bold text-red-500">Dismiss</button>
              </div>
            )}
            {successMessage && (
              <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm">
                <CheckCircle className="h-5 w-5 shrink-0" />
                <div className="flex-1 font-medium">{successMessage}</div>
                <button onClick={() => setSuccessMessage(null)} className="text-xs hover:underline uppercase font-bold text-emerald-500">Dismiss</button>
              </div>
            )}
          </div>
        )}

        {/* Search and Table container */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/10 backdrop-blur-sm overflow-hidden">
          
          {/* Search bar */}
          <div className="p-6 border-b border-zinc-800/80 flex items-center bg-zinc-900/20">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab.replace(/_/g, " ")}...`}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>

          {/* Searchable Data Table */}
          <div className="overflow-x-auto">
            {filteredItems.length === 0 ? (
              <div className="text-center py-16 text-zinc-500 text-sm">
                No entries found matching the query in this tab.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                
                {/* 1. BOOKINGS TAB TABLE */}
                {activeTab === "bookings" && (
                  <>
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
                      {filteredItems.map((bk: any) => (
                        <tr key={bk.id} className="hover:bg-zinc-900/30 transition-colors">
                          <td className="py-4 px-6 font-mono text-xs">
                            <div className="flex items-center gap-1.5 text-white">
                              <Calendar className="h-3.5 w-3.5 text-zinc-600" />
                              {new Date(bk.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              <div className="font-semibold text-white flex items-center gap-1.5">{bk.customerName}</div>
                              <div className="text-xs text-zinc-500 flex items-center gap-1.5">{bk.customerPhone}</div>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-semibold text-white">{bk.vehicleName}</td>
                          <td className="py-4 px-6 font-medium text-white">{bk.branch}</td>
                          <td className="py-4 px-6 font-semibold text-emerald-400">{bk.bookingAmount}</td>
                          <td className="py-4 px-6 text-center">
                            <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${
                              bk.status.toLowerCase() === "paid" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                            }`}>{bk.status}</span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-3">
                              {successId === bk.id ? (
                                <span className="text-xs text-emerald-400 font-bold">Paid</span>
                              ) : bk.status === "Pending Payment" ? (
                                <button onClick={() => updateBookingStatus(bk.id, "Paid")} className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 text-xs px-2.5 py-1.5 rounded-lg">Mark Paid</button>
                              ) : null}
                              <button onClick={() => handleDelete(bk.id, "bookings")} className="text-zinc-500 hover:text-red-500 p-2"><Trash2 className="h-4 w-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {/* 2. TEST DRIVES TAB TABLE */}
                {activeTab === "test_drives" && (
                  <>
                    <thead>
                      <tr className="border-b border-zinc-800/80 bg-zinc-900/30 text-xs font-bold uppercase tracking-wider text-zinc-500">
                        <th className="py-4 px-6">Submitted</th>
                        <th className="py-4 px-6">Customer</th>
                        <th className="py-4 px-6">Vehicle</th>
                        <th className="py-4 px-6">Branch</th>
                        <th className="py-4 px-6">Preferred Date</th>
                        <th className="py-4 px-6 text-center">Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-zinc-300 divide-y divide-zinc-800/40">
                      {filteredItems.map((td: any) => (
                        <tr key={td.id} className="hover:bg-zinc-900/30 transition-colors">
                          <td className="py-4 px-6 font-mono text-xs text-zinc-400">
                            {new Date(td.createdAt).toLocaleDateString("en-IN", { dateStyle: "short" })}
                          </td>
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              <div className="font-semibold text-white flex items-center gap-2">
                                {td.fullName}
                                {renderVipBadge(td.authEmail || td.customerEmail, td.phone)}
                              </div>
                              <div className="text-xs text-zinc-500">{td.phone}</div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-white font-medium">{td.vehicleName}</td>
                          <td className="py-4 px-6 text-white">{td.branch}</td>
                          <td className="py-4 px-6 font-medium text-amber-400">{new Date(td.preferredDate).toLocaleDateString("en-IN", { dateStyle: "medium" })}</td>
                          <td className="py-4 px-6 text-center">
                            <span className="bg-red-500/10 border border-red-500/20 text-[#EB0A1E] text-xs font-semibold px-2 py-0.5 rounded">{td.status}</span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-3">
                              {td.status === "New Lead" && (
                                <button onClick={() => updateLeadStatus(td.id, "test_drives", "Completed")} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs px-2.5 py-1 rounded">Mark Complete</button>
                              )}
                              <button onClick={() => handleDelete(td.id, "test_drives")} className="text-zinc-500 hover:text-red-500 p-2"><Trash2 className="h-4 w-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {/* 3. FINANCE LEADS TAB TABLE */}
                {activeTab === "finance_leads" && (
                  <>
                    <thead>
                      <tr className="border-b border-zinc-800/80 bg-zinc-900/30 text-xs font-bold uppercase tracking-wider text-zinc-500">
                        <th className="py-4 px-6">Submitted</th>
                        <th className="py-4 px-6">Customer</th>
                        <th className="py-4 px-6">Occupation</th>
                        <th className="py-4 px-6">Income</th>
                        <th className="py-4 px-6">Pref. Bank</th>
                        <th className="py-4 px-6">Vehicle</th>
                        <th className="py-4 px-6 text-center">Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-zinc-300 divide-y divide-zinc-800/40">
                      {filteredItems.map((fin: any) => (
                        <tr key={fin.id} className="hover:bg-zinc-900/30 transition-colors">
                          <td className="py-4 px-6 font-mono text-xs text-zinc-400">
                            {new Date(fin.submittedAt).toLocaleDateString("en-IN", { dateStyle: "short" })}
                          </td>
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              <div className="font-semibold text-white flex items-center gap-2">
                                {fin.fullName}
                                {renderVipBadge(fin.authEmail || fin.customerEmail, fin.phone)}
                              </div>
                              <div className="text-xs text-zinc-500">{fin.phone}</div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-zinc-400">{fin.occupation}</td>
                          <td className="py-4 px-6 font-semibold text-emerald-400">{formatINR(fin.monthlyIncome)}</td>
                          <td className="py-4 px-6 text-zinc-300">{fin.preferredBank}</td>
                          <td className="py-4 px-6 text-white">{fin.vehicleName}</td>
                          <td className="py-4 px-6 text-center">
                            <span className="bg-[#EB0A1E]/10 border border-[#EB0A1E]/20 text-[#EB0A1E] text-xs font-semibold px-2 py-0.5 rounded">{fin.status}</span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-3">
                              {fin.status === "New Lead" && (
                                <button onClick={() => updateLeadStatus(fin.id, "finance_leads", "Processed")} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs px-2.5 py-1 rounded">Mark Processed</button>
                              )}
                              <button onClick={() => handleDelete(fin.id, "finance_leads")} className="text-zinc-500 hover:text-red-500 p-2"><Trash2 className="h-4 w-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {/* 4. EXCHANGE LEADS TAB TABLE */}
                {activeTab === "exchange_leads" && (
                  <>
                    <thead>
                      <tr className="border-b border-zinc-800/80 bg-zinc-900/30 text-xs font-bold uppercase tracking-wider text-zinc-500">
                        <th className="py-4 px-6">Submitted</th>
                        <th className="py-4 px-6">Customer</th>
                        <th className="py-4 px-6">Car Specs</th>
                        <th className="py-4 px-6">Year / KMs</th>
                        <th className="py-4 px-6">Images</th>
                        <th className="py-4 px-6 text-center">Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-zinc-300 divide-y divide-zinc-800/40">
                      {filteredItems.map((ex: any) => (
                        <tr key={ex.id} className="hover:bg-zinc-900/30 transition-colors">
                          <td className="py-4 px-6 font-mono text-xs text-zinc-400">
                            {new Date(ex.submittedAt).toLocaleDateString("en-IN", { dateStyle: "short" })}
                          </td>
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              <div className="font-semibold text-white flex items-center gap-2">
                                {ex.fullName}
                                {renderVipBadge(ex.authEmail || ex.customerEmail, ex.phone)}
                              </div>
                              <div className="text-xs text-zinc-500">{ex.phone}</div>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-semibold text-white">{ex.carMake} {ex.carModel}</td>
                          <td className="py-4 px-6 text-zinc-400">{ex.registrationYear} / {ex.kmsDriven.toLocaleString()} KMs</td>
                          <td className="py-4 px-6">
                            {ex.images && ex.images.length > 0 ? (
                              <div className="flex gap-1.5 items-center">
                                <ImageIcon className="h-4 w-4 text-purple-400" />
                                <span className="text-xs font-bold text-purple-400">{ex.images.length} Photos</span>
                              </div>
                            ) : (
                              <span className="text-xs text-zinc-500">No Media</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className="bg-[#EB0A1E]/10 border border-[#EB0A1E]/20 text-[#EB0A1E] text-xs font-semibold px-2 py-0.5 rounded">{ex.status}</span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-3">
                              {ex.status === "New Lead" && (
                                <button onClick={() => updateLeadStatus(ex.id, "exchange_leads", "Evaluated")} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs px-2.5 py-1 rounded">Mark Evaluated</button>
                              )}
                              <button onClick={() => handleDelete(ex.id, "exchange_leads")} className="text-zinc-500 hover:text-red-500 p-2"><Trash2 className="h-4 w-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

              </table>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

// Simple Helper Component
function RefreshCwIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}
