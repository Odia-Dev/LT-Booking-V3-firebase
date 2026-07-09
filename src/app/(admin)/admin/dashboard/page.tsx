"use client";

import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState, useMemo } from "react";
import { db, isConfigured } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, addDoc, getDoc } from "firebase/firestore";
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
  CheckSquare,
  UserCheck,
  X,
  Plus,
  Settings as SettingsIcon,
  Download,
  MessageCircle
} from "lucide-react";
import AuthForm from "@/components/AuthForm";
import LogoutButton from "@/components/LogoutButton";

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
  assignedTo?: string;
  soStatus?: string;
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
  assignedTo?: string;
  soStatus?: string;
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
  assignedTo?: string;
  soStatus?: string;
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
  assignedTo?: string;
  soStatus?: string;
  branch?: string;
}

type TabType = "bookings" | "test_drives" | "finance_leads" | "exchange_leads" | "payment_settings";

const OFFICIAL_BRANCHES = [
  "Berhampur",
  "Jeypore",
  "Bargarh",
  "Balangir",
  "Rayagada",
  "Bhawanipatna",
  "Paralakhemundi",
  "Aska"
];

const SO_STATUS_OPTIONS = [
  "Pending",
  "Contacted",
  "Showroom Visit",
  "Converted",
  "Lost"
];

