"use client";

import React, { useEffect, useState } from "react";
import { db, isConfigured } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import {
  HomepageCmsConfig,
  HeroConfig,
  TrustStat,
  FeaturedVehicle,
} from "@/types/inventory";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Home,
  Sparkles,
  BarChart3,
  Car,
  Plus,
  Trash2,
  Save,
  Send,
  Eye,
  GripVertical,
} from "lucide-react";

// ─── Defaults (mirror current hardcoded homepage values) ─────────────────────

const DEFAULT_HERO: HeroConfig = {
  badgeText: "Official Toyota Dealer for South Odisha",
  headline: "Reserve Your Toyota Car Online in Just 2 Minutes",
  subheadline:
    "Secure your preferred variant and color with an authorized Toyota dealer serving South Odisha.",
  ctaLabel: "Explore Vehicles",
  ctaLink: "#vehicles",
  bannerText:
    "⚡ ONLINE EXCLUSIVE: Get ₹5,000 instant discount on your final invoice when you book online today.",
  videoUrl:
    "https://assets.mixkit.co/videos/preview/mixkit-modern-suv-car-driving-on-a-rainy-road-40292-large.mp4",
};

const DEFAULT_TRUST_STATS: TrustStat[] = [
  { label: "Toyota Deliveries", value: "3000+", numericValue: 3000, suffix: "+" },
  { label: "Locations Across Odisha", value: "8", numericValue: 8, suffix: "" },
  { label: "Customer Rating", value: "4.8★", numericValue: 0, suffix: "" },
  { label: "Of Trust", value: "4+ Years", numericValue: 4, suffix: "+ Years" },
];

const DEFAULT_FEATURED: FeaturedVehicle[] = [
  {
    vehicleId: "glanza",
    name: "Glanza",
    spec: "Smart Hatchback • 22+ km/l • Perfect for City Drives",
    price: "6.81 Lakh",
    bookingAmount: "11,000",
    imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800",
    badge: "Sale",
    displayOrder: 1,
  },
  {
    vehicleId: "hyryder",
    name: "Hyryder",
    spec: "Self-Charging Hybrid SUV • 27.97 km/l • Premium Family SUV",
    price: "11.14 Lakh",
    bookingAmount: "21,000",
    imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&q=80&w=800",
    badge: "Popular",
    displayOrder: 2,
  },
  {
    vehicleId: "hycross",
    name: "Innova Hycross",
    spec: "Advanced Hybrid MPV • Spacious 7 Seater • Future Ready",
    price: "19.77 Lakh",
    bookingAmount: "50,000",
    imageUrl: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800",
    badge: "High Demand",
    displayOrder: 3,
  },
  {
    vehicleId: "fortuner",
    name: "Fortuner",
    spec: "Legendary SUV • Command Every Road • Premium Ownership",
    price: "33.43 Lakh",
    bookingAmount: "1,00,000",
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
    badge: "Iconic",
    displayOrder: 4,
  },
];

const BLANK_CONFIG: Omit<HomepageCmsConfig, "id"> = {
  hero: { ...DEFAULT_HERO },
  trustStats: DEFAULT_TRUST_STATS.map((s) => ({ ...s })),
  featuredVehicles: DEFAULT_FEATURED.map((v) => ({ ...v })),
  status: "Draft",
};

