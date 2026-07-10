"use client";

import React, { useEffect, useState, useMemo } from "react";
import { db, isConfigured } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { PricingRecord, VariantMaster, VehicleMaster } from "@/types/inventory";
import {
  Plus,
  Search,
  Edit3,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  IndianRupee,
  Send,
  Archive,
  Eye,
} from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "lt_pricing_master";

function calcOnRoad(r: Partial<PricingRecord>): number {
  return (
    (r.exShowroom ?? 0) +
    (r.roadTax ?? 0) +
    (r.insurance ?? 0) +
    (r.fastag ?? 0) +
    (r.tcs ?? 0) +
    (r.accessories ?? 0) +
    (r.warranty ?? 0) +
    (r.otherCharges ?? 0) -
    (r.dealerDiscount ?? 0)
  );
}

function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

const BLANK_FORM: Omit<PricingRecord, "id"> = {
  vehicleId: "",
  vehicleName: "",
  variantId: "",
  variantName: "",
  month: "",
  exShowroom: 0,
  roadTax: 0,
  insurance: 0,
  fastag: 200,
  tcs: 0,
  accessories: 0,
  warranty: 0,
  otherCharges: 0,
  dealerDiscount: 0,
  bookingAmount: 0,
  estimatedOnRoad: 0,
  status: "Draft",
};

// Numeric-only keys of PricingRecord used in the price entry form
type NumericPricingKey = "exShowroom" | "roadTax" | "insurance" | "fastag" | "tcs" | "accessories" | "warranty" | "otherCharges" | "dealerDiscount" | "bookingAmount";

// ─── Price field configuration ───────────────────────────────────────────────

