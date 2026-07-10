"use client";

import React, { useEffect, useState, useMemo } from "react";
import { db, isConfigured } from "@/lib/firebase";
import { collection, getDocs, doc, addDoc, updateDoc } from "firebase/firestore";
import { VariantMaster, VehicleMaster } from "@/types/inventory";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  X,
  Settings
} from "lucide-react";

export default function VariantClient() {
  const [variants, setVariants] = useState<VariantMaster[]>([]);
  const [vehicles, setVehicles] = useState<VehicleMaster[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Draft" | "Archived">("All");

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [selectedVehicleName, setSelectedVehicleName] = useState("");
  const [name, setName] = useState("");
  const [engine, setEngine] = useState("");
  const [fuel, setFuel] = useState("Petrol");
  const [transmission, setTransmission] = useState("Manual");
  const [exShowroom, setExShowroom] = useState("");
  const [status, setStatus] = useState<"Active" | "Draft" | "Archived">("Active");

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      if (isConfigured) {
        const variantSnap = await getDocs(collection(db, "variants_master"));
        const vList: VariantMaster[] = [];
        variantSnap.forEach((d) => {
          vList.push({ id: d.id, ...d.data() } as VariantMaster);
        });
        setVariants(vList);

        const vehicleSnap = await getDocs(collection(db, "vehicles_master"));
        const vhList: VehicleMaster[] = [];
        vehicleSnap.forEach((d) => {
          vhList.push({ id: d.id, ...d.data() } as VehicleMaster);
        });
        setVehicles(vhList);
      } else {
        const localVariants = localStorage.getItem("lt_variants_master");
        if (localVariants) {
          setVariants(JSON.parse(localVariants));
        }
        const localVehicles = localStorage.getItem("lt_vehicles_master");
        if (localVehicles) setVehicles(JSON.parse(localVehicles));
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Load variants error:", err);
      showToast("Failed to load variants database: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchAllData = async () => {
      try {
        if (isConfigured) {
          const variantSnap = await getDocs(collection(db, "variants_master"));
          const vList: VariantMaster[] = [];
          variantSnap.forEach((d) => {
            vList.push({ id: d.id, ...d.data() } as VariantMaster);
          });
          if (isMounted) setVariants(vList);

          const vehicleSnap = await getDocs(collection(db, "vehicles_master"));
          const vhList: VehicleMaster[] = [];
          vehicleSnap.forEach((d) => {
            vhList.push({ id: d.id, ...d.data() } as VehicleMaster);
          });
          if (isMounted) setVehicles(vhList);
        } else {
          const localVariants = localStorage.getItem("lt_variants_master");
          if (localVariants && isMounted) {
            setVariants(JSON.parse(localVariants));
          } else if (isMounted) {
            const mockVariants: VariantMaster[] = [
              { id: "var-1", vehicleId: "fortuner-id", vehicleName: "Fortuner", name: "2.8L 4x4 AT", engine: "2755 cc", fuel: "Diesel", transmission: "Automatic", exShowroom: "₹42.60 Lakh", status: "Active" },
              { id: "var-2", vehicleId: "hycross-id", vehicleName: "Innova Hycross", name: "ZX (O) Hybrid", engine: "1987 cc", fuel: "Hybrid", transmission: "e-CVT", exShowroom: "₹30.98 Lakh", status: "Active" }
            ];
            localStorage.setItem("lt_variants_master", JSON.stringify(mockVariants));
            setVariants(mockVariants);
          }

          const localVehicles = localStorage.getItem("lt_vehicles_master");
          if (localVehicles && isMounted) setVehicles(JSON.parse(localVehicles));
        }
      } catch (error: unknown) {
        const err = error as Error;
        console.error("Load variants error in effect:", err);
        if (isMounted) showToast("Failed to load variants: " + err.message, "error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAllData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredVariants = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return variants.filter((v) => {
      const matchesSearch = 
        v.name.toLowerCase().includes(q) || 
        v.vehicleName.toLowerCase().includes(q) || 
        v.engine.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" ? v.status !== "Archived" : v.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [variants, searchQuery, statusFilter]);

  const handleVehicleChange = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    setSelectedVehicleName(vehicle ? vehicle.basicInfo.name : "");
  };

  const openForm = (variant?: VariantMaster) => {
    if (variant) {
      setEditingId(variant.id || null);
      setSelectedVehicleId(variant.vehicleId);
      setSelectedVehicleName(variant.vehicleName);
      setName(variant.name);
      setEngine(variant.engine);
      setFuel(variant.fuel);
      setTransmission(variant.transmission);
      setExShowroom(variant.exShowroom);
      setStatus(variant.status);
    } else {
      setEditingId(null);
      if (vehicles.length > 0) {
        setSelectedVehicleId(vehicles[0].id || "");
        setSelectedVehicleName(vehicles[0].basicInfo.name);
      } else {
        setSelectedVehicleId("");
        setSelectedVehicleName("");
      }
      setName("");
      setEngine("");
      setFuel("Petrol");
      setTransmission("Manual");
      setExShowroom("");
      setStatus("Active");
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedVehicleName) {
      showToast("Variant Name and Vehicle Model selection are required.", "error");
      return;
    }

    setSaving(true);
    try {
      const payload: VariantMaster = {
        vehicleId: selectedVehicleId,
        vehicleName: selectedVehicleName,
        name: name.trim(),
        engine: engine.trim(),
        fuel,
        transmission,
        exShowroom: exShowroom.trim(),
        status,
        updatedAt: new Date().toISOString()
      };

      if (editingId) {
        if (isConfigured) {
          await updateDoc(doc(db, "variants_master", editingId), { ...payload });
        } else {
          const updated = variants.map((v) => v.id === editingId ? { ...v, ...payload } : v);
          localStorage.setItem("lt_variants_master", JSON.stringify(updated));
        }
        showToast("Variant configuration updated!");
      } else {
        payload.createdAt = new Date().toISOString();
        if (isConfigured) {
          const docRef = await addDoc(collection(db, "variants_master"), payload);
          payload.id = docRef.id;
        } else {
          payload.id = `var-${Date.now()}`;
          const updated = [...variants, payload];
          localStorage.setItem("lt_variants_master", JSON.stringify(updated));
        }
        showToast("Variant configuration created!");
      }
      setIsFormOpen(false);
      loadData();
    } catch (error: unknown) {
      const err = error as Error;
      showToast("Error saving variant configuration: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      if (isConfigured) {
        await updateDoc(doc(db, "variants_master", id), { status: "Archived", updatedAt: new Date().toISOString() });
      } else {
        const updated = variants.map((v) => v.id === id ? { ...v, status: "Archived" as const, updatedAt: new Date().toISOString() } : v);
        localStorage.setItem("lt_variants_master", JSON.stringify(updated));
      }
      showToast("Variant soft deleted/archived successfully.");
      loadData();
    } catch (error: unknown) {
      const err = error as Error;
      showToast("Failed to archive variant: " + err.message, "error");
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
            <Settings className="text-[#EB0A1E] w-6 h-6" />
            Variant Master
          </h1>
          <p className="text-xs text-slate-400">Configure engine specs, fuel profiles, transmissions, prices, and status parameters for vehicle variants.</p>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 bg-[#EB0A1E] hover:bg-red-700 text-white font-semibold text-xs uppercase tracking-wider px-5 py-3 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Variant
        </button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-800 p-4 rounded-xl">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by variant name or vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#EB0A1E] transition-colors"
          />
        </div>

        <div className="flex gap-2 items-center">
          <span className="text-xs text-slate-400 shrink-0">Filter Status:</span>
          {["All", "Active", "Draft", "Archived"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st as "All" | "Active" | "Draft" | "Archived")}
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
          <span className="text-xs text-slate-400">Loading variant listings...</span>
        </div>
      ) : filteredVariants.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-16 text-center">
          <p className="text-sm text-slate-400">No variant configurations found.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  <th className="px-6 py-4">Variant Name</th>
                  <th className="px-6 py-4">Vehicle Model</th>
                  <th className="px-6 py-4">Engine Capacity</th>
                  <th className="px-6 py-4">Fuel & Transmission</th>
                  <th className="px-6 py-4">Ex-Showroom Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredVariants.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-white text-sm">{v.name}</td>
                    <td className="px-6 py-4 font-semibold text-slate-300">{v.vehicleName}</td>
                    <td className="px-6 py-4 text-slate-400 font-mono">{v.engine || "-"}</td>
                    <td className="px-6 py-4 text-slate-400">
                      <div className="flex flex-col gap-0.5">
                        <span>{v.fuel}</span>
                        <span className="text-[10px] text-slate-500">{v.transmission}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#F59E0B]">{v.exShowroom}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        v.status === "Active" 
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : v.status === "Draft"
                          ? "bg-amber-950 text-amber-400 border border-amber-800"
                          : "bg-red-950 text-red-400 border border-red-800"
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openForm(v)}
                        className="text-slate-400 hover:text-white p-1 transition-colors animate-none"
                      >
                        <Edit3 className="w-4 h-4 inline" />
                      </button>
                      {v.status !== "Archived" && (
                        <button
                          onClick={() => handleArchive(v.id!)}
                          className="text-slate-500 hover:text-red-400 p-1 transition-colors animate-none"
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

      {/* Form Drawer Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Settings className="text-[#EB0A1E] w-5 h-5" />
                {editingId ? "Edit Variant Parameters" : "Create Vehicle Variant"}
              </h2>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Vehicle Model</label>
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => handleVehicleChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="">Select Vehicle</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>{v.basicInfo.name}</option>
                    ))}
                    {vehicles.length === 0 && (
                      <>
                        <option value="fortuner-id">Fortuner</option>
                        <option value="hycross-id">Innova Hycross</option>
                      </>
                    )}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Variant Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. ZX (O) Hybrid"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EB0A1E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Engine Spec</label>
                  <input
                    type="text"
                    value={engine}
                    onChange={(e) => setEngine(e.target.value)}
                    placeholder="e.g. 1987 cc or 2.8L"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EB0A1E]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Ex-Showroom Price</label>
                  <input
                    type="text"
                    required
                    value={exShowroom}
                    onChange={(e) => setExShowroom(e.target.value)}
                    placeholder="e.g. ₹30.98 Lakh"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EB0A1E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Fuel Type</label>
                  <select
                    value={fuel}
                    onChange={(e) => setFuel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Transmission</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="CVT">CVT</option>
                    <option value="e-CVT">e-CVT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "Active" | "Draft" | "Archived")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#EB0A1E] hover:bg-red-700 text-white font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Variant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
