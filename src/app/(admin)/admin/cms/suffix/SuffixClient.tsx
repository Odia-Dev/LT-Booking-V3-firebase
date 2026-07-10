"use client";

import React, { useEffect, useState, useMemo } from "react";
import { db, isConfigured } from "@/lib/firebase";
import { collection, getDocs, doc, addDoc, updateDoc } from "firebase/firestore";
import { ToyotaSuffix, VariantMaster, ToyotaColor, VehicleMaster } from "@/types/inventory";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  X,
  QrCode
} from "lucide-react";

export default function SuffixClient() {
  const [suffixes, setSuffixes] = useState<ToyotaSuffix[]>([]);
  const [vehicles, setVehicles] = useState<VehicleMaster[]>([]);
  const [variants, setVariants] = useState<VariantMaster[]>([]);
  const [colors, setColors] = useState<ToyotaColor[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Draft" | "Archived">("All");

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newSuffix, setNewSuffix] = useState("");
  const [oldSuffix, setOldSuffix] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [fuel, setFuel] = useState("Petrol");
  const [interior, setInterior] = useState("");
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
        const suffixSnap = await getDocs(collection(db, "suffix_master"));
        const suffixList: ToyotaSuffix[] = [];
        suffixSnap.forEach((d) => {
          suffixList.push({ id: d.id, ...d.data() } as ToyotaSuffix);
        });
        setSuffixes(suffixList);

        const vehicleSnap = await getDocs(collection(db, "vehicles_master"));
        const vList: VehicleMaster[] = [];
        vehicleSnap.forEach((d) => {
          vList.push({ id: d.id, ...d.data() } as VehicleMaster);
        });
        setVehicles(vList);

        const variantSnap = await getDocs(collection(db, "variants_master"));
        const vrList: VariantMaster[] = [];
        variantSnap.forEach((d) => {
          vrList.push({ id: d.id, ...d.data() } as VariantMaster);
        });
        setVariants(vrList);

        const colorSnap = await getDocs(collection(db, "colors_master"));
        const cList: ToyotaColor[] = [];
        colorSnap.forEach((d) => {
          cList.push({ id: d.id, ...d.data() } as ToyotaColor);
        });
        setColors(cList);
      } else {
        const localSuffix = localStorage.getItem("lt_suffix_master");
        if (localSuffix) {
          setSuffixes(JSON.parse(localSuffix));
        }
        const localVehicles = localStorage.getItem("lt_vehicles_master");
        if (localVehicles) setVehicles(JSON.parse(localVehicles));
        const localVariants = localStorage.getItem("lt_variants_master");
        if (localVariants) setVariants(JSON.parse(localVariants));
        const localColors = localStorage.getItem("lt_colors_master");
        if (localColors) setColors(JSON.parse(localColors));
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Load suffix data error:", err);
      showToast("Failed to load suffix configurations: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchAllData = async () => {
      try {
        if (isConfigured) {
          const suffixSnap = await getDocs(collection(db, "suffix_master"));
          const suffixList: ToyotaSuffix[] = [];
          suffixSnap.forEach((d) => {
            suffixList.push({ id: d.id, ...d.data() } as ToyotaSuffix);
          });
          if (isMounted) setSuffixes(suffixList);

          const vehicleSnap = await getDocs(collection(db, "vehicles_master"));
          const vList: VehicleMaster[] = [];
          vehicleSnap.forEach((d) => {
            vList.push({ id: d.id, ...d.data() } as VehicleMaster);
          });
          if (isMounted) setVehicles(vList);

          const variantSnap = await getDocs(collection(db, "variants_master"));
          const vrList: VariantMaster[] = [];
          variantSnap.forEach((d) => {
            vrList.push({ id: d.id, ...d.data() } as VariantMaster);
          });
          if (isMounted) setVariants(vrList);

          const colorSnap = await getDocs(collection(db, "colors_master"));
          const cList: ToyotaColor[] = [];
          colorSnap.forEach((d) => {
            cList.push({ id: d.id, ...d.data() } as ToyotaColor);
          });
          if (isMounted) setColors(cList);
        } else {
          const localSuffix = localStorage.getItem("lt_suffix_master");
          if (localSuffix && isMounted) {
            setSuffixes(JSON.parse(localSuffix));
          } else if (isMounted) {
            const mockSuffixes: ToyotaSuffix[] = [
              { id: "suf-1", newSuffix: "A1", oldSuffix: "REF-OLD-A1", vehicle: "Fortuner", variant: "2.8L 4x4 AT", color: "Attitude Black Mica", fuel: "Diesel", interior: "Chamoise", status: "Active" },
              { id: "suf-2", newSuffix: "B2", oldSuffix: "REF-OLD-B2", vehicle: "Innova Hycross", variant: "ZX (O) Hybrid", color: "Platinum White Pearl", fuel: "Hybrid", interior: "Dark Chestnut", status: "Active" }
            ];
            localStorage.setItem("lt_suffix_master", JSON.stringify(mockSuffixes));
            setSuffixes(mockSuffixes);
          }

          const localVehicles = localStorage.getItem("lt_vehicles_master");
          if (localVehicles && isMounted) setVehicles(JSON.parse(localVehicles));

          const localVariants = localStorage.getItem("lt_variants_master");
          if (localVariants && isMounted) setVariants(JSON.parse(localVariants));

          const localColors = localStorage.getItem("lt_colors_master");
          if (localColors && isMounted) setColors(JSON.parse(localColors));
        }
      } catch (error: unknown) {
        const err = error as Error;
        console.error("Load suffix data error in effect:", err);
        if (isMounted) showToast("Failed to load suffix data: " + err.message, "error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAllData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredSuffixes = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return suffixes.filter((s) => {
      const matchesSearch = 
        s.newSuffix.toLowerCase().includes(q) || 
        s.vehicle.toLowerCase().includes(q) || 
        s.variant.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" ? s.status !== "Archived" : s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [suffixes, searchQuery, statusFilter]);

  const openForm = (suffix?: ToyotaSuffix) => {
    if (suffix) {
      setEditingId(suffix.id || null);
      setNewSuffix(suffix.newSuffix);
      setOldSuffix(suffix.oldSuffix);
      setSelectedVehicle(suffix.vehicle);
      setSelectedVariant(suffix.variant);
      setSelectedColor(suffix.color);
      setFuel(suffix.fuel);
      setInterior(suffix.interior);
      setStatus(suffix.status);
    } else {
      setEditingId(null);
      setNewSuffix("");
      setOldSuffix("");
      setSelectedVehicle(vehicles[0]?.basicInfo?.name || "");
      setSelectedVariant(variants[0]?.name || "");
      setSelectedColor(colors[0]?.colorName || "");
      setFuel("Petrol");
      setInterior("");
      setStatus("Active");
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSuffix.trim() || !selectedVehicle || !selectedVariant) {
      showToast("New Suffix, Vehicle, and Variant are required.", "error");
      return;
    }

    setSaving(true);
    try {
      const payload: ToyotaSuffix = {
        newSuffix: newSuffix.trim(),
        oldSuffix: oldSuffix.trim(),
        vehicle: selectedVehicle,
        variant: selectedVariant,
        color: selectedColor,
        fuel,
        interior: interior.trim(),
        status,
        updatedAt: new Date().toISOString()
      };

      if (editingId) {
        if (isConfigured) {
          await updateDoc(doc(db, "suffix_master", editingId), { ...payload });
        } else {
          const updated = suffixes.map((s) => s.id === editingId ? { ...s, ...payload } : s);
          localStorage.setItem("lt_suffix_master", JSON.stringify(updated));
        }
        showToast("Suffix mapping updated successfully!");
      } else {
        payload.createdAt = new Date().toISOString();
        if (isConfigured) {
          const docRef = await addDoc(collection(db, "suffix_master"), payload);
          payload.id = docRef.id;
        } else {
          payload.id = `suf-${Date.now()}`;
          const updated = [...suffixes, payload];
          localStorage.setItem("lt_suffix_master", JSON.stringify(updated));
        }
        showToast("Suffix mapping created successfully!");
      }
      setIsFormOpen(false);
      loadData();
    } catch (error: unknown) {
      const err = error as Error;
      showToast("Error saving suffix mapping: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      if (isConfigured) {
        await updateDoc(doc(db, "suffix_master", id), { status: "Archived", updatedAt: new Date().toISOString() });
      } else {
        const updated = suffixes.map((s) => s.id === id ? { ...s, status: "Archived" as const, updatedAt: new Date().toISOString() } : s);
        localStorage.setItem("lt_suffix_master", JSON.stringify(updated));
      }
      showToast("Suffix mapping successfully archived.");
      loadData();
    } catch (error: unknown) {
      const err = error as Error;
      showToast("Failed to archive: " + err.message, "error");
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
            <QrCode className="text-[#EB0A1E] w-6 h-6" />
            Toyota Suffix Master
          </h1>
          <p className="text-xs text-slate-400">Map internal Toyota suffix codes to specific models, variants, colors, and interior specs.</p>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 bg-[#EB0A1E] hover:bg-red-700 text-white font-semibold text-xs uppercase tracking-wider px-5 py-3 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Suffix Mapping
        </button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-800 p-4 rounded-xl">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by suffix, vehicle, or variant..."
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
          <span className="text-xs text-slate-400">Loading suffix database...</span>
        </div>
      ) : filteredSuffixes.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-16 text-center">
          <p className="text-sm text-slate-400">No suffix configurations found.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  <th className="px-6 py-4">New Suffix (Primary)</th>
                  <th className="px-6 py-4">Old Suffix</th>
                  <th className="px-6 py-4">Vehicle Model</th>
                  <th className="px-6 py-4">Variant</th>
                  <th className="px-6 py-4">Color</th>
                  <th className="px-6 py-4">Fuel & Interior</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredSuffixes.map((suf) => (
                  <tr key={suf.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-white text-sm">{suf.newSuffix}</td>
                    <td className="px-6 py-4 font-mono text-slate-500">{suf.oldSuffix || "-"}</td>
                    <td className="px-6 py-4 font-semibold text-slate-200">{suf.vehicle}</td>
                    <td className="px-6 py-4 text-slate-300">{suf.variant}</td>
                    <td className="px-6 py-4 text-slate-400">{suf.color || "-"}</td>
                    <td className="px-6 py-4 text-slate-400">
                      <div className="flex flex-col gap-0.5">
                        <span>{suf.fuel}</span>
                        <span className="text-[10px] text-slate-500">Int: {suf.interior || "Standard"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        suf.status === "Active" 
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : suf.status === "Draft"
                          ? "bg-amber-950 text-amber-400 border border-amber-800"
                          : "bg-red-950 text-red-400 border border-red-800"
                      }`}>
                        {suf.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openForm(suf)}
                        className="text-slate-400 hover:text-white p-1 transition-colors animate-none"
                      >
                        <Edit3 className="w-4 h-4 inline" />
                      </button>
                      {suf.status !== "Archived" && (
                        <button
                          onClick={() => handleArchive(suf.id!)}
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
                <QrCode className="text-[#EB0A1E] w-5 h-5" />
                {editingId ? "Edit Suffix Mapping" : "Create Suffix Mapping"}
              </h2>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">New Suffix (Primary)</label>
                  <input
                    type="text"
                    required
                    value={newSuffix}
                    onChange={(e) => setNewSuffix(e.target.value)}
                    placeholder="e.g. A1"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EB0A1E]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Old Suffix (Hidden ref)</label>
                  <input
                    type="text"
                    value={oldSuffix}
                    onChange={(e) => setOldSuffix(e.target.value)}
                    placeholder="e.g. REF-OLD-A1"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EB0A1E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Vehicle</label>
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="">Select Vehicle</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.basicInfo.name}>{v.basicInfo.name}</option>
                    ))}
                    {vehicles.length === 0 && (
                      <>
                        <option value="Fortuner">Fortuner</option>
                        <option value="Innova Hycross">Innova Hycross</option>
                        <option value="Glanza">Glanza</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Variant</label>
                  <select
                    value={selectedVariant}
                    onChange={(e) => setSelectedVariant(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="">Select Variant</option>
                    {variants
                      .filter((v) => !selectedVehicle || v.vehicleName === selectedVehicle)
                      .map((v) => (
                        <option key={v.id} value={v.name}>{v.name}</option>
                      ))}
                    {variants.length === 0 && (
                      <>
                        <option value="2.8L 4x4 AT">2.8L 4x4 AT</option>
                        <option value="ZX (O) Hybrid">ZX (O) Hybrid</option>
                        <option value="V MT">V MT</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Color</label>
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="">Select Color</option>
                    {colors.map((c) => (
                      <option key={c.id} value={c.colorName}>{c.colorName}</option>
                    ))}
                    {colors.length === 0 && (
                      <>
                        <option value="Attitude Black Mica">Attitude Black Mica</option>
                        <option value="Platinum White Pearl">Platinum White Pearl</option>
                        <option value="Super White">Super White</option>
                      </>
                    )}
                  </select>
                </div>

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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Interior Color / Spec</label>
                  <input
                    type="text"
                    value={interior}
                    onChange={(e) => setInterior(e.target.value)}
                    placeholder="e.g. Chamoise or Black"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EB0A1E]"
                  />
                </div>

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
                  Save Suffix
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