const STORAGE_KEY = "lt_homepage_cms";
const FIRESTORE_DOC_ID = "homepage_config";

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomepageCmsClient() {
  const [config, setConfig] = useState<Omit<HomepageCmsConfig, "id">>({ ...BLANK_CONFIG });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"hero" | "trust" | "vehicles">("hero");

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Load ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const isMounted = { current: true };
    const load = async () => {
      setLoading(true);
      try {
        if (isConfigured) {
          const snap = await getDocs(collection(db, "homepage_cms"));
          let found = false;
          snap.forEach((d) => {
            if (d.id === FIRESTORE_DOC_ID && isMounted.current) {
              setConfig(d.data() as Omit<HomepageCmsConfig, "id">);
              found = true;
            }
          });
          if (!found && isMounted.current) {
            setConfig({ ...BLANK_CONFIG });
          }
        } else {
          const local = localStorage.getItem(STORAGE_KEY);
          if (local && isMounted.current) {
            setConfig(JSON.parse(local));
          }
        }
      } catch (err: unknown) {
        if (isMounted.current) {
          showToast("Failed to load: " + (err instanceof Error ? err.message : String(err)), "error");
        }
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };
    load();
    return () => { isMounted.current = false; };
  }, []);

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async (publish: boolean) => {
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const payload: Omit<HomepageCmsConfig, "id"> = {
        ...config,
        status: publish ? "Published" : "Draft",
        updatedAt: now,
        ...(publish ? { publishedAt: now } : {}),
        ...(!config.createdAt ? { createdAt: now } : {}),
      };

      if (isConfigured) {
        await setDoc(doc(db, "homepage_cms", FIRESTORE_DOC_ID), payload);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }

      setConfig(payload);
      showToast(publish ? "Homepage config published!" : "Draft saved.", "success");
    } catch (err: unknown) {
      showToast("Save failed: " + (err instanceof Error ? err.message : String(err)), "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Hero helpers ───────────────────────────────────────────────────────────
  const setHero = <K extends keyof HeroConfig>(key: K, value: HeroConfig[K]) => {
    setConfig((prev) => ({ ...prev, hero: { ...prev.hero, [key]: value } }));
  };

  // ── Trust stat helpers ─────────────────────────────────────────────────────
  const updateStat = (index: number, field: keyof TrustStat, value: string | number) => {
    setConfig((prev) => {
      const stats = [...prev.trustStats];
      stats[index] = { ...stats[index], [field]: value };
      return { ...prev, trustStats: stats };
    });
  };

  const addStat = () => {
    setConfig((prev) => ({
      ...prev,
      trustStats: [...prev.trustStats, { label: "New Stat", value: "0", numericValue: 0, suffix: "" }],
    }));
  };

  const removeStat = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      trustStats: prev.trustStats.filter((_, i) => i !== index),
    }));
  };

  // ── Featured vehicle helpers ───────────────────────────────────────────────
  const updateVehicle = (index: number, field: keyof FeaturedVehicle, value: string | number) => {
    setConfig((prev) => {
      const vehicles = [...prev.featuredVehicles];
      vehicles[index] = { ...vehicles[index], [field]: value };
      return { ...prev, featuredVehicles: vehicles };
    });
  };

  const addVehicle = () => {
    setConfig((prev) => ({
      ...prev,
      featuredVehicles: [
        ...prev.featuredVehicles,
        {
          vehicleId: "",
          name: "New Vehicle",
          spec: "",
          price: "",
          bookingAmount: "",
          imageUrl: "",
          badge: "",
          displayOrder: prev.featuredVehicles.length + 1,
        },
      ],
    }));
  };

  const removeVehicle = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      featuredVehicles: prev.featuredVehicles.filter((_, i) => i !== index),
    }));
  };

  // ── Tabs ───────────────────────────────────────────────────────────────────
  const tabs = [
    { key: "hero" as const, label: "Hero Section", icon: Sparkles },
    { key: "trust" as const, label: "Trust Numbers", icon: BarChart3 },
    { key: "vehicles" as const, label: "Featured Vehicles", icon: Car },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3">
        <Loader2 className="w-7 h-7 text-[#EB0A1E] animate-spin" />
        <span className="text-sm text-slate-400">Loading homepage config...</span>
      </div>
    );
  }

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
            <Home className="text-[#EB0A1E] w-6 h-6" />
            Homepage CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Edit hero headlines, trust stats, and featured vehicles without redeploying.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
            config.status === "Published"
              ? "bg-emerald-900/60 text-emerald-400 border-emerald-800"
              : "bg-amber-900/40 text-amber-400 border-amber-800"
          }`}>
            {config.status}
          </span>
          {config.publishedAt && (
            <span className="text-[10px] text-slate-500">
              Published {new Date(config.publishedAt).toLocaleDateString("en-IN")}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all ${
              activeTab === key
                ? "bg-[#EB0A1E] text-white border-[#EB0A1E]"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600"
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* ═══ Hero Section Tab ═══ */}
      {activeTab === "hero" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-[#EB0A1E] border-b border-slate-800 pb-2">
            Hero Section Content
          </h2>

          {/* Banner Text */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
              Top Banner Text <span className="text-slate-600 normal-case tracking-normal font-normal">(red strip above nav)</span>
            </label>
            <input
              type="text"
              value={config.hero.bannerText}
              onChange={(e) => setHero("bannerText", e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#EB0A1E] transition-colors"
            />
          </div>

          {/* Badge Text */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Badge Text</label>
            <input
              type="text"
              value={config.hero.badgeText}
              onChange={(e) => setHero("badgeText", e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#EB0A1E] transition-colors"
            />
          </div>

          {/* Headline */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Main Headline</label>
            <textarea
              rows={2}
              value={config.hero.headline}
              onChange={(e) => setHero("headline", e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#EB0A1E] transition-colors resize-none"
            />
          </div>

          {/* Subheadline */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Subheadline</label>
            <textarea
              rows={2}
              value={config.hero.subheadline}
              onChange={(e) => setHero("subheadline", e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#EB0A1E] transition-colors resize-none"
            />
          </div>

          {/* CTA */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">CTA Button Label</label>
              <input
                type="text"
                value={config.hero.ctaLabel}
                onChange={(e) => setHero("ctaLabel", e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#EB0A1E] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">CTA Link</label>
              <input
                type="text"
                value={config.hero.ctaLink}
                onChange={(e) => setHero("ctaLink", e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#EB0A1E] transition-colors"
              />
            </div>
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
              Background Video URL <span className="text-slate-600 normal-case tracking-normal font-normal">(MP4)</span>
            </label>
            <input
              type="text"
              value={config.hero.videoUrl}
              onChange={(e) => setHero("videoUrl", e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#EB0A1E] transition-colors font-mono text-[11px]"
            />
          </div>

          {/* Live Preview */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-1.5">
              <Eye className="w-3 h-3" /> Live Preview
            </p>
            <div className="bg-[#EB0A1E] text-white text-[10px] font-black tracking-widest uppercase text-center py-2 rounded-t-xl mb-3">
              {config.hero.bannerText || "Banner text..."}
            </div>
            <div className="bg-slate-800 rounded-xl p-6 text-center">
              <span className="inline-block bg-white/10 border border-white/10 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                {config.hero.badgeText || "Badge..."}
              </span>
              <h3 className="text-xl font-black text-white mb-2 leading-tight">
                {config.hero.headline || "Headline..."}
              </h3>
              <p className="text-[11px] text-slate-300 mb-4">{config.hero.subheadline || "Subheadline..."}</p>
              <span className="inline-block bg-[#EB0A1E] text-white text-[10px] font-bold px-4 py-2 rounded">
                {config.hero.ctaLabel || "CTA..."}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Trust Stats Tab ═══ */}
      {activeTab === "trust" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-[#EB0A1E]">Trust Bar Statistics</h2>
            <button
              onClick={addStat}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-all"
            >
              <Plus className="w-3 h-3" /> Add Stat
            </button>
          </div>

          <div className="space-y-4">
            {config.trustStats.map((stat, idx) => (
              <div key={idx} className="bg-slate-950/50 border border-slate-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <GripVertical className="w-4 h-4 text-slate-700 mt-3 shrink-0" />
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Label</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => updateStat(idx, "label", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#EB0A1E] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Numeric Value</label>
                      <input
                        type="number"
                        min={0}
                        value={stat.numericValue}
                        onChange={(e) => updateStat(idx, "numericValue", parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#EB0A1E] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Suffix</label>
                      <input
                        type="text"
                        value={stat.suffix}
                        onChange={(e) => updateStat(idx, "suffix", e.target.value)}
                        placeholder='e.g. +, ★, Years'
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#EB0A1E] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Display Value</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => updateStat(idx, "value", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#EB0A1E] transition-colors"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeStat(idx)}
                    className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all mt-2 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Preview */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-1.5">
              <Eye className="w-3 h-3" /> Live Preview
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {config.trustStats.map((stat, idx) => (
                <div key={idx} className="bg-slate-800 rounded-xl p-4">
                  <p className="text-xl font-black text-white">{stat.value}</p>
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Featured Vehicles Tab ═══ */}
      {activeTab === "vehicles" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-[#EB0A1E]">Featured Vehicles Grid</h2>
            <button
              onClick={addVehicle}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-all"
            >
              <Plus className="w-3 h-3" /> Add Vehicle
            </button>
          </div>

          <div className="space-y-4">
            {config.featuredVehicles.map((vehicle, idx) => (
              <div key={idx} className="bg-slate-950/50 border border-slate-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <GripVertical className="w-4 h-4 text-slate-700 mt-3 shrink-0" />
                  <div className="flex-1 space-y-3">
                    {/* Row 1 */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Vehicle ID (slug)</label>
                        <input
                          type="text"
                          value={vehicle.vehicleId}
                          onChange={(e) => updateVehicle(idx, "vehicleId", e.target.value)}
                          placeholder="e.g. glanza"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#EB0A1E] transition-colors font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Display Name</label>
                        <input
                          type="text"
                          value={vehicle.name}
                          onChange={(e) => updateVehicle(idx, "name", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#EB0A1E] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Badge</label>
                        <input
                          type="text"
                          value={vehicle.badge}
                          onChange={(e) => updateVehicle(idx, "badge", e.target.value)}
                          placeholder="e.g. Popular"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#EB0A1E] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Order</label>
                        <input
                          type="number"
                          min={1}
                          value={vehicle.displayOrder}
                          onChange={(e) => updateVehicle(idx, "displayOrder", parseInt(e.target.value) || 1)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#EB0A1E] transition-colors"
                        />
                      </div>
                    </div>
                    {/* Row 2 */}
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Spec Line</label>
                      <input
                        type="text"
                        value={vehicle.spec}
                        onChange={(e) => updateVehicle(idx, "spec", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#EB0A1E] transition-colors"
                      />
                    </div>
                    {/* Row 3 */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Price</label>
                        <input
                          type="text"
                          value={vehicle.price}
                          onChange={(e) => updateVehicle(idx, "price", e.target.value)}
                          placeholder="6.81 Lakh"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#EB0A1E] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Booking Amt</label>
                        <input
                          type="text"
                          value={vehicle.bookingAmount}
                          onChange={(e) => updateVehicle(idx, "bookingAmount", e.target.value)}
                          placeholder="11,000"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#EB0A1E] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Image URL</label>
                        <input
                          type="text"
                          value={vehicle.imageUrl}
                          onChange={(e) => updateVehicle(idx, "imageUrl", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#EB0A1E] transition-colors font-mono text-[10px]"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeVehicle(idx)}
                    className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all mt-2 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ Footer Actions ═══ */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" /> Save Draft
        </button>
        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          className="flex-[2] py-3 bg-[#EB0A1E] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          {saving ? "Saving..." : "Publish to Homepage"}
        </button>
      </div>
    </div>
  );
}
