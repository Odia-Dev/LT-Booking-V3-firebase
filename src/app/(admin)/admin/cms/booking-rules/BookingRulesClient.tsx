"use client";

import React, { useEffect, useState, useMemo } from "react";
import { db, isConfigured } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { BookingRule, RefundPolicy, VehicleMaster, VariantMaster } from "@/types/inventory";
import {
  Plus,
  Search,
  Edit3,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  ShieldCheck,
  Star,
  Clock,
  RefreshCw,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "lt_booking_rules";

const REFUND_POLICIES: RefundPolicy[] = [
  "Non-Refundable",
  "Fully Refundable",
  "Partially Refundable",
  "Refundable within 7 days",
  "Refundable within 14 days",
  "Refundable within 30 days",
];

const DEFAULT_ACKNOWLEDGEMENT =
  "I understand that the booking amount is subject to the refund policy stated above, and that the delivery timeline is an estimate subject to stock availability.";

const BLANK_FORM: Omit<BookingRule, "id"> = {
  vehicleId: "",
  vehicleName: "All Vehicles (Default Rule)",
  variantId: "",
  variantName: "All Variants",
  bookingAmount: 11000,
  refundPolicy: "Non-Refundable",
  partialRefundPercent: 50,
  waitingPeriodEnabled: false,
  waitingPeriodWeeks: 0,
  waitingPeriodNote: "Subject to stock availability at the time of booking.",
  requiresAcknowledgement: true,
  acknowledgementText: DEFAULT_ACKNOWLEDGEMENT,
  cancellationAllowed: false,
  cancellationWindowDays: 0,
  isDefault: false,
  status: "Active",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function refundBadgeColor(policy: RefundPolicy): string {
  if (policy === "Non-Refundable") return "bg-red-900/50 text-red-400 border-red-800";
  if (policy === "Fully Refundable") return "bg-emerald-900/50 text-emerald-400 border-emerald-800";
  return "bg-amber-900/40 text-amber-400 border-amber-800";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookingRulesClient() {
  const [rules, setRules] = useState<BookingRule[]>([]);
  const [vehicles, setVehicles] = useState<VehicleMaster[]>([]);
  const [variants, setVariants] = useState<VariantMaster[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Draft" | "Archived">("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<BookingRule, "id">>(BLANK_FORM);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const setField = <K extends keyof Omit<BookingRule, "id">>(
    key: K,
    value: Omit<BookingRule, "id">[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ── Filtered variants ─────────────────────────────────────────────────────
  const filteredVariants = useMemo(
    () => variants.filter((v) => v.vehicleId === form.vehicleId),
    [variants, form.vehicleId]
  );

  // ── Load Data (isMounted pattern) ─────────────────────────────────────────
  const fetchRulesData = async (isMounted: { current: boolean }) => {
    setLoading(true);
    try {
      if (isConfigured) {
        const [rSnap, vhSnap, vrSnap] = await Promise.all([
          getDocs(collection(db, "booking_rules")),
          getDocs(collection(db, "vehicles_master")),
          getDocs(collection(db, "variants_master")),
        ]);

        const rList: BookingRule[] = [];
        rSnap.forEach((d) => rList.push({ id: d.id, ...d.data() } as BookingRule));

        const vhList: VehicleMaster[] = [];
        vhSnap.forEach((d) => vhList.push({ id: d.id, ...d.data() } as VehicleMaster));

        const vrList: VariantMaster[] = [];
        vrSnap.forEach((d) => vrList.push({ id: d.id, ...d.data() } as VariantMaster));

        if (isMounted.current) {
          setRules(rList);
          setVehicles(vhList);
          setVariants(vrList);
        }
      } else {
        const localR = localStorage.getItem(STORAGE_KEY);
        const localVh = localStorage.getItem("lt_vehicles_master");
        const localVr = localStorage.getItem("lt_variants_master");
        if (isMounted.current) {
          setRules(localR ? JSON.parse(localR) : []);
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
    const run = async () => { await fetchRulesData(isMounted); };
    run();
    return () => { isMounted.current = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    const isMounted = { current: true };
    await fetchRulesData(isMounted);
  };

  // ── Form open/close ───────────────────────────────────────────────────────
  const openCreate = () => {
    setForm(BLANK_FORM);
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEdit = (rule: BookingRule) => {
    setForm({ ...rule });
    setEditingId(rule.id ?? null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(BLANK_FORM);
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (form.bookingAmount <= 0) {
      showToast("Booking amount must be greater than zero.", "error");
      return;
    }
    if (form.requiresAcknowledgement && !form.acknowledgementText.trim()) {
      showToast("Acknowledgement text cannot be empty.", "error");
      return;
    }

    setSaving(true);
    try {
      const now = new Date().toISOString();
      const payload: Omit<BookingRule, "id"> = {
        ...form,
        updatedAt: now,
        ...(editingId ? {} : { createdAt: now }),
      };

      if (isConfigured) {
        if (editingId) {
          await updateDoc(doc(db, "booking_rules", editingId), payload as Record<string, unknown>);
        } else {
          await addDoc(collection(db, "booking_rules"), payload);
        }
      } else {
        const existing = localStorage.getItem(STORAGE_KEY);
        const list: BookingRule[] = existing ? JSON.parse(existing) : [];
        if (editingId) {
          const idx = list.findIndex((r) => r.id === editingId);
          if (idx >= 0) list[idx] = { ...payload, id: editingId };
        } else {
          list.push({ ...payload, id: `local_${Date.now()}` });
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }

      showToast(editingId ? "Booking rule updated." : "New booking rule created.", "success");
      closeForm();
      await loadData();
    } catch (err: unknown) {
      showToast("Save failed: " + (err instanceof Error ? err.message : String(err)), "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Quick archive ─────────────────────────────────────────────────────────
  const archiveRule = async (rule: BookingRule) => {
    if (!rule.id) return;
    try {
      const update: Partial<BookingRule> = { status: "Archived", updatedAt: new Date().toISOString() };
      if (isConfigured) {
        await updateDoc(doc(db, "booking_rules", rule.id), update as Record<string, unknown>);
      } else {
        const existing = localStorage.getItem(STORAGE_KEY);
        const list: BookingRule[] = existing ? JSON.parse(existing) : [];
        const idx = list.findIndex((r) => r.id === rule.id);
        if (idx >= 0) list[idx] = { ...list[idx], ...update };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }
      showToast("Rule archived.");
      await loadData();
    } catch (err: unknown) {
      showToast("Archive failed: " + (err instanceof Error ? err.message : String(err)), "error");
    }
  };

  // ── Filtered + sorted list ────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return rules
      .filter((r) => statusFilter === "All" || r.status === statusFilter)
      .filter((r) => {
        const q = searchQuery.toLowerCase();
        return (
          !q ||
          r.vehicleName.toLowerCase().includes(q) ||
          r.variantName.toLowerCase().includes(q)
        );
      })
      // Default rules first, then by vehicle name
      .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0) || a.vehicleName.localeCompare(b.vehicleName));
  }, [rules, statusFilter, searchQuery]);

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
            <ShieldCheck className="text-[#EB0A1E] w-6 h-6" />
            Booking Rules
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Define per-variant booking amounts, refund policies, waiting periods, and checkout acknowledgements.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#EB0A1E] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" /> New Rule
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-sky-950/40 border border-sky-900 rounded-xl px-5 py-3.5 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-sky-300 leading-relaxed">
          <strong className="text-sky-200">Default Rule</strong> applies to all vehicles unless a more specific vehicle or variant rule exists.
          Rules are matched in order: <span className="text-sky-200">Variant → Vehicle → Default</span>.
          These rules are stored in <code className="text-sky-400 font-mono text-[10px]">booking_rules</code> and serve as the source of truth for the booking engine.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by vehicle or variant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-[#EB0A1E] transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["All", "Active", "Draft", "Archived"] as const).map((s) => (
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

      {/* Rules List */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3">
          <Loader2 className="w-7 h-7 text-[#EB0A1E] animate-spin" />
          <span className="text-sm text-slate-400">Loading booking rules...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <ShieldCheck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-semibold">No booking rules configured.</p>
          <p className="text-slate-600 text-xs mt-1">
            Click &ldquo;New Rule&rdquo; to add a default or per-variant booking rule.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((rule) => (
            <div key={rule.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              {/* Rule Row */}
              <div className="flex items-center gap-4 px-5 py-4">
                {/* Identity */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {rule.isDefault && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#EB0A1E]/20 border border-[#EB0A1E]/40 rounded-full text-[9px] font-black uppercase tracking-widest text-[#EB0A1E]">
                        <Star className="w-2.5 h-2.5" /> Default
                      </span>
                    )}
                    <p className="text-sm font-bold text-white truncate">{rule.vehicleName}</p>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{rule.variantName || "All Variants"}</p>
                </div>

                {/* Booking Amount */}
                <div className="text-right shrink-0">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Booking</p>
                  <p className="text-sm font-black text-white font-mono">{formatINR(rule.bookingAmount)}</p>
                </div>

                {/* Refund Badge */}
                <div className="shrink-0 hidden sm:block">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${refundBadgeColor(rule.refundPolicy)}`}>
                    {rule.refundPolicy}
                  </span>
                </div>

                {/* Waiting Period */}
                <div className="shrink-0 hidden md:flex items-center gap-1.5">
                  <Clock className={`w-3.5 h-3.5 ${rule.waitingPeriodEnabled ? "text-amber-400" : "text-slate-700"}`} />
                  <span className="text-[11px] text-slate-400">
                    {rule.waitingPeriodEnabled ? `~${rule.waitingPeriodWeeks}w wait` : "No wait"}
                  </span>
                </div>

                {/* Status */}
                <div className="shrink-0">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    rule.status === "Active"
                      ? "bg-emerald-900/60 text-emerald-400 border-emerald-800"
                      : rule.status === "Draft"
                      ? "bg-amber-900/40 text-amber-400 border-amber-800"
                      : "bg-slate-800 text-slate-500 border-slate-700"
                  }`}>
                    {rule.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setExpandedId(expandedId === rule.id ? null : (rule.id ?? null))}
                    title="Preview rule details"
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                  >
                    {expandedId === rule.id
                      ? <ChevronUp className="w-3.5 h-3.5" />
                      : <ChevronDown className="w-3.5 h-3.5" />
                    }
                  </button>
                  <button onClick={() => openEdit(rule)} title="Edit" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {rule.status !== "Archived" && (
                    <button onClick={() => archiveRule(rule)} title="Archive" className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition-all">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Detail Panel */}
              {expandedId === rule.id && (
                <div className="border-t border-slate-800 bg-slate-950/50 px-5 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5">
                      <RefreshCw className="w-3 h-3" /> Refund Policy
                    </p>
                    <p className="text-white font-semibold">{rule.refundPolicy}</p>
                    {rule.refundPolicy === "Partially Refundable" && (
                      <p className="text-slate-400 mt-0.5">{rule.partialRefundPercent}% refunded</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Waiting Period
                    </p>
                    {rule.waitingPeriodEnabled ? (
                      <>
                        <p className="text-white font-semibold">{rule.waitingPeriodWeeks} week(s)</p>
                        <p className="text-slate-400 mt-0.5">{rule.waitingPeriodNote}</p>
                      </>
                    ) : (
                      <p className="text-slate-500">Not applicable</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Cancellation</p>
                    {rule.cancellationAllowed ? (
                      <p className="text-white font-semibold">Allowed within {rule.cancellationWindowDays} day(s)</p>
                    ) : (
                      <p className="text-slate-500">Not allowed</p>
                    )}
                  </div>
                  {rule.requiresAcknowledgement && (
                    <div className="sm:col-span-2 md:col-span-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5">
                        <MessageSquare className="w-3 h-3" /> Checkout Acknowledgement
                      </p>
                      <p className="text-slate-300 leading-relaxed italic">&ldquo;{rule.acknowledgementText}&rdquo;</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
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
                  {editingId ? "Edit Booking Rule" : "New Booking Rule"}
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Rules are matched: Variant → Vehicle → Default.</p>
              </div>
              <button onClick={closeForm} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Panel Body */}
            <div className="p-6 space-y-6 flex-1">

              {/* Scope */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#EB0A1E] border-b border-slate-800 pb-2">Rule Scope</h3>

                {/* Default toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-white flex items-center gap-2">
                      <Star className="w-3.5 h-3.5 text-[#EB0A1E]" /> Default Rule
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Applies when no vehicle or variant-specific rule is found.</p>
                  </div>
                  <button
                    onClick={() => setField("isDefault", !form.isDefault)}
                    className={`relative w-11 h-6 rounded-full transition-all ${form.isDefault ? "bg-[#EB0A1E]" : "bg-slate-700"}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.isDefault ? "left-6" : "left-1"}`} />
                  </button>
                </div>

                {/* Vehicle */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Target Vehicle</label>
                  <select
                    value={form.vehicleId}
                    onChange={(e) => {
                      const v = vehicles.find((vh) => vh.id === e.target.value);
                      setForm((prev) => ({
                        ...prev,
                        vehicleId: e.target.value,
                        vehicleName: e.target.value === "" ? "All Vehicles (Default Rule)" : (v?.basicInfo?.name ?? e.target.value),
                        variantId: "",
                        variantName: "All Variants",
                      }));
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#EB0A1E] transition-colors"
                  >
                    <option value="">All Vehicles (Default Rule)</option>
                    {vehicles.map((vh) => (
                      <option key={vh.id} value={vh.id}>{vh.basicInfo?.name ?? vh.id}</option>
                    ))}
                  </select>
                </div>

                {/* Variant */}
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

                {/* Status */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Status</label>
                  <div className="flex gap-3">
                    {(["Active", "Draft", "Archived"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setField("status", s)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                          form.status === s
                            ? s === "Active"
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
                </div>
              </section>

              {/* Booking Amount */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#EB0A1E] border-b border-slate-800 pb-2">Booking Amount</h3>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                    Amount (₹) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      min={1}
                      value={form.bookingAmount}
                      onChange={(e) => setField("bookingAmount", parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-3 text-sm text-white outline-none focus:border-[#EB0A1E] transition-colors"
                    />
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1.5">This amount is collected at the time of online booking via Razorpay.</p>
                </div>
              </section>

              {/* Refund Policy */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#EB0A1E] border-b border-slate-800 pb-2">Refund Policy</h3>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Policy</label>
                  <select
                    value={form.refundPolicy}
                    onChange={(e) => setField("refundPolicy", e.target.value as RefundPolicy)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#EB0A1E] transition-colors"
                  >
                    {REFUND_POLICIES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                {form.refundPolicy === "Partially Refundable" && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Refund Percentage (%)</label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={form.partialRefundPercent}
                      onChange={(e) => setField("partialRefundPercent", parseInt(e.target.value) || 50)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#EB0A1E] transition-colors"
                    />
                  </div>
                )}
              </section>

              {/* Waiting Period */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#EB0A1E] border-b border-slate-800 pb-2">Waiting Period</h3>
                <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-white">Enable Waiting Period Notice</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Shows estimated delivery wait time to the customer.</p>
                  </div>
                  <button
                    onClick={() => setField("waitingPeriodEnabled", !form.waitingPeriodEnabled)}
                    className={`relative w-11 h-6 rounded-full transition-all ${form.waitingPeriodEnabled ? "bg-amber-600" : "bg-slate-700"}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.waitingPeriodEnabled ? "left-6" : "left-1"}`} />
                  </button>
                </div>
                {form.waitingPeriodEnabled && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Estimated Weeks</label>
                      <input
                        type="number"
                        min={0}
                        value={form.waitingPeriodWeeks}
                        onChange={(e) => setField("waitingPeriodWeeks", parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#EB0A1E] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Waiting Period Note</label>
                      <textarea
                        rows={2}
                        value={form.waitingPeriodNote}
                        onChange={(e) => setField("waitingPeriodNote", e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#EB0A1E] transition-colors resize-none"
                        placeholder="e.g. Subject to stock availability at time of booking."
                      />
                    </div>
                  </>
                )}
              </section>

              {/* Cancellation */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#EB0A1E] border-b border-slate-800 pb-2">Cancellation Policy</h3>
                <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-white">Allow Cancellation</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Customer can cancel booking within the window below.</p>
                  </div>
                  <button
                    onClick={() => setField("cancellationAllowed", !form.cancellationAllowed)}
                    className={`relative w-11 h-6 rounded-full transition-all ${form.cancellationAllowed ? "bg-emerald-600" : "bg-slate-700"}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.cancellationAllowed ? "left-6" : "left-1"}`} />
                  </button>
                </div>
                {form.cancellationAllowed && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Cancellation Window (Days)</label>
                    <input
                      type="number"
                      min={1}
                      value={form.cancellationWindowDays}
                      onChange={(e) => setField("cancellationWindowDays", parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#EB0A1E] transition-colors"
                    />
                  </div>
                )}
              </section>

              {/* Acknowledgement */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#EB0A1E] border-b border-slate-800 pb-2">Checkout Acknowledgement</h3>
                <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-white">Require Customer Acknowledgement</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Customer must tick a checkbox at checkout before booking.</p>
                  </div>
                  <button
                    onClick={() => setField("requiresAcknowledgement", !form.requiresAcknowledgement)}
                    className={`relative w-11 h-6 rounded-full transition-all ${form.requiresAcknowledgement ? "bg-sky-600" : "bg-slate-700"}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.requiresAcknowledgement ? "left-6" : "left-1"}`} />
                  </button>
                </div>
                {form.requiresAcknowledgement && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                      Acknowledgement Text <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={form.acknowledgementText}
                      onChange={(e) => setField("acknowledgementText", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#EB0A1E] transition-colors resize-none leading-relaxed"
                      placeholder="I understand that the booking amount..."
                    />
                    <p className="text-[10px] text-slate-600 mt-1.5">This text appears as a checkbox label at the checkout screen.</p>
                  </div>
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
                onClick={handleSave}
                disabled={saving}
                className="flex-[2] py-3 bg-[#EB0A1E] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                {saving ? "Saving..." : editingId ? "Update Rule" : "Save Rule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
