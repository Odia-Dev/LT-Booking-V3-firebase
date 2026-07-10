"use client";

import React, { useEffect, useState, useMemo } from "react";
import { db, isConfigured } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { logStockMovement } from "@/lib/inventoryLogger";
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Car,
  ShieldCheck,
  History,
  Archive,
  X
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

interface GroupedInventory {
  key: string; // "Variant - Color"
  vehicle: string;
  variant: string;
  color: string;
  totalCount: number;
  availableCount: number;
  pdiCount: number;
  bookedCount: number;
  deliveredCount: number;
  items: VehicleStockRecord[];
}

export default function InventoryListClient() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<VehicleStockRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingVin, setUpdatingVin] = useState<string | null>(null);

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");

  // Expand states for grouped rows
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Edit status modal/inline states
  const [editingItem, setEditingItem] = useState<VehicleStockRecord | null>(null);
  const [newStatus, setNewStatus] = useState<VehicleStockRecord["status"]>("Available");
  const [statusReason, setStatusReason] = useState("");
  const [bookingIdInput, setBookingIdInput] = useState("");

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadInventory = async () => {
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
        } else {
          setVehicles([]);
        }
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Load inventory error:", err);
      showToast("Failed to load inventory records: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchInventory = async () => {
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
        console.error("Load inventory error in effect:", err);
        if (isMounted) showToast("Error loading inventory: " + err.message, "error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInventory();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered physical items
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return vehicles.filter((item) => {
      // Exclude soft-deleted/archived items from standard view
      if (item.status === "Archived") return false;

      const matchesSearch = 
        item.vin.toLowerCase().includes(q) || 
        item.vehicle.toLowerCase().includes(q) || 
        item.variant.toLowerCase().includes(q) || 
        item.color.toLowerCase().includes(q) ||
        item.engineNo.toLowerCase().includes(q) ||
        item.chassisNo.toLowerCase().includes(q);

      const matchesBranch = branchFilter === "All" || item.branch === branchFilter;
      return matchesSearch && matchesBranch;
    });
  }, [vehicles, searchQuery, branchFilter]);

  // Group items by Variant & Color
  const groupedInventory = useMemo(() => {
    const groups: { [key: string]: GroupedInventory } = {};

    filteredItems.forEach((item) => {
      const key = `${item.vehicle} | ${item.variant} | ${item.color}`;
      if (!groups[key]) {
        groups[key] = {
          key,
          vehicle: item.vehicle,
          variant: item.variant,
          color: item.color,
          totalCount: 0,
          availableCount: 0,
          pdiCount: 0,
          bookedCount: 0,
          deliveredCount: 0,
          items: []
        };
      }

      const g = groups[key];
      g.totalCount += 1;
      g.items.push(item);

      if (item.status === "Available") g.availableCount += 1;
      else if (item.status === "PDI") g.pdiCount += 1;
      else if (item.status === "Booked") g.bookedCount += 1;
      else if (item.status === "Delivered") g.deliveredCount += 1;
    });

    return Object.values(groups);
  }, [filteredItems]);

  const toggleGroup = (key: string) => {
    const next = new Set(expandedGroups);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    setExpandedGroups(next);
  };

  const openStatusEditor = (item: VehicleStockRecord) => {
    setEditingItem(item);
    setNewStatus(item.status);
    setStatusReason("");
    setBookingIdInput("");
  };

  const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setUpdatingVin(editingItem.vin);
    try {
      const oldStatus = editingItem.status;
      const updatedItem: VehicleStockRecord = {
        ...editingItem,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };

      if (isConfigured) {
        await updateDoc(doc(db, "inventory_items", editingItem.vin), {
          status: newStatus,
          updatedAt: new Date().toISOString()
        });
      } else {
        const updatedList = vehicles.map((v) => v.vin === editingItem.vin ? updatedItem : v);
        localStorage.setItem("lt_inventory_items", JSON.stringify(updatedList));
      }

      // Log movement record
      await logStockMovement(
        editingItem.vin,
        oldStatus,
        newStatus,
        user?.email || "anonymous_edp",
        statusReason || `Status update from operations list view`,
        bookingIdInput || undefined
      );

      showToast(`VIN ${editingItem.vin} updated to status: ${newStatus}`);
      setEditingItem(null);
      loadInventory();
    } catch (err: unknown) {
      const errorObj = err as Error;
      showToast("Error updating vehicle status: " + errorObj.message, "error");
    } finally {
      setUpdatingVin(null);
    }
  };

  // Archive / Soft Delete individual item
  const handleArchiveItem = async (item: VehicleStockRecord) => {
    setUpdatingVin(item.vin);
    try {
      const oldStatus = item.status;
      const newStatus = "Archived";
      
      if (isConfigured) {
        await updateDoc(doc(db, "inventory_items", item.vin), {
          status: newStatus,
          updatedAt: new Date().toISOString()
        });
      } else {
        const updatedList = vehicles.map((v) => 
          v.vin === item.vin 
            ? { ...v, status: "Archived" as const, updatedAt: new Date().toISOString() } 
            : v
        );
        localStorage.setItem("lt_inventory_items", JSON.stringify(updatedList));
      }

      await logStockMovement(
        item.vin,
        oldStatus,
        newStatus,
        user?.email || "anonymous_edp",
        "Vehicle moved to soft-delete archive operations"
      );

      showToast(`VIN ${item.vin} successfully archived.`);
      loadInventory();
    } catch (err: unknown) {
      const errorObj = err as Error;
      showToast("Failed to archive: " + errorObj.message, "error");
    } finally {
      setUpdatingVin(null);
    }
  };

  const branches = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach(v => {
      if (v.branch) set.add(v.branch);
    });
    return Array.from(set);
  }, [vehicles]);

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
          <Car className="text-[#EB0A1E] w-6 h-6" />
          Vehicle Inventory View
        </h1>
        <p className="text-xs text-slate-400">Track and manage physical vehicle stock grouped by model variants and color specs.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-800 p-4 rounded-xl">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by VIN, Variant, Engine No..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#EB0A1E] transition-colors"
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <span className="text-xs text-slate-400 shrink-0">Filter Branch:</span>
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
          >
            <option value="All">All Showrooms</option>
            {branches.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grouped Table List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-[#EB0A1E] animate-spin" />
          <span className="text-xs text-slate-400">Loading catalog inventory...</span>
        </div>
      ) : groupedInventory.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-16 text-center">
          <p className="text-sm text-slate-400">No stock received matching the filter parameters.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden space-y-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  <th className="px-6 py-4 w-12"></th>
                  <th className="px-6 py-4">Model Description</th>
                  <th className="px-6 py-4">Variant Spec</th>
                  <th className="px-6 py-4">Color Scheme</th>
                  <th className="px-6 py-4 text-center">Available Stock</th>
                  <th className="px-6 py-4 text-right">Physical Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {groupedInventory.map((group) => {
                  const isExpanded = expandedGroups.has(group.key);
                  return (
                    <React.Fragment key={group.key}>
                      <tr 
                        onClick={() => toggleGroup(group.key)}
                        className="hover:bg-slate-850 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 text-center">
                          {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400 inline" /> : <ChevronRight className="w-4 h-4 text-slate-400 inline" />}
                        </td>
                        <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                          <Car className="w-4 h-4 text-[#EB0A1E]" />
                          <span>{group.vehicle}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-300 font-semibold">{group.variant}</td>
                        <td className="px-6 py-4 text-slate-400 font-medium">{group.color}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                            group.availableCount > 0 
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800" 
                              : "bg-slate-950 text-slate-500 border border-slate-800"
                          }`}>
                            {group.availableCount} Available
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-slate-400">
                          {group.totalCount} Units
                        </td>
                      </tr>

                      {/* Expandable physical records row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="bg-slate-950/80 p-0 border-b border-slate-850">
                            <div className="px-10 py-4 space-y-3">
                              <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-500 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-slate-400" />
                                Physical Vehicle Listings (VIN Mapped)
                              </h4>
                              
                              <div className="overflow-x-auto border border-slate-850 rounded-lg">
                                <table className="w-full text-left text-xs border-collapse">
                                  <thead>
                                    <tr className="bg-slate-900 border-b border-slate-850 text-[9px] uppercase font-bold text-slate-500">
                                      <th className="px-4 py-2">VIN</th>
                                      <th className="px-4 py-2">Engine No</th>
                                      <th className="px-4 py-2">Chassis No</th>
                                      <th className="px-4 py-2">Showroom Location</th>
                                      <th className="px-4 py-2">Intake Date</th>
                                      <th className="px-4 py-2">Status</th>
                                      <th className="px-4 py-2 text-right">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-850 text-[11px]">
                                    {group.items.map((item) => (
                                      <tr key={item.vin} className="hover:bg-slate-900/40">
                                        <td className="px-4 py-2 font-mono font-bold text-slate-200">{item.vin}</td>
                                        <td className="px-4 py-2 font-mono text-slate-400">{item.engineNo}</td>
                                        <td className="px-4 py-2 font-mono text-slate-400">{item.chassisNo}</td>
                                        <td className="px-4 py-2 text-slate-400">{item.branch}</td>
                                        <td className="px-4 py-2 text-slate-400">{item.arrivalDate}</td>
                                        <td className="px-4 py-2">
                                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                            item.status === "Available"
                                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                              : item.status === "PDI"
                                              ? "bg-blue-950 text-blue-400 border border-blue-800"
                                              : item.status === "Booked"
                                              ? "bg-amber-950 text-amber-400 border border-amber-800"
                                              : "bg-purple-950 text-purple-400 border border-purple-800"
                                          }`}>
                                            {item.status}
                                          </span>
                                        </td>
                                        <td className="px-4 py-2 text-right space-x-3">
                                          <button
                                            onClick={() => openStatusEditor(item)}
                                            disabled={updatingVin === item.vin}
                                            className="text-slate-400 hover:text-white transition-colors"
                                            title="Update status"
                                          >
                                            <History className="w-3.5 h-3.5 inline" />
                                          </button>
                                          <button
                                            onClick={() => handleArchiveItem(item)}
                                            disabled={updatingVin === item.vin}
                                            className="text-slate-500 hover:text-red-400 transition-colors"
                                            title="Archive Unit"
                                          >
                                            <Archive className="w-3.5 h-3.5 inline" />
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <History className="text-[#EB0A1E] w-5 h-5" />
                Change Vehicle Status
              </h2>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatusSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Target Vehicle VIN</span>
                <span className="text-xs font-mono font-bold text-white">{editingItem.vin}</span>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as "Available" | "PDI" | "Booked" | "Delivered" | "Archived")}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="Available">Available</option>
                  <option value="PDI">PDI (Pre-Delivery Inspection)</option>
                  <option value="Booked">Booked</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              {newStatus === "Booked" && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Associated Booking Reference ID</label>
                  <input
                    type="text"
                    required
                    value={bookingIdInput}
                    onChange={(e) => setBookingIdInput(e.target.value)}
                    placeholder="e.g. bSnap-12345"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Reason / Log Remarks</label>
                <textarea
                  required
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder="e.g. Unit allocated to booking, or in transit inspection"
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EB0A1E]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingVin === editingItem.vin}
                  className="flex items-center gap-2 bg-[#EB0A1E] hover:bg-red-700 text-white font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  {updatingVin === editingItem.vin && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