export default function AdminDashboard() {
  const { user, loading, loginWithGoogle, loginWithEmail, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [testDrives, setTestDrives] = useState<TestDrive[]>([]);
  const [financeLeads, setFinanceLeads] = useState<FinanceLead[]>([]);
  const [exchangeLeads, setExchangeLeads] = useState<ExchangeLead[]>([]);
  
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Paid" | "Cancelled">("All");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sales Officer Autocomplete States
  const [salesOfficers, setSalesOfficers] = useState<string[]>([]);

  // ICICI payment settings states
  const [iciciMerchantId, setIciciMerchantId] = useState("");
  const [iciciEncryptionKey, setIciciEncryptionKey] = useState("");
  const [iciciThreshold, setIciciThreshold] = useState(100000);
  const [iciciEnabled, setIciciEnabled] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      if (!user) return;
      if (isConfigured) {
        try {
          const docSnap = await getDoc(doc(db, "settings", "payment_gateways"));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setIciciMerchantId(data.merchantId || "");
            setIciciEncryptionKey(data.encryptionKey || "");
            setIciciThreshold(data.threshold || 100000);
            setIciciEnabled(!!data.enabled);
          }
        } catch (e) {
          console.error("Error loading payment integration settings:", e);
        }
      } else {
        const local = localStorage.getItem("laxmi_toyota_payment_gateways");
        if (local) {
          const data = JSON.parse(local);
          setIciciMerchantId(data.merchantId || "");
          setIciciEncryptionKey(data.encryptionKey || "");
          setIciciThreshold(data.threshold || 100000);
          setIciciEnabled(!!data.enabled);
        }
      }
    }
    loadSettings();
  }, [user]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const payload = {
        merchantId: iciciMerchantId,
        encryptionKey: iciciEncryptionKey,
        threshold: iciciThreshold,
        enabled: iciciEnabled,
        updatedAt: new Date().toISOString()
      };

      if (isConfigured) {
        await setDoc(doc(db, "settings", "payment_gateways"), payload);
      } else {
        localStorage.setItem("laxmi_toyota_payment_gateways", JSON.stringify(payload));
      }
      setSuccessMessage("ICICI Payment Gateway settings saved successfully.");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (error: any) {
      console.error("Error saving payment gateways settings:", error);
      setErrorMessage(error?.message || "Failed to save payment integrations settings.");
    } finally {
      setSavingSettings(false);
    }
  };
  
  // Assignment Modal States
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedLeadCollection, setSelectedLeadCollection] = useState<string | null>(null);
  const [soInput, setSoInput] = useState("");
  const [soSuggestions, setSoSuggestions] = useState<string[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("Berhampur");
  const [customBranch, setCustomBranch] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  // Optimized filter logic combining searchQuery and statusFilter using useMemo
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase();
    
    const matchesStatus = (itemStatus: string) => {
      if (statusFilter === "All") return true;
      const statusLower = (itemStatus || "").toLowerCase();
      
      if (statusFilter === "Pending") {
        return statusLower.includes("pending") || statusLower === "new lead" || statusLower === "assigned";
      }
      if (statusFilter === "Paid") {
        return statusLower === "paid" || statusLower === "completed" || statusLower === "processed" || statusLower === "evaluated" || statusLower === "converted";
      }
      if (statusFilter === "Cancelled") {
        return statusLower === "cancelled" || statusLower === "lost" || statusLower.includes("cancel");
      }
      return true;
    };

    if (activeTab === "bookings") {
      return bookings.filter(
        (i) =>
          matchesStatus(i.status) &&
          (i.customerName.toLowerCase().includes(q) ||
           i.vehicleName.toLowerCase().includes(q) ||
           i.branch.toLowerCase().includes(q) ||
           i.customerPhone.includes(q))
      );
    } else if (activeTab === "test_drives") {
      return testDrives.filter(
        (i) =>
          matchesStatus(i.status) &&
          (i.fullName.toLowerCase().includes(q) ||
           i.vehicleName.toLowerCase().includes(q) ||
           i.branch.toLowerCase().includes(q) ||
           i.phone.includes(q))
      );
    } else if (activeTab === "finance_leads") {
      return financeLeads.filter(
        (i) =>
          matchesStatus(i.status) &&
          (i.fullName.toLowerCase().includes(q) ||
           i.vehicleName.toLowerCase().includes(q) ||
           i.preferredBank.toLowerCase().includes(q) ||
           i.phone.includes(q))
      );
    } else if (activeTab === "exchange_leads") {
      return exchangeLeads.filter(
        (i) =>
          matchesStatus(i.status) &&
          (i.fullName.toLowerCase().includes(q) ||
           (i.carMake && i.carMake.toLowerCase().includes(q)) ||
           (i.carModel && i.carModel.toLowerCase().includes(q)) ||
           i.phone.includes(q))
      );
    }
    return [];
  }, [activeTab, searchQuery, statusFilter, bookings, testDrives, financeLeads, exchangeLeads]);

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

  const fetchSalesOfficers = async () => {
    try {
      if (isConfigured) {
        const querySnapshot = await getDocs(collection(db, "sales_officers"));
        const names: string[] = [];
        querySnapshot.forEach((doc) => {
          names.push(doc.data().name);
        });
        setSalesOfficers(Array.from(new Set(names)));
      } else {
        const mockSO = localStorage.getItem("laxmi_toyota_sales_officers");
        if (mockSO) {
          setSalesOfficers(JSON.parse(mockSO));
        } else {
          const defaults = ["Sanjay", "Rajesh", "Pooja", "Amit"];
          localStorage.setItem("laxmi_toyota_sales_officers", JSON.stringify(defaults));
          setSalesOfficers(defaults);
        }
      }
    } catch (error) {
      console.error("Error loading sales officers suggestions:", error);
    }
  };

  const loadData = async () => {
    if (!user) return;
    setFetching(true);
    try {
      await fetchSalesOfficers();

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
  }, [user]);

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

  // Inline SO Status Update Trigger
  const updateSoStatus = async (id: string, collectionName: string, newSoStatus: string) => {
    setUpdatingId(id);
    try {
      if (isConfigured) {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, { soStatus: newSoStatus });
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
        const updated = list.map((i: any) => i.id === id ? { ...i, soStatus: newSoStatus } : i);
        localStorage.setItem(localKey, JSON.stringify(updated));
      }

      if (collectionName === "bookings") {
        setBookings(prev => prev.map(i => i.id === id ? { ...i, soStatus: newSoStatus } : i));
      } else if (collectionName === "test_drives") {
        setTestDrives(prev => prev.map(i => i.id === id ? { ...i, soStatus: newSoStatus } : i));
      } else if (collectionName === "finance_leads") {
        setFinanceLeads(prev => prev.map(i => i.id === id ? { ...i, soStatus: newSoStatus } : i));
      } else if (collectionName === "exchange_leads") {
        setExchangeLeads(prev => prev.map(i => i.id === id ? { ...i, soStatus: newSoStatus } : i));
      }

      setSuccessId(id);
      setTimeout(() => setSuccessId(null), 3000);
    } catch (e) {
      console.error("Failed to update SO status:", e);
    } finally {
      setUpdatingId(null);
    }
  };

  // Open Assign Modal Handler
  const openAssignDialog = (leadId: string, collectionName: string, currentSo = "", currentBranch = "Berhampur") => {
    setSelectedLeadId(leadId);
    setSelectedLeadCollection(collectionName);
    setSoInput(currentSo);
    
    if (OFFICIAL_BRANCHES.includes(currentBranch)) {
      setSelectedBranch(currentBranch);
      setCustomBranch("");
    } else {
      setSelectedBranch("Other");
      setCustomBranch(currentBranch);
    }
    
    setSoSuggestions([]);
    setShowAssignModal(true);
  };

  // Autocomplete change suggestor
  const handleSoInputChange = (value: string) => {
    setSoInput(value);
    if (!value.trim()) {
      setSoSuggestions([]);
      return;
    }
    const filtered = salesOfficers.filter(so => 
      so.toLowerCase().includes(value.toLowerCase())
    );
    setSoSuggestions(filtered);
  };

  // Save Assignment Dialog Handler
  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId || !selectedLeadCollection) return;
    
    const assignedSO = soInput.trim();
    if (!assignedSO) {
      alert("Please specify a Sales Officer Name.");
      return;
    }

    const finalBranch = selectedBranch === "Other" ? customBranch.trim() : selectedBranch;
    if (!finalBranch) {
      alert("Please specify a location branch.");
      return;
    }

    setIsAssigning(true);
    try {
      // 1. Save new Sales Officer suggestion if not already present
      if (!salesOfficers.includes(assignedSO)) {
        if (isConfigured) {
          await addDoc(collection(db, "sales_officers"), { name: assignedSO });
        } else {
          const list = [...salesOfficers, assignedSO];
          localStorage.setItem("laxmi_toyota_sales_officers", JSON.stringify(list));
        }
        setSalesOfficers(prev => Array.from(new Set([...prev, assignedSO])));
      }

      // 2. Update Lead Document
      const updates = {
        assignedTo: assignedSO,
        branch: finalBranch,
        status: "Assigned",
        soStatus: "Pending"
      };

      if (isConfigured) {
        const docRef = doc(db, selectedLeadCollection, selectedLeadId);
        await updateDoc(docRef, updates);
      } else {
        const localKey = selectedLeadCollection === "bookings" 
          ? "laxmi_toyota_bookings"
          : selectedLeadCollection === "test_drives"
          ? "laxmi_toyota_test_drives"
          : selectedLeadCollection === "finance_leads"
          ? "laxmi_toyota_finance_leads"
          : "laxmi_toyota_exchange_leads";

        const existingRaw = localStorage.getItem(localKey);
        const list = existingRaw ? JSON.parse(existingRaw) : [];
        const updated = list.map((i: any) => 
          i.id === selectedLeadId ? { ...i, ...updates } : i
        );
        localStorage.setItem(localKey, JSON.stringify(updated));
      }

      // 3. Update States
      if (selectedLeadCollection === "bookings") {
        setBookings(prev => prev.map(i => i.id === selectedLeadId ? { ...i, ...updates } : i));
      } else if (selectedLeadCollection === "test_drives") {
        setTestDrives(prev => prev.map(i => i.id === selectedLeadId ? { ...i, ...updates } : i));
      } else if (selectedLeadCollection === "finance_leads") {
        setFinanceLeads(prev => prev.map(i => i.id === selectedLeadId ? { ...i, ...updates } : i));
      } else if (selectedLeadCollection === "exchange_leads") {
        setExchangeLeads(prev => prev.map(i => i.id === selectedLeadId ? { ...i, ...updates } : i));
      }

      setSuccessMessage("Lead assigned successfully!");
      setTimeout(() => setSuccessMessage(null), 4000);
      setShowAssignModal(false);
    } catch (err: any) {
      console.error("Assignment Error:", err);
      alert("Failed to assign lead: " + (err.message || err.toString()));
    } finally {
      setIsAssigning(false);
    }
  };

  if (loading || (user && fetching)) {
    return (
      <div className="min-h-screen bg-slate-955 px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-10">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center border-b border-slate-900 pb-6">
            <div className="space-y-3">
              <div className="h-8 w-48 bg-slate-900 rounded-lg"></div>
              <div className="h-4 w-72 bg-slate-900 rounded-md"></div>
            </div>
            <div className="h-10 w-10 bg-slate-900 rounded-lg"></div>
          </div>

          {/* Cards Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-slate-900/50 border border-slate-900 rounded-2xl p-6 space-y-3">
                <div className="h-3 w-20 bg-slate-900 rounded-md"></div>
                <div className="h-8 w-16 bg-slate-900 rounded-lg"></div>
              </div>
            ))}
          </div>

          {/* Table Container Skeleton */}
          <div className="border border-slate-900 rounded-2xl overflow-hidden space-y-4">
            <div className="p-6 bg-slate-900/10 border-b border-slate-900 flex justify-between items-center gap-4">
              <div className="h-10 w-64 bg-slate-900/90 rounded-lg"></div>
              <div className="h-10 w-48 bg-slate-900/90 rounded-lg"></div>
              <div className="h-10 w-32 bg-slate-900/90 rounded-lg"></div>
            </div>
            <div className="p-6 space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center gap-6">
                  <div className="h-4 w-28 bg-slate-900 rounded-md"></div>
                  <div className="h-4 w-40 bg-slate-900 rounded-md"></div>
                  <div className="h-4 w-24 bg-slate-900 rounded-md"></div>
                  <div className="h-4 w-20 bg-slate-900 rounded-md"></div>
                  <div className="h-4 w-24 bg-slate-900 rounded-md"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Access Control check
  if (user && user.email !== "admin@laxmitoyota.co.in") {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-slate-950 px-4">
        <div className="max-w-md w-full border border-red-500/20 bg-slate-900/40 p-8 rounded-2xl text-center space-y-6 backdrop-blur-md">
          <div className="h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Access Denied</h2>
          <p className="text-slate-400 text-sm">
            The account <strong className="text-white">{user.email}</strong> is not authorized to access the Admin Dashboard.
          </p>
          <button
            onClick={() => logout()}
            className="w-full rounded-full bg-slate-800 hover:bg-slate-700 py-3 text-sm font-semibold text-white transition-all duration-200"
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
      <div className="min-h-[85vh] flex items-center justify-center bg-slate-950 px-4">
        <AuthForm />
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
      <span className="inline-flex items-center text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-500">
        Cold Lead
      </span>
    );
  };

  // Dispatch Assignment Column Render Helper
  const renderAssignmentColumn = (leadId: string, collectionName: string, assignedTo?: string, branch?: string) => {
    if (assignedTo) {
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-white font-semibold">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            {assignedTo}
          </div>
          <button
            onClick={() => openAssignDialog(leadId, collectionName, assignedTo, branch)}
            className="text-[10px] text-slate-500 hover:text-red-500 transition-colors uppercase font-bold tracking-wider"
          >
            Change
          </button>
        </div>
      );
    }
    return (
      <div className="space-y-1">
        <span className="inline-block text-[9px] font-bold uppercase tracking-wider bg-red-950/40 border border-red-900/60 text-red-400 px-2 py-0.5 rounded">
          Unassigned
        </span>
        <button
          onClick={() => openAssignDialog(leadId, collectionName, "", branch)}
          className="block text-[10px] text-blue-400 hover:text-blue-300 font-bold hover:underline transition-all"
        >
          Assign Lead
        </button>
      </div>
    );
  };

  // Dispatch SO Status Dropdown Render Helper
  const renderSoStatusColumn = (leadId: string, collectionName: string, soStatus = "Pending") => {
    return (
      <div className="relative">
        <select
          value={soStatus}
          onChange={(e) => updateSoStatus(leadId, collectionName, e.target.value)}
          disabled={updatingId === leadId}
          className="bg-slate-900/60 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-red-500 transition-all font-medium appearance-none cursor-pointer"
        >
          {SO_STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
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



  // Export filtered table data to a clean CSV file
  const exportToCSV = () => {
    if (!filteredItems || filteredItems.length === 0) {
      alert("No data available to export.");
      return;
    }
    
    let headers: string[] = [];
    let rows: any[] = [];
    
    if (activeTab === "bookings") {
      headers = ["Date", "Customer Name", "Phone", "Vehicle", "Branch", "Deposit Amount", "SO Assigned", "SO Status", "Status"];
      rows = filteredItems.map((item: any) => [
        new Date(item.createdAt).toLocaleString("en-IN"),
        item.customerName,
        item.customerPhone,
        item.vehicleName,
        item.branch,
        item.bookingAmount,
        item.assignedTo || "Unassigned",
        item.soStatus || "Pending",
        item.status
      ]);
    } else if (activeTab === "test_drives") {
      headers = ["Submitted Date", "Customer Name", "Phone", "Vehicle", "Branch", "Preferred Date", "SO Assigned", "SO Status", "Status"];
      rows = filteredItems.map((item: any) => [
        new Date(item.createdAt).toLocaleString("en-IN"),
        item.fullName,
        item.phone,
        item.vehicleName,
        item.branch,
        new Date(item.preferredDate).toLocaleDateString("en-IN"),
        item.assignedTo || "Unassigned",
        item.soStatus || "Pending",
        item.status
      ]);
    } else if (activeTab === "finance_leads") {
      headers = ["Submitted Date", "Customer Name", "Phone", "Vehicle", "Occupation", "Income", "Preferred Bank", "SO Assigned", "SO Status", "Status"];
      rows = filteredItems.map((item: any) => [
        new Date(item.submittedAt).toLocaleString("en-IN"),
        item.fullName,
        item.phone,
        item.vehicleName,
        item.occupation,
        item.monthlyIncome,
        item.preferredBank,
        item.assignedTo || "Unassigned",
        item.soStatus || "Pending",
        item.status
      ]);
    } else if (activeTab === "exchange_leads") {
      headers = ["Submitted Date", "Customer Name", "Phone", "Car Specs", "Year / KMs", "SO Assigned", "SO Status", "Status"];
      rows = filteredItems.map((item: any) => [
        new Date(item.submittedAt).toLocaleString("en-IN"),
        item.fullName,
        item.phone,
        `${item.carMake} ${item.carModel}`,
        `${item.registrationYear} / ${item.kmsDriven} KMs`,
        item.assignedTo || "Unassigned",
        item.soStatus || "Pending",
        item.status
      ]);
    }
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => 
        row.map((val: any) => {
          const valStr = String(val === undefined || val === null ? "" : val);
          const escaped = valStr.replace(/"/g, '""');
          return `"${escaped}"`;
        }).join(",")
      )
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Laxmi_Toyota_${activeTab}_Export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800/80 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Dealership CRM Desk</h1>
            <p className="text-slate-500 text-xs mt-1">Real-time tracking of allocations, customer reservations, and cross-tab leads.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-850 text-slate-400 hover:text-white transition-colors"
              title="Refresh CRM"
            >
              <RefreshCwIcon />
            </button>
            <LogoutButton />
            {!isConfigured && (
              <span className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] px-3 py-1.5 rounded-full font-semibold uppercase">
                Mock Database View
              </span>
            )}
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-6 flex items-center justify-between backdrop-blur-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Bookings (Paid)</span>
              <p className="text-3xl font-extrabold text-white">{totalBookings}</p>
            </div>
            <div className="h-12 w-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-6 flex items-center justify-between backdrop-blur-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Test Drive Leads</span>
              <p className="text-3xl font-extrabold text-white">{totalTd}</p>
            </div>
            <div className="h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center text-[#EB0A1E]">
              <Car className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-6 flex items-center justify-between backdrop-blur-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Finance Leads</span>
              <p className="text-3xl font-extrabold text-white">{totalFin}</p>
            </div>
            <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400">
              <Landmark className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-6 flex items-center justify-between backdrop-blur-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Exchange Leads</span>
              <p className="text-3xl font-extrabold text-white">{totalEx}</p>
            </div>
            <div className="h-12 w-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* CRM Tabs Switcher */}
        <div className="flex border-b border-slate-800/80 space-x-6 text-sm font-bold uppercase tracking-widest text-slate-500 pb-1">
          <button
            onClick={() => { setActiveTab("bookings"); setSearchQuery(""); }}
            className={`pb-3 transition-colors ${activeTab === "bookings" ? "border-b-2 border-[#EB0A1E] text-white" : "hover:text-slate-300"}`}
          >
            Reservations ({totalBookings})
          </button>
          <button
            onClick={() => { setActiveTab("test_drives"); setSearchQuery(""); }}
            className={`pb-3 transition-colors ${activeTab === "test_drives" ? "border-b-2 border-[#EB0A1E] text-white" : "hover:text-slate-300"}`}
          >
            Test Drives ({totalTd})
          </button>
          <button
            onClick={() => { setActiveTab("finance_leads"); setSearchQuery(""); }}
            className={`pb-3 transition-colors ${activeTab === "finance_leads" ? "border-b-2 border-[#EB0A1E] text-white" : "hover:text-slate-300"}`}
          >
            Finance Leads ({totalFin})
          </button>
          <button
            onClick={() => { setActiveTab("exchange_leads"); setSearchQuery(""); }}
            className={`pb-3 transition-colors ${activeTab === "exchange_leads" ? "border-b-2 border-[#EB0A1E] text-white" : "hover:text-slate-300"}`}
          >
            Exchanges ({totalEx})
          </button>
          <button
            onClick={() => { setActiveTab("payment_settings"); setSearchQuery(""); }}
            className={`pb-3 transition-colors ${activeTab === "payment_settings" ? "border-b-2 border-[#EB0A1E] text-white" : "hover:text-slate-300"}`}
          >
            Payment Integrations
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

        {activeTab === "payment_settings" ? (
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/10 backdrop-blur-sm p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-800/60 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-[#EB0A1E]" /> Payment Gateway Integrations
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-semibold">Configure live API credentials for ICICI payment pipelines and routing thresholds.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl text-left">
              <div className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800/60 rounded-xl">
                <div>
                  <h4 className="text-sm font-semibold text-white">Enable ICICI Eazypay Gateway</h4>
                  <p className="text-xs text-slate-500">Reroute customer checkout amounts through ICICI Bank integration.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={iciciEnabled} 
                    onChange={(e) => setIciciEnabled(e.target.checked)} 
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EB0A1E] peer-checked:after:bg-white"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Merchant ID</label>
                  <input
                    type="text"
                    placeholder="e.g. 293812"
                    value={iciciMerchantId}
                    onChange={(e) => setIciciMerchantId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Smart Routing Threshold Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="100000"
                    value={iciciThreshold}
                    onChange={(e) => setIciciThreshold(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">AES Encryption Key</label>
                <input
                  type="password"
                  placeholder="••••••••••••••••••••••••••••••••"
                  value={iciciEncryptionKey}
                  onChange={(e) => setIciciEncryptionKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-colors font-mono"
                />
                <p className="text-[10px] text-slate-500">Values are stored securely inside Firestore settings parameters and masked visually.</p>
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="inline-flex items-center gap-2 rounded-lg bg-[#EB0A1E] hover:bg-red-750 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl disabled:opacity-50 transition-all duration-200"
              >
                {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Save Settings
              </button>
            </form>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/10 backdrop-blur-sm overflow-hidden">
            
            {/* Search, Filter Tabs & CSV Export Bar */}
            <div className="p-6 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/20">
              {/* Search bar */}
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search by name or phone...`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex bg-slate-950 p-1 border border-slate-800/60 rounded-xl space-x-1 self-start md:self-auto">
                {(["All", "Pending", "Paid", "Cancelled"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                      statusFilter === status
                        ? "bg-[#EB0A1E] text-white shadow-md shadow-red-500/10"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* CSV Export Button */}
              <button
                onClick={exportToCSV}
                className="inline-flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-all shadow-md self-start md:self-auto"
              >
                <Download className="w-4 h-4 text-slate-400" />
                Export CSV
              </button>
            </div>

          {/* Searchable Data Table */}
          <div className="overflow-x-auto">
            {filteredItems.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-sm">
                No entries found matching the query in this tab.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                
                {/* 1. BOOKINGS TAB TABLE */}
                {activeTab === "bookings" && (
                  <>
                    <thead>
                      <tr className="border-b border-slate-800/80 bg-slate-900/30 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-4 px-6">Date</th>
                        <th className="py-4 px-6">Customer</th>
                        <th className="py-4 px-6">Vehicle</th>
                        <th className="py-4 px-6">Branch</th>
                        <th className="py-4 px-6">Deposit</th>
                        <th className="py-4 px-6">Assigned SO</th>
                        <th className="py-4 px-6 text-center">SO Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-300 divide-y divide-slate-800/40">
                      {filteredItems.map((bk: any) => (
                        <tr key={bk.id} className="hover:bg-slate-900/30 transition-colors">
                          <td className="py-4 px-6 font-mono text-xs">
                            <div className="flex items-center gap-1.5 text-white">
                              <Calendar className="h-3.5 w-3.5 text-slate-600" />
                              {new Date(bk.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              <div className="font-semibold text-white flex items-center gap-1.5">{bk.customerName}</div>
                              <div className="text-xs text-slate-500 flex items-center gap-1.5">{bk.customerPhone}</div>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-semibold text-white">{bk.vehicleName}</td>
                          <td className="py-4 px-6 font-medium text-white">{bk.branch}</td>
                          <td className="py-4 px-6 font-semibold text-emerald-400">{bk.bookingAmount}</td>
                          <td className="py-4 px-6">{renderAssignmentColumn(bk.id, "bookings", bk.assignedTo, bk.branch)}</td>
                          <td className="py-4 px-6 text-center">{renderSoStatusColumn(bk.id, "bookings", bk.soStatus)}</td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end items-center gap-2">
                              <a
                                href={`tel:${bk.customerPhone}`}
                                className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-blue-450 hover:bg-slate-850 transition-all"
                                title="Call Customer"
                              >
                                <Phone className="h-3.5 w-3.5" />
                              </a>
                              <a
                                href={`https://wa.me/${bk.customerPhone.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-emerald-450 hover:bg-slate-850 transition-all"
                                title="WhatsApp Customer"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                              </a>
                              {successId === bk.id ? (
                                <span className="text-xs text-emerald-400 font-bold">Paid</span>
                              ) : bk.status === "Pending Payment" ? (
                                <button onClick={() => updateBookingStatus(bk.id, "Paid")} className="bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 text-xs px-2.5 py-1.5 rounded-lg">Mark Paid</button>
                              ) : null}
                              <button onClick={() => handleDelete(bk.id, "bookings")} className="text-slate-500 hover:text-red-500 p-2"><Trash2 className="h-4 w-4" /></button>
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
                      <tr className="border-b border-slate-800/80 bg-slate-900/30 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-4 px-6">Submitted</th>
                        <th className="py-4 px-6">Customer</th>
                        <th className="py-4 px-6">Vehicle</th>
                        <th className="py-4 px-6">Branch</th>
                        <th className="py-4 px-6">Preferred Date</th>
                        <th className="py-4 px-6">Assigned SO</th>
                        <th className="py-4 px-6 text-center">SO Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-300 divide-y divide-slate-800/40">
                      {filteredItems.map((td: any) => (
                        <tr key={td.id} className="hover:bg-slate-900/30 transition-colors">
                          <td className="py-4 px-6 font-mono text-xs text-slate-400">
                            {new Date(td.createdAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                          </td>
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              <div className="font-semibold text-white flex items-center gap-2">
                                {td.fullName}
                                {renderVipBadge(td.authEmail || td.customerEmail, td.phone)}
                              </div>
                              <div className="text-xs text-slate-500">{td.phone}</div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-white font-medium">{td.vehicleName}</td>
                          <td className="py-4 px-6 text-white">{td.branch}</td>
                          <td className="py-4 px-6 font-medium text-amber-400">{new Date(td.preferredDate).toLocaleDateString("en-IN", { dateStyle: "medium" })}</td>
                          <td className="py-4 px-6">{renderAssignmentColumn(td.id, "test_drives", td.assignedTo, td.branch)}</td>
                          <td className="py-4 px-6 text-center">{renderSoStatusColumn(td.id, "test_drives", td.soStatus)}</td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end items-center gap-2">
                              <a
                                href={`tel:${td.phone}`}
                                className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-blue-450 hover:bg-slate-850 transition-all"
                                title="Call Customer"
                              >
                                <Phone className="h-3.5 w-3.5" />
                              </a>
                              <a
                                href={`https://wa.me/${td.phone.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-emerald-450 hover:bg-slate-850 transition-all"
                                title="WhatsApp Customer"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                              </a>
                              {td.status === "New Lead" && (
                                <button onClick={() => updateLeadStatus(td.id, "test_drives", "Completed")} className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs px-2.5 py-1 rounded">Mark Complete</button>
                              )}
                              <button onClick={() => handleDelete(td.id, "test_drives")} className="text-slate-500 hover:text-red-500 p-2"><Trash2 className="h-4 w-4" /></button>
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
                      <tr className="border-b border-slate-800/80 bg-slate-900/30 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-4 px-6">Submitted</th>
                        <th className="py-4 px-6">Customer</th>
                        <th className="py-4 px-6">Occupation</th>
                        <th className="py-4 px-6">Income</th>
                        <th className="py-4 px-6">Pref. Bank</th>
                        <th className="py-4 px-6">Vehicle</th>
                        <th className="py-4 px-6">Assigned SO</th>
                        <th className="py-4 px-6 text-center">SO Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-300 divide-y divide-slate-800/40">
                      {filteredItems.map((fin: any) => (
                        <tr key={fin.id} className="hover:bg-slate-900/30 transition-colors">
                          <td className="py-4 px-6 font-mono text-xs text-slate-400">
                            {new Date(fin.submittedAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                          </td>
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              <div className="font-semibold text-white flex items-center gap-2">
                                {fin.fullName}
                                {renderVipBadge(fin.authEmail || fin.customerEmail, fin.phone)}
                              </div>
                              <div className="text-xs text-slate-500">{fin.phone}</div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-slate-400">{fin.occupation}</td>
                          <td className="py-4 px-6 font-semibold text-emerald-400">{formatINR(fin.monthlyIncome)}</td>
                          <td className="py-4 px-6 text-slate-300">{fin.preferredBank}</td>
                          <td className="py-4 px-6 text-white">{fin.vehicleName}</td>
                          <td className="py-4 px-6">{renderAssignmentColumn(fin.id, "finance_leads", fin.assignedTo, fin.branch)}</td>
                          <td className="py-4 px-6 text-center">{renderSoStatusColumn(fin.id, "finance_leads", fin.soStatus)}</td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end items-center gap-2">
                              <a
                                href={`tel:${fin.phone}`}
                                className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-blue-450 hover:bg-slate-850 transition-all"
                                title="Call Customer"
                              >
                                <Phone className="h-3.5 w-3.5" />
                              </a>
                              <a
                                href={`https://wa.me/${fin.phone.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-emerald-450 hover:bg-slate-850 transition-all"
                                title="WhatsApp Customer"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                              </a>
                              {fin.status === "New Lead" && (
                                <button onClick={() => updateLeadStatus(fin.id, "finance_leads", "Processed")} className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs px-2.5 py-1 rounded">Mark Processed</button>
                              )}
                              <button onClick={() => handleDelete(fin.id, "finance_leads")} className="text-slate-500 hover:text-red-500 p-2"><Trash2 className="h-4 w-4" /></button>
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
                      <tr className="border-b border-slate-800/80 bg-slate-900/30 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-4 px-6">Submitted</th>
                        <th className="py-4 px-6">Customer</th>
                        <th className="py-4 px-6">Car Specs</th>
                        <th className="py-4 px-6">Year / KMs</th>
                        <th className="py-4 px-6">Images</th>
                        <th className="py-4 px-6">Assigned SO</th>
                        <th className="py-4 px-6 text-center">SO Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-300 divide-y divide-slate-800/40">
                      {filteredItems.map((ex: any) => (
                        <tr key={ex.id} className="hover:bg-slate-900/30 transition-colors">
                          <td className="py-4 px-6 font-mono text-xs text-slate-400">
                            {new Date(ex.submittedAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                          </td>
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              <div className="font-semibold text-white flex items-center gap-2">
                                {ex.fullName}
                                {renderVipBadge(ex.authEmail || ex.customerEmail, ex.phone)}
                              </div>
                              <div className="text-xs text-slate-500">{ex.phone}</div>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-semibold text-white">{ex.carMake} {ex.carModel}</td>
                          <td className="py-4 px-6 text-slate-400">{ex.registrationYear} / {ex.kmsDriven.toLocaleString()} KMs</td>
                          <td className="py-4 px-6">
                            {ex.images && ex.images.length > 0 ? (
                              <div className="flex gap-1.5 items-center">
                                <ImageIcon className="h-4 w-4 text-purple-400" />
                                <span className="text-xs font-bold text-purple-400">{ex.images.length} Photos</span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-500">No Media</span>
                            )}
                          </td>
                          <td className="py-4 px-6">{renderAssignmentColumn(ex.id, "exchange_leads", ex.assignedTo, ex.branch)}</td>
                          <td className="py-4 px-6 text-center">{renderSoStatusColumn(ex.id, "exchange_leads", ex.soStatus)}</td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end items-center gap-2">
                              <a
                                href={`tel:${ex.phone}`}
                                className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-blue-450 hover:bg-slate-850 transition-all"
                                title="Call Customer"
                              >
                                <Phone className="h-3.5 w-3.5" />
                              </a>
                              <a
                                href={`https://wa.me/${ex.phone.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-emerald-450 hover:bg-slate-850 transition-all"
                                title="WhatsApp Customer"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                              </a>
                              {ex.status === "New Lead" && (
                                <button onClick={() => updateLeadStatus(ex.id, "exchange_leads", "Evaluated")} className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs px-2.5 py-1 rounded">Mark Evaluated</button>
                              )}
                              <button onClick={() => handleDelete(ex.id, "exchange_leads")} className="text-slate-500 hover:text-red-500 p-2"><Trash2 className="h-4 w-4" /></button>
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
        )}

      </div>

      {/* 5. SMART ASSIGNMENT AUTCOMPLETE MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
            
            <button
              onClick={() => setShowAssignModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1.5 bg-slate-950/50 hover:bg-slate-950 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-[#EB0A1E]">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Assign Sales Officer</h3>
              <p className="text-xs text-slate-500">
                Dispatch this client lead to an active Sales Officer and choose their designated location branch.
              </p>
            </div>

            <form onSubmit={handleSaveAssignment} className="space-y-4">
              
              {/* Autocomplete Combobox */}
              <div className="space-y-1.5 relative">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Sales Officer Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Type name (e.g. Sanjay)"
                    value={soInput}
                    onChange={(e) => handleSoInputChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-colors font-semibold"
                  />
                  <Plus className="absolute right-3 top-2.5 w-4 h-4 text-slate-600 pointer-events-none" />
                </div>

                {soSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-slate-950 border border-slate-800 rounded-lg mt-1 max-h-32 overflow-y-auto divide-y divide-slate-900 text-xs shadow-xl">
                    {soSuggestions.map((name) => (
                      <li
                        key={name}
                        onClick={() => {
                          setSoInput(name);
                          setSoSuggestions([]);
                        }}
                        className="px-4 py-2 hover:bg-slate-900 cursor-pointer text-white transition-colors flex justify-between items-center"
                      >
                        <span>{name}</span>
                        <span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">Suggested</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Branch Locations Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Allotment Branch</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
                >
                  {OFFICIAL_BRANCHES.map((br) => (
                    <option key={br} value={br}>{br} Branch</option>
                  ))}
                  <option value="Other">Other (Specify Location)</option>
                </select>
              </div>

              {/* Custom Branch Override Input */}
              {selectedBranch === "Other" && (
                <div className="space-y-1.5 animate-slide-down">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Custom City/Location</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter custom branch city (e.g. Phulbani)"
                    value={customBranch}
                    onChange={(e) => setCustomBranch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-colors font-semibold"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isAssigning}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-red-600 to-red-500 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-xl hover:from-red-500 hover:to-red-400 disabled:opacity-50 transition-all duration-200"
              >
                {isAssigning ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Confirm Allotment"
                )}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

// Simple Helpers
function RefreshCwIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}

const updateLeadStatus = async (id: string, collectionName: string, newStatus: string) => {
  try {
    if (isConfigured) {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, { status: newStatus });
    }
  } catch (error) {
    console.error("Status Update Failed:", error);
  }
};
