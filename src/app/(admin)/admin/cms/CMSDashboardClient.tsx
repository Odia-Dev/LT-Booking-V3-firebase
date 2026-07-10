"use client";

import React, { useEffect, useState, useMemo } from "react";
import { db, isConfigured } from "@/lib/firebase";
import { collection, getDocs, limit, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import { 
  Car, 
  Settings, 
  Tag, 
  Boxes, 
  History, 
  ChevronRight,
  Loader2
} from "lucide-react";

interface VehicleItem {
  basicInfo?: {
    name: string;
    status: "Draft" | "Published" | "Archived";
  };
}

interface VariantItem {
  name: string;
}

interface InventoryItem {
  vehicle: string;
  status: string;
}

interface ActivityLog {
  id?: string;
  vin: string;
  oldStatus: string;
  newStatus: string;
  user: string;
  reason: string;
  timestamp: string;
}

export default function CMSDashboardClient() {
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [variants, setVariants] = useState<VariantItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      try {
        if (isConfigured) {
          // Fetch Vehicles
          const vhSnap = await getDocs(collection(db, "vehicles_master"));
          const vhList: VehicleItem[] = [];
          vhSnap.forEach(d => vhList.push(d.data() as VehicleItem));

          // Fetch Variants
          const vrSnap = await getDocs(collection(db, "variants_master"));
          const vrList: VariantItem[] = [];
          vrSnap.forEach(d => vrList.push(d.data() as VariantItem));

          // Fetch Inventory Items
          const invSnap = await getDocs(collection(db, "inventory_items"));
          const invList: InventoryItem[] = [];
          invSnap.forEach(d => invList.push(d.data() as InventoryItem));

          // Fetch Recent Activities
          const actQuery = query(collection(db, "inventoryMovements"), orderBy("timestamp", "desc"), limit(5));
          const actSnap = await getDocs(actQuery);
          const actList: ActivityLog[] = [];
          actSnap.forEach(d => actList.push({ id: d.id, ...d.data() } as ActivityLog));

          if (isMounted) {
            setVehicles(vhList);
            setVariants(vrList);
            setInventory(invList);
            setActivities(actList);
          }
        } else {
          // Fallbacks for local storage
          const localV = localStorage.getItem("lt_vehicles_master");
          const localVr = localStorage.getItem("lt_variants_master");
          const localInv = localStorage.getItem("lt_inventory_items");
          const localAct = localStorage.getItem("lt_inventory_movements");

          if (isMounted) {
            setVehicles(localV ? JSON.parse(localV) : []);
            setVariants(localVr ? JSON.parse(localVr) : []);
            setInventory(localInv ? JSON.parse(localInv) : []);
            
            const rawAct = localAct ? JSON.parse(localAct) as ActivityLog[] : [];
            const sortedAct = rawAct.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);
            setActivities(sortedAct);
          }
        }
      } catch (err: unknown) {
        console.error("Error loading CMS Dashboard counts:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totalVehicles = vehicles.length;
    const totalVariants = variants.length;
    const publishedVehicles = vehicles.filter(v => v.basicInfo?.status === "Published").length;
    const draftVehicles = vehicles.filter(v => v.basicInfo?.status === "Draft").length;
    const totalInventory = inventory.filter(i => i.status !== "Archived").length;
    const availableStock = inventory.filter(i => i.status === "Available").length;
    const bookedStock = inventory.filter(i => i.status === "Booked").length;

    return {
      totalVehicles,
      totalVariants,
      publishedVehicles,
      draftVehicles,
      totalInventory,
      availableStock,
      bookedStock
    };
  }, [vehicles, variants, inventory]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-[#EB0A1E] animate-spin" />
        <span className="text-xs text-zinc-400">Assembling CMS telemetry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-display flex items-center gap-2">
          <Car className="text-[#EB0A1E] w-6 h-6" />
          PIM Product CMS Control Console
        </h1>
        <p className="text-xs text-slate-400">Central control console for catalog structures, pricing matrices, physical stock allocation, and configurations.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Models Mapped", value: stats.totalVehicles, desc: `${stats.publishedVehicles} Published, ${stats.draftVehicles} Draft`, icon: Car },
          { label: "Trims & Variants", value: stats.totalVariants, desc: "Across catalog models", icon: Settings },
          { label: "Physical Units in Stock", value: stats.totalInventory, desc: `${stats.availableStock} Available, ${stats.bookedStock} Mapped`, icon: Boxes },
          { label: "Active Promos", value: 4, desc: "Operational Offers live", icon: Tag }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{kpi.label}</span>
                <Icon className="w-4 h-4 text-[#EB0A1E] opacity-75 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <span className="text-3xl font-black font-display tracking-tight text-white">{kpi.value}</span>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">{kpi.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Quick Launch Panel */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Operational Quick Terminals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Vehicle Master", desc: "Configure core Toyota vehicle entries, taglines, categories, slugs, and SEO profiles.", href: "/admin/cms/vehicle" },
              { title: "Variant Catalog", desc: "Manage detailed variant specifications, fuel configs, engine cc, and ex-showroom values.", href: "/admin/cms/variant" },
              { title: "Exterior Color Codes", desc: "Map active dealership color palettes, hex swatches, and primary/secondary tone selectors.", href: "/admin/cms/color" },
              { title: "Toyota Suffix Codes", desc: "Link interior trims, official model numbers, and manufacturing codes.", href: "/admin/cms/suffix" }
            ].map((link, idx) => (
              <Link 
                key={idx} 
                href={link.href}
                className="bg-slate-950/60 border border-slate-850 hover:border-[#EB0A1E]/40 p-4 rounded-xl shadow transition-colors flex flex-col justify-between gap-2 text-left group"
              >
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-[#EB0A1E] transition-colors">{link.title}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{link.desc}</p>
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 group-hover:text-white transition-colors">
                  Open console <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent CMS Activity Audit Trail */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
            <History className="w-4 h-4 text-[#EB0A1E]" />
            Recent Activity Trail
          </h2>

          {activities.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4">No recent database operations logged.</p>
          ) : (
            <div className="space-y-4">
              {activities.map((act) => (
                <div key={act.id} className="border-l-2 border-slate-800 pl-3.5 py-0.5 space-y-1 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-bold text-[#EB0A1E]">{act.vin}</span>
                    <span className="text-[9px] text-slate-500 font-mono">{new Date(act.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-[11px] text-slate-350 leading-relaxed">{act.reason}</p>
                  <p className="text-[10px] text-slate-500 font-semibold">User: {act.user}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
