"use client";

import React, { useEffect, useState, useMemo } from "react";
import { db, isConfigured } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { OfferRecord, OfferType, VehicleMaster, VariantMaster } from "@/types/inventory";
import {
  Plus,
  Search,
  Edit3,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  Tag,
  Send,
  Archive,
  Eye,
  EyeOff,
  Globe,
  ShoppingCart,
  LayoutGrid,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────

const STORAGE_KEY = "lt_offers_master";

const OFFER_TYPES: OfferType[] = [
  "Flat Discount",
  "Percentage Discount",
  "Free Accessory",
  "Free Insurance",
  "Extended Warranty",
  "Exchange Bonus",
  "Corporate Discount",
  "Other",
];

const BLANK_FORM: Omit<OfferRecord, "id"> = {
  title: "",
  description: "",
  offerType: "Flat Discount",
  amount: 0,
  vehicleId: "",
  vehicleName: "All Vehicles",
  variantId: "",
  variantName: "All Variants",
  priority: 10,
  startDate: "",
  endDate: "",
  isActive: true,
  showOnHomepage: true,
  showOnVehiclePage: true,
  showOnCheckout: false,
  status: "Draft",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAmount(offer: OfferRecord): string {
  if (offer.offerType === "Percentage Discount") return `${offer.amount}%`;
  if (offer.amount === 0) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(offer.amount);
}

function isExpired(endDate: string): boolean {
  if (!endDate) return false;
  return new Date(endDate) < new Date();
}

function isUpcoming(startDate: string): boolean {
  if (!startDate) return false;
  return new Date(startDate) > new Date();
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OffersClient() {
  const [offers, setOffers] = useState<OfferRecord[]>([]);
  const [vehicles, setVehicles] = useState<VehicleMaster[]>([]);
  const [variants, setVariants] = useState<VariantMaster[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Draft" | "Published" | "Archived">("All");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<OfferRecord, "id">>(BLANK_FORM);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const setField = <K extends keyof Omit<OfferRecord, "id">>(
    key: K,
    value: Omit<OfferRecord, "id">[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ── Filtered variants for selected vehicle ─────────────────────────────────
  const filteredVariants = useMemo(
    () => variants.filter((v) => v.vehicleId === form.vehicleId),
    [variants, form.vehicleId]
  );

  // ── Load Data (isMounted pattern) ─────────────────────────────────────────
  const fetchOffersData = async (isMounted: { current: boolean }) => {
    setLoading(true);
    try {
      if (isConfigured) {
        const [oSnap, vhSnap, vrSnap] = await Promise.all([
          getDocs(collection(db, "offers_master")),
          getDocs(collection(db, "vehicles_master")),
          getDocs(collection(db, "variants_master")),
        ]);

        const oList: OfferRecord[] = [];
        oSnap.forEach((d) => oList.push({ id: d.id, ...d.data() } as OfferRecord));

        const vhList: VehicleMaster[] = [];
        vhSnap.forEach((d) => vhList.push({ id: d.id, ...d.data() } as VehicleMaster));

        const vrList: VariantMaster[] = [];
        vrSnap.forEach((d) => vrList.push({ id: d.id, ...d.data() } as VariantMaster));

        if (isMounted.current) {
          setOffers(oList);
          setVehicles(vhList);
          setVariants(vrList);
        }
      } else {
        const localO = localStorage.getItem(STORAGE_KEY);
        const localVh = localStorage.getItem("lt_vehicles_master");
        const localVr = localStorage.getItem("lt_variants_master");
        if (isMounted.current) {
          setOffers(localO ? JSON.parse(localO) : []);
          setVehicles(localVh ? JSON.parse(localVh) : []);
          setVariants(localVr ? JSON.parse(localVr) : []);
        }
      }
    } catch (err: unknown) {
      if (isMounted.current) {
        showToast("Failed to load data: " + (err instanceof Error ? err.message : String(err)), "error");
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    const isMounted = { current: true };
    const run = async () => { await fetchOffersData(isMounted); };
    run();
    return () => { isMounted.current = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    const isMounted = { current: true };
    await fetchOffersData(isMounted);
  };

  // ── Open / Close form ─────────────────────────────────────────────────────
  const openCreate = () => {
    setForm(BLANK_FORM);
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEdit = (offer: OfferRecord) => {
    setForm({ ...offer });
    setEditingId(offer.id ?? null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(BLANK_FORM);
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async (targetStatus?: "Draft" | "Published" | "Archived") => {
    if (!form.title.trim()) {
      showToast("Offer title is required.", "error");
      return;
    }
    if (!form.startDate || !form.endDate) {
      showToast("Start Date and End Date are required.", "error");
      return;
    }
    if (new Date(form.startDate) > new Date(form.endDate)) {
      showToast("Start Date must be before End Date.", "error");
      return;
    }

    setSaving(true);
    try {
      const now = new Date().toISOString();
      const newStatus = targetStatus ?? form.status;
      const payload: Omit<OfferRecord, "id"> = {
        ...form,
        status: newStatus,
        updatedAt: now,
        ...(newStatus === "Published" && !form.publishedAt ? { publishedAt: now } : {}),
        ...(editingId ? {} : { createdAt: now }),
      };

      if (isConfigured) {
        if (editingId) {
          await updateDoc(doc(db, "offers_master", editingId), payload as Record<string, unknown>);
        } else {
          await addDoc(collection(db, "offers_master"), payload);
        }
      } else {
        const existing = localStorage.getItem(STORAGE_KEY);
        const list: OfferRecord[] = existing ? JSON.parse(existing) : [];
        if (editingId) {
          const idx = list.findIndex((o) => o.id === editingId);
          if (idx >= 0) list[idx] = { ...payload, id: editingId };
        } else {
          list.push({ ...payload, id: `local_${Date.now()}` });
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }

      showToast(
        editingId
          ? `Offer updated${newStatus === "Published" ? " & published" : ""}.`
          : "Offer created successfully.",
        "success"
      );
      closeForm();
      await loadData();
    } catch (err: unknown) {
      showToast("Save failed: " + (err instanceof Error ? err.message : String(err)), "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Quick status change ────────────────────────────────────────────────────
  const changeStatus = async (offer: OfferRecord, newStatus: "Published" | "Archived") => {
    if (!offer.id) return;
    try {
      const now = new Date().toISOString();
      const update: Partial<OfferRecord> = {
        status: newStatus,
        updatedAt: now,
        ...(newStatus === "Published" && !offer.publishedAt ? { publishedAt: now } : {}),
      };
      if (isConfigured) {
        await updateDoc(doc(db, "offers_master", offer.id), update as Record<string, unknown>);
      } else {
        const existing = localStorage.getItem(STORAGE_KEY);
        const list: OfferRecord[] = existing ? JSON.parse(existing) : [];
        const idx = list.findIndex((o) => o.id === offer.id);
        if (idx >= 0) list[idx] = { ...list[idx], ...update };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }
      showToast(`Offer ${newStatus.toLowerCase()} successfully.`);
      await loadData();
    } catch (err: unknown) {
      showToast("Status update failed: " + (err instanceof Error ? err.message : String(err)), "error");
    }
  };

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return offers
      .filter((o) => statusFilter === "All" || o.status === statusFilter)
      .filter((o) => {
        const q = searchQuery.toLowerCase();
        return (
          !q ||
          o.title.toLowerCase().includes(q) ||
          o.vehicleName.toLowerCase().includes(q) ||
          o.offerType.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.priority - b.priority || (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
  }, [offers, statusFilter, searchQuery]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold text-white animate-in slide-in-from-top duration-300 ${
          toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
        }`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Tag className="text-[#EB0A1E] w-6 h-6" />
            Offers Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">Create and publish promotional offers with date ranges and multi-surface visibility controls.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#EB0A1E] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" /> New Offer
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, vehicle, or offer type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-[#EB0A1E] transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["All", "Draft", "Published", "Archived"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all ${
                statusFilter === s
                  ? "bg-[#EB0A1E] text-white border-[#EB0A1E]"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Empty State */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3">
          <Loader2 className="w-7 h-7 text-[#EB0A1E] animate-spin" />
          <span className="text-sm text-slate-400">Loading offers...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <Tag className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-semibold">No offers found.</p>
          <p className="text-slate-600 text-xs mt-1">Click &ldquo;New Offer&rdquo; to create your first promotional offer.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/50">
                  <th className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Offer</th>
                  <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Vehicle / Variant</th>
                  <th className="text-center px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Type & Value</th>
                  <th className="text-center px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Date Range</th>
                  <th className="text-center px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Surfaces</th>
                  <th className="text-center px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="text-center px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((offer) => {
                  const expired = isExpired(offer.endDate);
                  const upcoming = isUpcoming(offer.startDate);
                  return (
                    <tr key={offer.id} className="hover:bg-slate-800/30 transition-colors group">
                      {/* Title */}
                      <td className="px-5 py-4 max-w-[200px]">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${offer.isActive ? "bg-emerald-400" : "bg-slate-600"}`} />
                          <div>
                            <p className="font-semibold text-white text-xs truncate">{offer.title}</p>
                            <p className="text-slate-500 text-[10px] mt-0.5">Priority: {offer.priority}</p>
                          </div>
                        </div>
                      </td>
                      {/* Vehicle */}
                      <td className="px-4 py-4">
                        <p className="text-xs text-slate-300 font-semibold">{offer.vehicleName}</p>
                        <p className="text-[10px] text-slate-500">{offer.variantName || "All Variants"}</p>
                      </td>
                      {/* Type & Amount */}
                      <td className="px-4 py-4 text-center">
                        <span className="inline-block text-[10px] font-bold text-amber-400 bg-amber-900/30 border border-amber-800 px-2 py-0.5 rounded-full">
                          {offer.offerType}
                        </span>
                        <p className="text-xs font-black text-white mt-1 font-mono">{formatAmount(offer)}</p>
                      </td>
                      {/* Date Range */}
                      <td className="px-4 py-4 text-center">
                        <p className="text-[10px] text-slate-400 font-mono">
                          {offer.startDate ? new Date(offer.startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—"}
                          {" → "}
                          {offer.endDate ? new Date(offer.endDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" }) : "—"}
                        </p>
                        {expired && <span className="text-[9px] text-red-400 font-bold uppercase">Expired</span>}
                        {upcoming && !expired && <span className="text-[9px] text-sky-400 font-bold uppercase">Upcoming</span>}
                        {!expired && !upcoming && offer.startDate && <span className="text-[9px] text-emerald-400 font-bold uppercase">Live</span>}
                      </td>
                      {/* Surfaces */}
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <span title="Homepage" className={`${offer.showOnHomepage ? "text-emerald-400" : "text-slate-700"}`}>
                            <Globe className="w-3.5 h-3.5" />
                          </span>
                          <span title="Vehicle Page" className={`${offer.showOnVehiclePage ? "text-emerald-400" : "text-slate-700"}`}>
                            <LayoutGrid className="w-3.5 h-3.5" />
                          </span>
                          <span title="Checkout" className={`${offer.showOnCheckout ? "text-emerald-400" : "text-slate-700"}`}>
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          offer.status === "Published"
                            ? "bg-emerald-900/60 text-emerald-400 border border-emerald-800"
                            : offer.status === "Draft"
                            ? "bg-amber-900/40 text-amber-400 border border-amber-800"
                            : "bg-slate-800 text-slate-500 border border-slate-700"
                        }`}>
                          {offer.status}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openEdit(offer)} title="Edit" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {offer.status === "Draft" && (
                            <button onClick={() => changeStatus(offer, "Published")} title="Publish" className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-900/30 rounded-lg transition-all">
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {offer.status === "Published" && (
                            <button onClick={() => changeStatus(offer, "Archived")} title="Archive" className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition-all">
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Slide-in Form Panel ─────────────────────────────────────────────── */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-slate-950/80 backdrop-blur-sm" onClick={closeForm} />
          <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full overflow-y-auto shadow-2xl flex flex-col">

            {/* Panel Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-10">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  {editingId ? "Edit Offer" : "New Offer"}
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Configure the offer details, targeting, and visibility.</p>
              </div>
              <button onClick={closeForm} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Panel Body */}
            <div className="p-6 space-y-6 flex-1">

              {/* Basic Info */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#EB0A1E] border-b border-slate-800 pb-2">Offer Details</h3>

                {/* Title */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                    Offer Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. July Monsoon Offer — ₹25,000 Off"
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#EB0A1E] transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Short description shown on vehicle/offer pages..."
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#EB0A1E] transition-colors resize-none"
                  />
                </div>

                {/* Offer Type + Amount */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Offer Type</label>
                    <select
                      value={form.offerType}
                      onChange={(e) => setField("offerType", e.target.value as OfferType)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#EB0A1E] transition-colors"
                    >
                      {OFFER_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                      {form.offerType === "Percentage Discount" ? "Percentage (%)" : "Amount (₹)"}
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.amount}
                      onChange={(e) => setField("amount", parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#EB0A1E] transition-colors"
                    />
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                    Display Priority <span className="text-slate-600 normal-case tracking-normal font-normal">(1 = highest, shown first)</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={form.priority}
                    onChange={(e) => setField("priority", parseInt(e.target.value) || 10)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#EB0A1E] transition-colors"
                  />
                </div>
              </section>

              {/* Vehicle Targeting */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#EB0A1E] border-b border-slate-800 pb-2">Vehicle Targeting</h3>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Target Vehicle</label>
                  <select
                    value={form.vehicleId}
                    onChange={(e) => {
                      const v = vehicles.find((vh) => vh.id === e.target.value);
                      setForm((prev) => ({
                        ...prev,
                        vehicleId: e.target.value,
                        vehicleName: e.target.value === "" ? "All Vehicles" : (v?.basicInfo?.name ?? e.target.value),
                        variantId: "",
                        variantName: "All Variants",
                      }));
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#EB0A1E] transition-colors"
                  >
                    <option value="">All Vehicles</option>
                    {vehicles.map((vh) => (
                      <option key={vh.id} value={vh.id}>{vh.basicInfo?.name ?? vh.id}</option>
                    ))}
                  </select>
                </div>

                {form.vehicleId && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Target Variant</label>
                    <select
                      value={form.variantId}
                      onChange={(e) => {
                        const vr = variants.find((v) => v.id === e.target.value);
                        setField("variantId", e.target.value);
                        setField("variantName", e.target.value === "" ? "All Variants" : (vr?.name ?? e.target.value));
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#EB0A1E] transition-colors"
                    >
                      <option value="">All Variants</option>
                      {filteredVariants.map((vr) => (
                        <option key={vr.id} value={vr.id}>{vr.name} ({vr.fuel} / {vr.transmission})</option>
                      ))}
                    </select>
                  </div>
                )}
              </section>

              {/* Date Range */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#EB0A1E] border-b border-slate-800 pb-2">Validity Period</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                      Start Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setField("startDate", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#EB0A1E] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                      End Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => setField("endDate", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#EB0A1E] transition-colors"
                    />
                  </div>
                </div>
              </section>

              {/* Visibility Toggles */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#EB0A1E] border-b border-slate-800 pb-2">Visibility & Surfaces</h3>

                {[
                  { key: "showOnHomepage" as const, label: "Show on Homepage", desc: "Appears in the Offers section on the landing page.", icon: Globe },
                  { key: "showOnVehiclePage" as const, label: "Show on Vehicle Pages", desc: "Appears on individual vehicle detail pages.", icon: LayoutGrid },
                  { key: "showOnCheckout" as const, label: "Show at Checkout", desc: "Displayed on the booking checkout confirmation screen.", icon: ShoppingCart },
                  { key: "isActive" as const, label: "Offer Active", desc: "Inactive offers are hidden even when Published.", icon: Eye },
                ].map(({ key, label, desc, icon: Icon }) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${(form as Record<string, unknown>)[key] ? "text-emerald-400" : "text-slate-600"}`} />
                      <div>
                        <p className="text-xs font-bold text-white">{label}</p>
                        <p className="text-[11px] text-slate-500">{desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setField(key, !(form as Record<string, unknown>)[key] as boolean)}
                      className={`relative w-11 h-6 rounded-full transition-all ${(form as Record<string, unknown>)[key] ? "bg-emerald-600" : "bg-slate-700"}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${(form as Record<string, unknown>)[key] ? "left-6" : "left-1"}`} />
                    </button>
                  </div>
                ))}
              </section>

              {/* Workflow Status */}
              <section className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#EB0A1E] border-b border-slate-800 pb-2">Workflow Status</h3>
                <div className="flex gap-3">
                  {(["Draft", "Published", "Archived"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setField("status", s)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                        form.status === s
                          ? s === "Published"
                            ? "bg-emerald-900/60 border-emerald-700 text-emerald-400"
                            : s === "Archived"
                            ? "bg-slate-800 border-slate-600 text-slate-300"
                            : "bg-amber-900/40 border-amber-700 text-amber-400"
                          : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {form.status === "Published" && (
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Offer will be visible on all enabled surfaces once published.
                  </p>
                )}
                {form.status === "Archived" && (
                  <p className="text-[10px] text-slate-500 flex items-center gap-1">
                    <EyeOff className="w-3 h-3" /> Archived offers are hidden from all surfaces.
                  </p>
                )}
              </section>
            </div>

            {/* Panel Footer */}
            <div className="px-6 py-5 border-t border-slate-800 bg-slate-950/60 sticky bottom-0 flex gap-3">
              <button
                onClick={closeForm}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave("Draft")}
                disabled={saving}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
              >
                Save Draft
              </button>
              <button
                onClick={() => handleSave("Published")}
                disabled={saving}
                className="flex-1 py-3 bg-[#EB0A1E] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                {saving ? "Saving..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
