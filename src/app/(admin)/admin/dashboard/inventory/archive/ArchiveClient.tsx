"use client";

import React, { useEffect, useState, useMemo } from "react";
import { db, isConfigured } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { logStockMovement } from "@/lib/inventoryLogger";
import { 
  Archive, 
  Search, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  RotateCcw
} from "lucide-react";

interface VehicleStockRecord {
  id?: string;
  vehicle: string;
  variant: string;
  color: string;
  vin: string;
  engineNo: string;
  chassisNo: string;
  mfgMonthYear: string;
  branch: string;
  arrivalDate: string;
  status: "Available" | "PDI" | "Booked" | "Delivered" | "Archived";
  createdAt?: string;
  updatedAt?: string;
}

export default function ArchiveClient() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<VehicleStockRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoringVin, setRestoringVin] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadArchive = async () => {
    setLoading(true);
    try {
      if (isConfigured) {
        const querySnap = await getDocs(collection(db, "inventory_items"));
        const list: VehicleStockRecord[] = [];
        querySnap.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as VehicleStockRecord);
        });
        setVehicles(list);
      } else {
        const local = localStorage.getItem("lt_inventory_items");
        if (local) {
          setVehicles(JSON.parse(local));
        }
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Load archive error:", err);
      showToast("Failed to load archived vehicles: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchArchive = async () => {
      try {
        if (isConfigured) {
          const querySnap = await getDocs(collection(db, "inventory_items"));
          const list: VehicleStockRecord[] = [];
          querySnap.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as VehicleStockRecord);
          });
          if (isMounted) setVehicles(list);
        } else {
          const local = localStorage.getItem("lt_inventory_items");
          if (local && isMounted) {
            setVehicles(JSON.parse(local));
          }
        }
      } catch (error: unknown) {
        const err = error as Error;
        console.error("Load archive error in effect:", err);
        if (isMounted) showToast("Error loading archived vehicles: " + err.message, "error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchArchive();
    return () => {
      isMounted = false;
    };
  }, []);

  const archivedItems = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return vehicles.filter((item) => {
      if (item.status !== "Archived") return false;
      return (
        item.vin.toLowerCase().includes(q) ||
        item.vehicle.toLowerCase().includes(q) ||
        item.variant.toLowerCase().includes(q) ||
        item.color.toLowerCase().includes(q)
      );
    });
  }, [vehicles, searchQuery]);

  const handleRestore = async (item: VehicleStockRecord) => {
    setRestoringVin(item.vin);
    try {
      const oldStatus = item.status;
      const newStatus = "Available";

      if (isConfigured) {
        await updateDoc(doc(db, "inventory_items", item.vin), {
          status: newStatus,
          updatedAt: new Date().toISOString()
        });
      } else {
        const updatedList = vehicles.map((v) => 
          v.vin === item.vin 
            ? { ...v, status: "Available" as const, updatedAt: new Date().toISOString() } 
            : v
        );
        localStorage.setItem("lt_inventory_items", JSON.stringify(updatedList));
      }

      await logStockMovement(
        item.vin,
        oldStatus,
        newStatus,
        user?.email || "anonymous_edp",
        "Vehicle unit restored from operations archive"
      );

      showToast(`VIN ${item.vin} successfully restored to Available status.`);
      loadArchive();
    } catch (err: unknown) {
      const errorObj = err as Error;
      showToast("Failed to restore vehicle: " + errorObj.message, "error");
    } finally {
      setRestoringVin(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-display flex items-center gap-2">
          <Archive className="text-[#EB0A1E] w-6 h-6" />
          Inventory Archive
        </h1>
        <p className="text-xs text-slate-400">View soft-deleted or archived physical vehicles. Restore units back to active inventory.</p>
      </div>

      {/* Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-800 p-4 rounded-xl">
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search archived vehicles by VIN, Model, Variant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#EB0A1E] transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-[#EB0A1E] animate-spin" />
          <span className="text-xs text-slate-400">Loading archived records...</span>
        </div>
      ) : archivedItems.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-16 text-center">
          <p className="text-sm text-slate-400">No archived vehicles found.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  <th className="px-6 py-4">VIN Mapped</th>
                  <th className="px-6 py-4">Model Description</th>
                  <th className="px-6 py-4">Variant Spec</th>
                  <th className="px-6 py-4">Color</th>
                  <th className="px-6 py-4">Showroom Location</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs">
                {archivedItems.map((item) => (
                  <tr key={item.vin} className="hover:bg-slate-850 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-white">{item.vin}</td>
                    <td className="px-6 py-4 text-slate-200 font-semibold">{item.vehicle}</td>
                    <td className="px-6 py-4 text-slate-300">{item.variant}</td>
                    <td className="px-6 py-4 text-slate-400">{item.color}</td>
                    <td className="px-6 py-4 text-slate-400">{item.branch}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleRestore(item)}
                        disabled={restoringVin === item.vin}
                        className="inline-flex items-center gap-1.5 text-emerald-500 hover:text-emerald-400 transition-colors text-xs font-bold uppercase tracking-wider bg-emerald-950/40 px-3.5 py-2 border border-emerald-900 rounded-lg disabled:opacity-50"
                      >
                        {restoringVin === item.vin ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                        Restore
                      </button>
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