const PRICE_FIELDS: { key: NumericPricingKey; label: string; note?: string }[] = [
  { key: "exShowroom", label: "Ex-Showroom Price" },
  { key: "roadTax", label: "Road Tax" },
  { key: "insurance", label: "Insurance (1st Year)" },
  { key: "fastag", label: "FASTag", note: "Default ₹200" },
  { key: "tcs", label: "TCS (Tax Collected at Source)" },
  { key: "accessories", label: "Standard Accessories" },
  { key: "warranty", label: "Extended Warranty" },
  { key: "otherCharges", label: "Other Charges" },
  { key: "dealerDiscount", label: "Dealer Discount (–)", note: "Deducted from on-road" },
  { key: "bookingAmount", label: "Booking Amount" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function PricingClient() {
  const [records, setRecords] = useState<PricingRecord[]>([]);
  const [vehicles, setVehicles] = useState<VehicleMaster[]>([]);
  const [variants, setVariants] = useState<VariantMaster[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Draft" | "Published" | "Archived">("All");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<PricingRecord, "id">>(BLANK_FORM);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Live on-road calculation ───────────────────────────────────────────────
  const liveOnRoad = useMemo(() => calcOnRoad(form), [form]);

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ── Filtered variants for selected vehicle ─────────────────────────────────
  const filteredVariants = useMemo(
    () => variants.filter((v) => v.vehicleId === form.vehicleId),
    [variants, form.vehicleId]
  );

  // ── Load Data ──────────────────────────────────────────────────────────────
  // Shared fetch logic reused by initial mount and post-save refresh
  const fetchPricingData = async (isMounted: { current: boolean }) => {
    setLoading(true);
    try {
      if (isConfigured) {
        const [pSnap, vhSnap, vrSnap] = await Promise.all([
          getDocs(collection(db, "pricing_master")),
          getDocs(collection(db, "vehicles_master")),
          getDocs(collection(db, "variants_master")),
        ]);

        const rList: PricingRecord[] = [];
        pSnap.forEach((d) => rList.push({ id: d.id, ...d.data() } as PricingRecord));

        const vhList: VehicleMaster[] = [];
        vhSnap.forEach((d) => vhList.push({ id: d.id, ...d.data() } as VehicleMaster));

        const vrList: VariantMaster[] = [];
        vrSnap.forEach((d) => vrList.push({ id: d.id, ...d.data() } as VariantMaster));

        if (isMounted.current) {
          setRecords(rList);
          setVehicles(vhList);
          setVariants(vrList);
        }
      } else {
        const localR = localStorage.getItem(STORAGE_KEY);
        const localVh = localStorage.getItem("lt_vehicles_master");
        const localVr = localStorage.getItem("lt_variants_master");
        if (isMounted.current) {
          setRecords(localR ? JSON.parse(localR) : []);
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
    const fetchData = async () => {
      await fetchPricingData(isMounted);
    };
    fetchData();
    return () => {
      isMounted.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh after mutations
  const loadData = async () => {
    const isMounted = { current: true };
    await fetchPricingData(isMounted);
  };

  // ── Open form ──────────────────────────────────────────────────────────────
  const openCreate = () => {
    setForm(BLANK_FORM);
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEdit = (record: PricingRecord) => {
    setForm({ ...record });
    setEditingId(record.id ?? null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(BLANK_FORM);
  };

  // ── Save (Create / Update) ─────────────────────────────────────────────────
  const handleSave = async (targetStatus?: "Draft" | "Published" | "Archived") => {
    if (!form.vehicleId || !form.variantId || !form.month.trim()) {
      showToast("Vehicle, Variant, and Month are required.", "error");
      return;
    }
    if (form.exShowroom <= 0) {
      showToast("Ex-Showroom price must be greater than 0.", "error");
      return;
    }

    setSaving(true);
    try {
      const now = new Date().toISOString();
      const newStatus = targetStatus ?? form.status;
      const payload: Omit<PricingRecord, "id"> = {
        ...form,
        estimatedOnRoad: liveOnRoad,
        status: newStatus,
        updatedAt: now,
        ...(newStatus === "Published" && !form.publishedAt ? { publishedAt: now } : {}),
        ...(editingId ? {} : { createdAt: now }),
      };

      if (isConfigured) {
        if (editingId) {
          await updateDoc(doc(db, "pricing_master", editingId), payload as Record<string, unknown>);
        } else {
          await addDoc(collection(db, "pricing_master"), payload);
        }
      } else {
        // localStorage fallback
        const existing = localStorage.getItem(STORAGE_KEY);
        const list: PricingRecord[] = existing ? JSON.parse(existing) : [];
        if (editingId) {
          const idx = list.findIndex((r) => r.id === editingId);
          if (idx >= 0) list[idx] = { ...payload, id: editingId };
        } else {
          list.push({ ...payload, id: `local_${Date.now()}` });
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }

      showToast(
        editingId
          ? `Pricing record updated${newStatus === "Published" ? " & published" : ""}.`
          : "New pricing record saved.",
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
  const changeStatus = async (record: PricingRecord, newStatus: "Published" | "Archived") => {
    if (!record.id) return;
    try {
      const now = new Date().toISOString();
      const update: Partial<PricingRecord> = {
        status: newStatus,
        updatedAt: now,
        ...(newStatus === "Published" && !record.publishedAt ? { publishedAt: now } : {}),
      };
      if (isConfigured) {
        await updateDoc(doc(db, "pricing_master", record.id), update as Record<string, unknown>);
      } else {
        const existing = localStorage.getItem(STORAGE_KEY);
        const list: PricingRecord[] = existing ? JSON.parse(existing) : [];
        const idx = list.findIndex((r) => r.id === record.id);
        if (idx >= 0) list[idx] = { ...list[idx], ...update };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }
      showToast(`Record ${newStatus.toLowerCase()} successfully.`);
      await loadData();
    } catch (err: unknown) {
      showToast("Status update failed: " + (err instanceof Error ? err.message : String(err)), "error");
    }
  };

  // ── Filtered table rows ────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return records
      .filter((r) => statusFilter === "All" || r.status === statusFilter)
      .filter((r) => {
        const q = searchQuery.toLowerCase();
        return (
          !q ||
          r.vehicleName.toLowerCase().includes(q) ||
          r.variantName.toLowerCase().includes(q) ||
          r.month.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
  }, [records, statusFilter, searchQuery]);

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold text-white animate-in slide-in-from-top duration-300 ${
            toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <IndianRupee className="text-[#EB0A1E] w-6 h-6" />
            Pricing Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">Monthly price matrix per variant. Draft → Publish when ready to go live.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#EB0A1E] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" /> New Price Record
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search vehicle, variant, or month..."
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

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3">
          <Loader2 className="w-7 h-7 text-[#EB0A1E] animate-spin" />
          <span className="text-sm text-slate-400">Loading pricing matrix...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <IndianRupee className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-semibold">No pricing records found.</p>
          <p className="text-slate-600 text-xs mt-1">Click &ldquo;New Price Record&rdquo; to add the first monthly price matrix.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/50">
                  <th className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Vehicle / Variant</th>
                  <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Month</th>
                  <th className="text-right px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Ex-Showroom</th>
                  <th className="text-right px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">On-Road Est.</th>
                  <th className="text-right px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Booking Amt.</th>
                  <th className="text-center px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="text-center px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white text-xs">{record.vehicleName}</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">{record.variantName}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs text-slate-300 font-mono font-semibold">{record.month}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-xs text-slate-300 font-mono">{formatINR(record.exShowroom)}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-xs font-bold text-white font-mono">{formatINR(record.estimatedOnRoad)}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-xs text-[#EB0A1E] font-bold font-mono">{formatINR(record.bookingAmount)}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        record.status === "Published"
                          ? "bg-emerald-900/60 text-emerald-400 border border-emerald-800"
                          : record.status === "Draft"
                          ? "bg-amber-900/40 text-amber-400 border border-amber-800"
                          : "bg-slate-800 text-slate-500 border border-slate-700"
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(record)}
                          title="Edit"
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {record.status === "Draft" && (
                          <button
                            onClick={() => changeStatus(record, "Published")}
                            title="Publish"
                            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-900/30 rounded-lg transition-all"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {record.status === "Published" && (
                          <button
                            onClick={() => changeStatus(record, "Archived")}
                            title="Archive"
                            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition-all"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Slide-in Form Panel ─────────────────────────────────────────────── */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="flex-1 bg-slate-950/80 backdrop-blur-sm" onClick={closeForm} />

          {/* Panel */}
          <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full overflow-y-auto shadow-2xl flex flex-col">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-10">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  {editingId ? "Edit Price Record" : "New Price Record"}
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Fill all fields. On-Road is auto-calculated.</p>
              </div>
              <button onClick={closeForm} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Panel Body */}
            <div className="p-6 space-y-6 flex-1">

              {/* Vehicle + Variant + Month */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#EB0A1E] border-b border-slate-800 pb-2">
                  Record Context
                </h3>

                {/* Vehicle */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                    Vehicle <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.vehicleId}
                    onChange={(e) => {
                      const v = vehicles.find((vh) => vh.id === e.target.value);
                      setForm((prev) => ({
                        ...prev,
                        vehicleId: e.target.value,
                        vehicleName: v?.basicInfo?.name ?? e.target.value,
                        variantId: "",
                        variantName: "",
                      }));
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#EB0A1E] transition-colors"
                  >
                    <option value="">Select Vehicle...</option>
                    {vehicles.map((vh) => (
                      <option key={vh.id} value={vh.id}>
                        {vh.basicInfo?.name ?? vh.id}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Variant */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                    Variant <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.variantId}
                    onChange={(e) => {
                      const vr = variants.find((v) => v.id === e.target.value);
                      setField("variantId", e.target.value);
                      setField("variantName", vr?.name ?? e.target.value);
                    }}
                    disabled={!form.vehicleId}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#EB0A1E] transition-colors disabled:opacity-40"
                  >
                    <option value="">
                      {form.vehicleId ? "Select Variant..." : "Select a vehicle first"}
                    </option>
                    {filteredVariants.map((vr) => (
                      <option key={vr.id} value={vr.id}>
                        {vr.name} ({vr.fuel} / {vr.transmission})
                      </option>
                    ))}
                  </select>
                  {form.vehicleId && filteredVariants.length === 0 && (
                    <p className="text-[10px] text-amber-400 mt-1.5">No variants found for this vehicle. Add variants in Variant Master first.</p>
                  )}
                </div>

                {/* Month */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                    Pricing Month <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. July 2025"
                    value={form.month}
                    onChange={(e) => setField("month", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#EB0A1E] transition-colors"
                  />
                </div>
              </section>

              {/* Price Fields */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#EB0A1E] border-b border-slate-800 pb-2">
                  Price Components
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PRICE_FIELDS.map(({ key, label, note }) => (
                    <div key={key}>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                        {label}
                        {note && <span className="ml-1 text-slate-600 normal-case tracking-normal font-normal">({note})</span>}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">₹</span>
                        <input
                          type="number"
                          min={0}
                          value={(form as Record<string, unknown>)[key] as number}
                          onChange={(e) =>
                            setField(key as NumericPricingKey, parseFloat(e.target.value) || 0)
                          }
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-sm text-white outline-none focus:border-[#EB0A1E] transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* On-Road Summary Card */}
              <section className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estimated On-Road Price</h3>
                <div className="space-y-1.5 text-[11px] text-slate-400">
                  {[
                    { label: "Ex-Showroom", val: form.exShowroom },
                    { label: "Road Tax", val: form.roadTax },
                    { label: "Insurance", val: form.insurance },
                    { label: "FASTag", val: form.fastag },
                    { label: "TCS", val: form.tcs },
                    { label: "Accessories", val: form.accessories },
                    { label: "Warranty", val: form.warranty },
                    { label: "Other Charges", val: form.otherCharges },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex justify-between">
                      <span>{label}</span>
                      <span className="font-mono">{formatINR(val)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-[#EB0A1E]">
                    <span>Dealer Discount (–)</span>
                    <span className="font-mono">–{formatINR(form.dealerDiscount)}</span>
                  </div>
                  <div className="border-t border-slate-800 pt-2 flex justify-between text-white font-bold text-sm">
                    <span>Total Estimated On-Road</span>
                    <span className="font-mono font-black text-emerald-400">{formatINR(liveOnRoad)}</span>
                  </div>
                </div>
              </section>

              {/* Status */}
              <section className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#EB0A1E] border-b border-slate-800 pb-2">
                  Workflow Status
                </h3>
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
                    <Eye className="w-3 h-3" /> This record will be visible on the public vehicle pages.
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
