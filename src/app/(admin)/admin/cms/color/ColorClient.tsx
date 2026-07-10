"use client";

import React, { useEffect, useState, useMemo } from "react";
import { db, isConfigured } from "@/lib/firebase";
import { collection, getDocs, doc, addDoc, updateDoc } from "firebase/firestore";
import { ToyotaColor } from "@/types/inventory";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  X,
  Palette
} from "lucide-react";

export default function ColorClient() {
  const [colors, setColors] = useState<ToyotaColor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Draft" | "Archived">("All");

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [colorCode, setColorCode] = useState("");
  const [colorName, setColorName] = useState("");
  const [hex, setHex] = useState("#000000");
  const [dualTone, setDualTone] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [status, setStatus] = useState<"Active" | "Draft" | "Archived">("Active");
  const [displayOrder, setDisplayOrder] = useState<number>(0);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch Colors Function for callbacks (non-synchronous mount)
  const loadColors = async () => {
    setLoading(true);
    try {
      if (isConfigured) {
        const q = collection(db, "colors_master");
        const querySnap = await getDocs(q);
        const list: ToyotaColor[] = [];
        querySnap.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as ToyotaColor);
        });
        setColors(list);
      } else {
        const local = localStorage.getItem("lt_colors_master");
        if (local) {
          setColors(JSON.parse(local));
        }
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Error loading colors:", err);
      showToast("Failed to load colors: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchColors = async () => {
      try {
        if (isConfigured) {
          const q = collection(db, "colors_master");
          const querySnap = await getDocs(q);
          const list: ToyotaColor[] = [];
          querySnap.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as ToyotaColor);
          });
          if (isMounted) setColors(list);
        } else {
          const local = localStorage.getItem("lt_colors_master");
          if (local && isMounted) {
            setColors(JSON.parse(local));
          } else {
            const mockColors: ToyotaColor[] = [
              { id: "col-1", colorCode: "089", colorName: "Platinum White Pearl", hex: "#f0f0f4", dualTone: false, primaryColor: "#f0f0f4", secondaryColor: "", status: "Active", displayOrder: 1 },
              { id: "col-2", colorCode: "218", colorName: "Attitude Black Mica", hex: "#0b0c10", dualTone: false, primaryColor: "#0b0c10", secondaryColor: "", status: "Active", displayOrder: 2 },
              { id: "col-3", colorCode: "2QY", colorName: "White Pearl & Black Dual Tone", hex: "#ffffff", dualTone: true, primaryColor: "#ffffff", secondaryColor: "#000000", status: "Active", displayOrder: 3 }
            ];
            localStorage.setItem("lt_colors_master", JSON.stringify(mockColors));
            if (isMounted) setColors(mockColors);
          }
        }
      } catch (error: unknown) {
        const err = error as Error;
        console.error("Error loading colors in effect:", err);
        if (isMounted) {
          showToast("Failed to load colors: " + err.message, "error");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchColors();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered List
  const filteredColors = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return colors.filter((color) => {
      const matchesSearch = color.colorName.toLowerCase().includes(q) || color.colorCode.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" ? color.status !== "Archived" : color.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [colors, searchQuery, statusFilter]);

  // Open form for Create / Edit
  const openForm = (color?: ToyotaColor) => {
    if (color) {
      setEditingId(color.id || null);
      setColorCode(color.colorCode);
      setColorName(color.colorName);
      setHex(color.hex);
      setDualTone(color.dualTone);
      setPrimaryColor(color.primaryColor);
      setSecondaryColor(color.secondaryColor || "");
      setStatus(color.status);
      setDisplayOrder(color.displayOrder);
    } else {
      setEditingId(null);
      setColorCode("");
      setColorName("");
      setHex("#000000");
      setDualTone(false);
      setPrimaryColor("#000000");
      setSecondaryColor("");
      setStatus("Active");
      setDisplayOrder(colors.length + 1);
    }
    setIsFormOpen(true);
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!colorCode.trim() || !colorName.trim()) {
      showToast("Color Code and Color Name are required.", "error");
      return;
    }

    setSaving(true);
    try {
      const payload: ToyotaColor = {
        colorCode: colorCode.trim(),
        colorName: colorName.trim(),
        hex,
        dualTone,
        primaryColor,
        secondaryColor: dualTone ? secondaryColor : "",
        status,
        displayOrder: Number(displayOrder),
        updatedAt: new Date().toISOString()
      };

      if (editingId) {
        // Update
        if (isConfigured) {
          const docRef = doc(db, "colors_master", editingId);
          await updateDoc(docRef, { ...payload });
        } else {
          const updated = colors.map((c) => c.id === editingId ? { ...c, ...payload } : c);
          localStorage.setItem("lt_colors_master", JSON.stringify(updated));
        }
        showToast("Color profile updated successfully!");
      } else {
        // Create
        payload.createdAt = new Date().toISOString();
        if (isConfigured) {
          const docRef = await addDoc(collection(db, "colors_master"), payload);
          payload.id = docRef.id;
        } else {
          payload.id = `col-${Date.now()}`;
          const updated = [...colors, payload];
          localStorage.setItem("lt_colors_master", JSON.stringify(updated));
        }
        showToast("Color profile created successfully!");
      }
      setIsFormOpen(false);
      loadColors();
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Save color error:", err);
      showToast(err.message || "Failed to save color master configuration.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Archive / Soft Delete
  const handleArchive = async (id: string) => {
    try {
      if (isConfigured) {
        const docRef = doc(db, "colors_master", id);
        await updateDoc(docRef, { status: "Archived", updatedAt: new Date().toISOString() });
      } else {
        const updated = colors.map((c) => c.id === id ? { ...c, status: "Archived" as const, updatedAt: new Date().toISOString() } : c);
        localStorage.setItem("lt_colors_master", JSON.stringify(updated));
      }
      showToast("Color successfully archived.");
      loadColors();
    } catch (error: unknown) {
      const err = error as Error;
      showToast("Failed to archive color: " + err.message, "error");
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
            <Palette className="text-[#EB0A1E] w-6 h-6" />
            Toyota Color Master
          </h1>
          <p className="text-xs text-slate-400">Configure exterior and interior color codes, hex properties, and dual-tone references.</p>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 bg-[#EB0A1E] hover:bg-red-700 text-white font-semibold text-xs uppercase tracking-wider px-5 py-3 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Color
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-800 p-4 rounded-xl">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by code or color name..."
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

      {/* Main List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-[#EB0A1E] animate-spin" />
          <span className="text-xs text-slate-400">Loading catalog master data...</span>
        </div>
      ) : filteredColors.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-16 text-center">
          <p className="text-sm text-slate-400">No color records match the filters.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  <th className="px-6 py-4">Display Order</th>
                  <th className="px-6 py-4">Color Code</th>
                  <th className="px-6 py-4">Color Name</th>
                  <th className="px-6 py-4">Visual Theme</th>
                  <th className="px-6 py-4">Dual Tone</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredColors
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((col) => (
                    <tr key={col.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-slate-400">{col.displayOrder}</td>
                      <td className="px-6 py-4 font-bold text-white">{col.colorCode}</td>
                      <td className="px-6 py-4 font-semibold text-slate-300">{col.colorName}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {col.dualTone ? (
                            <div className="flex w-7 h-7 rounded-full border border-slate-700 overflow-hidden shadow-inner shrink-0">
                              <span className="w-1/2" style={{ backgroundColor: col.primaryColor }} />
                              <span className="w-1/2" style={{ backgroundColor: col.secondaryColor }} />
                            </div>
                          ) : (
                            <span 
                              className="w-7 h-7 rounded-full border border-slate-700 shadow-inner shrink-0 inline-block" 
                              style={{ backgroundColor: col.hex }} 
                            />
                          )}
                          <span className="text-[10px] font-mono text-slate-500">{col.hex}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${col.dualTone ? "bg-amber-950 text-amber-400 border border-amber-800" : "bg-slate-950 text-slate-500 border border-slate-800"}`}>
                          {col.dualTone ? "Dual Tone" : "Single Tone"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          col.status === "Active" 
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : col.status === "Draft"
                            ? "bg-amber-950 text-amber-400 border border-amber-800"
                            : "bg-red-950 text-red-400 border border-red-800"
                        }`}>
                          {col.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openForm(col)}
                          className="text-slate-400 hover:text-white p-1 transition-colors"
                          title="Edit Config"
                        >
                          <Edit3 className="w-4 h-4 inline" />
                        </button>
                        {col.status !== "Archived" && (
                          <button
                            onClick={() => handleArchive(col.id!)}
                            className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                            title="Archive Record"
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

      {/* Form Drawer / Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Palette className="text-[#EB0A1E] w-5 h-5" />
                {editingId ? "Edit Toyota Color" : "Register Toyota Color"}
              </h2>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Color Code</label>
                  <input
                    type="text"
                    required
                    value={colorCode}
                    onChange={(e) => setColorCode(e.target.value)}
                    placeholder="e.g. 089 or 2QY"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EB0A1E]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Display Order</label>
                  <input
                    type="number"
                    required
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    placeholder="1, 2, 3..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EB0A1E]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Color Marketing Name</label>
                <input
                  type="text"
                  required
                  value={colorName}
                  onChange={(e) => setColorName(e.target.value)}
                  placeholder="e.g. Platinum White Pearl"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EB0A1E]"
                />
              </div>

              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Dual Tone Color Scheme</span>
                  <input
                    type="checkbox"
                    checked={dualTone}
                    onChange={(e) => setDualTone(e.target.checked)}
                    className="w-4 h-4 text-[#EB0A1E] bg-slate-900 border-slate-800 rounded focus:ring-0 cursor-pointer"
                  />
                </div>

                {!dualTone ? (
                  <div className="grid grid-cols-3 gap-3 items-center">
                    <div className="col-span-2 space-y-1">
                      <label className="text-[9px] uppercase font-bold text-slate-500">Hex Value</label>
                      <input
                        type="text"
                        value={hex}
                        onChange={(e) => {
                          setHex(e.target.value);
                          setPrimaryColor(e.target.value);
                        }}
                        placeholder="#ffffff"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1 text-center">
                      <label className="text-[9px] uppercase font-bold text-slate-500 block">Picker</label>
                      <input
                        type="color"
                        value={hex}
                        onChange={(e) => {
                          setHex(e.target.value);
                          setPrimaryColor(e.target.value);
                        }}
                        className="w-10 h-7 rounded border border-slate-800 bg-transparent cursor-pointer"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-slate-500 block">Primary Hex</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={primaryColor || "#ffffff"}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-8 h-8 rounded border border-slate-800 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-slate-500 block">Secondary Hex</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={secondaryColor || "#000000"}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="w-8 h-8 rounded border border-slate-800 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "Active" | "Draft" | "Archived")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
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
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#EB0A1E] hover:bg-red-700 text-white font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Color
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
