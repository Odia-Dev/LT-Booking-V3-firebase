"use client";

import React, { useEffect, useState, useMemo } from "react";
import { db, isConfigured } from "@/lib/firebase";
import { collection, getDocs, doc, addDoc, updateDoc, getDoc } from "firebase/firestore";
import { VehicleMaster } from "@/types/inventory";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Copy, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Car
} from "lucide-react";

function generateUniqueId(): string {
  return `vehicle-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export default function VehicleClient() {
  const [vehicles, setVehicles] = useState<VehicleMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Draft" | "Published" | "Archived">("All");

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadVehicles = async () => {
    setLoading(true);
    try {
      if (isConfigured) {
        const querySnap = await getDocs(collection(db, "vehicles_master"));
        const list: VehicleMaster[] = [];
        querySnap.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as VehicleMaster);
        });
        setVehicles(list);
      } else {
        const local = localStorage.getItem("lt_vehicles_master");
        if (local) {
          setVehicles(JSON.parse(local));
        }
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Load vehicles error:", err);
      showToast("Failed to load vehicle catalog: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchVehicles = async () => {
      try {
        if (isConfigured) {
          const querySnap = await getDocs(collection(db, "vehicles_master"));
          const list: VehicleMaster[] = [];
          querySnap.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as VehicleMaster);
          });
          if (isMounted) setVehicles(list);
        } else {
          const local = localStorage.getItem("lt_vehicles_master");
          if (local && isMounted) {
            setVehicles(JSON.parse(local));
          } else if (isMounted) {
            const mockVehicles: VehicleMaster[] = [
              {
                id: "vehicle-1",
                basicInfo: { brand: "Toyota", name: "Fortuner", slug: "fortuner", category: "SUV", shortDesc: "SUV legend.", longDesc: "SUV legend long description.", tagline: "Legendary SUV", launchYear: 2026, status: "Published", isFeatured: true },
                pricing: { startingPrice: "₹33.43 Lakh", bookingAmount: 50000, isRefundable: true, refundNotes: "" },
                seo: { title: "Toyota Fortuner", description: "Toyota Fortuner SUV", keywords: "Fortuner" },
                media: { heroImage: "", thumbnail: "", gallery: [], brochureUrl: "" },
                inventory: { stockStatus: "Available", totalUnits: 15, waitingPeriod: "4 Weeks", branches: [] },
                variants: [],
                colors: [],
                features: { safety: [], interior: [], exterior: [], technology: [] },
                offers: []
              },
              {
                id: "vehicle-2",
                basicInfo: { brand: "Toyota", name: "Innova Hycross", slug: "innova-hycross", category: "MPV", shortDesc: "Premium Hybrid MPV.", longDesc: "Premium Hybrid MPV long description.", tagline: "The Hycross Era", launchYear: 2026, status: "Published", isFeatured: true },
                pricing: { startingPrice: "₹19.77 Lakh", bookingAmount: 50000, isRefundable: true, refundNotes: "" },
                seo: { title: "Innova Hycross", description: "Innova Hycross MPV", keywords: "Hycross" },
                media: { heroImage: "", thumbnail: "", gallery: [], brochureUrl: "" },
                inventory: { stockStatus: "Available", totalUnits: 25, waitingPeriod: "8 Weeks", branches: [] },
                variants: [],
                colors: [],
                features: { safety: [], interior: [], exterior: [], technology: [] },
                offers: []
              }
            ];
            localStorage.setItem("lt_vehicles_master", JSON.stringify(mockVehicles));
            setVehicles(mockVehicles);
          }
        }
      } catch (error: unknown) {
        const err = error as Error;
        console.error("Error fetching vehicles in effect:", err);
        if (isMounted) showToast("Failed to load vehicle catalog: " + err.message, "error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchVehicles();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredVehicles = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return vehicles.filter((v) => {
      const nameMatch = v.basicInfo?.name?.toLowerCase().includes(q) || v.basicInfo?.slug?.toLowerCase().includes(q);
      const statusMatch = statusFilter === "All" 
        ? v.basicInfo?.status !== "Archived" 
        : v.basicInfo?.status === statusFilter;
      return nameMatch && statusMatch;
    });
  }, [vehicles, searchQuery, statusFilter]);

  // Duplicate vehicle
  const handleDuplicate = async (id: string) => {
    setActionId(id);
    try {
      if (isConfigured) {
        const docRef = doc(db, "vehicles_master", id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          showToast("Source vehicle not found.", "error");
          return;
        }
        const sourceData = docSnap.data() as VehicleMaster;
        const duplicatePayload: VehicleMaster = {
          ...sourceData,
          basicInfo: {
            ...sourceData.basicInfo,
            name: `${sourceData.basicInfo.name} (Copy)`,
            slug: `${sourceData.basicInfo.slug}-copy`,
            status: "Draft",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const newDoc = await addDoc(collection(db, "vehicles_master"), duplicatePayload);
        console.log("Duplicated to document:", newDoc.id);
        showToast("Vehicle configuration duplicated successfully!");
      } else {
        const source = vehicles.find((v) => v.id === id);
        if (!source) return;
        const clone: VehicleMaster = {
          ...source,
          id: generateUniqueId(),
          basicInfo: {
            ...source.basicInfo,
            name: `${source.basicInfo.name} (Copy)`,
            slug: `${source.basicInfo.slug}-copy`,
            status: "Draft",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updated = [...vehicles, clone];
        localStorage.setItem("lt_vehicles_master", JSON.stringify(updated));
        showToast("Vehicle configuration duplicated!");
      }
      loadVehicles();
    } catch (error: unknown) {
      const err = error as Error;
      showToast("Failed to duplicate: " + err.message, "error");
    } finally {
      setActionId(null);
    }
  };

  // Soft delete / Archive
  const handleArchive = async (id: string) => {
    setActionId(id);
    try {
      if (isConfigured) {
        await updateDoc(doc(db, "vehicles_master", id), {
          "basicInfo.status": "Archived",
          updatedAt: new Date().toISOString()
        });
      } else {
        const updated = vehicles.map((v) => 
          v.id === id 
            ? { ...v, basicInfo: { ...v.basicInfo, status: "Archived" as const }, updatedAt: new Date().toISOString() } 
            : v
        );
        localStorage.setItem("lt_vehicles_master", JSON.stringify(updated));
      }
      showToast("Vehicle successfully archived.");
      loadVehicles();
    } catch (error: unknown) {
      const err = error as Error;
      showToast("Failed to archive: " + err.message, "error");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-semibold animate-in slide-in-from-top-4 duration-300 ${
          toast.type === "success" 
            ? "bg-slate-900 border-emerald-800 text-emerald-400" 
            : "bg-slate-900 border-red-800 text-red-400"
        }`}>
          {toast.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" /> : <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display flex items-center gap-2">
            <Car className="text-[#EB0A1E] w-6 h-6" />
            Vehicle Master List
          </h1>
          <p className="text-xs text-slate-400">View, search, edit, clone, and archive vehicles in the main database.</p>
        </div>
        <Link
          href="/admin/cms/vehicle/new"
          className="flex items-center gap-2 bg-[#EB0A1E] hover:bg-red-700 text-white font-semibold text-xs uppercase tracking-wider px-5 py-3 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Vehicle
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-800 p-4 rounded-xl">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by vehicle name or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#EB0A1E] transition-colors"
          />
        </div>

        <div className="flex gap-2 items-center">
          <span className="text-xs text-slate-400 shrink-0">Filter Status:</span>
          {["All", "Published", "Draft", "Archived"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st as "All" | "Draft" | "Published" | "Archived")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st
                  ? "bg-slate-800 text-white border border-slate-700"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* List Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-[#EB0A1E] animate-spin" />
          <span className="text-xs text-slate-400">Loading catalog database...</span>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-16 text-center">
          <p className="text-sm text-slate-400">No vehicles match the filter criteria.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  <th className="px-6 py-4">Vehicle Model</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Starting Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredVehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-white text-sm">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-slate-500" />
                        <span>{v.basicInfo?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-400">{v.basicInfo?.slug}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-400 border border-slate-800">
                        {v.basicInfo?.category || "SUV"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#F59E0B]">{v.pricing?.startingPrice || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        v.basicInfo?.status === "Published" 
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : v.basicInfo?.status === "Draft"
                          ? "bg-amber-950 text-amber-400 border border-amber-800"
                          : "bg-red-950 text-red-400 border border-red-800"
                      }`}>
                        {v.basicInfo?.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/admin/cms/vehicle/${v.id}/edit`}
                        className="text-slate-400 hover:text-white p-1 transition-colors inline-block"
                        title="Edit Config"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDuplicate(v.id!)}
                        disabled={actionId === v.id}
                        className="text-slate-400 hover:text-white p-1 transition-colors disabled:opacity-50"
                        title="Duplicate Config"
                      >
                        {actionId === v.id ? <Loader2 className="w-4 h-4 animate-spin inline" /> : <Copy className="w-4 h-4 inline" />}
                      </button>
                      {v.basicInfo?.status !== "Archived" && (
                        <button
                          onClick={() => handleArchive(v.id!)}
                          disabled={actionId === v.id}
                          className="text-slate-500 hover:text-red-400 p-1 transition-colors disabled:opacity-50"
                          title="Archive"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
