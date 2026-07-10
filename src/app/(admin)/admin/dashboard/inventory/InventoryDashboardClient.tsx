"use client";

import React, { useEffect, useState } from "react";
import { db, isConfigured } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { 
  Boxes, 
  Car, 
  ShieldCheck, 
  ChevronRight, 
  Loader2
} from "lucide-react";

interface VehicleStockRecord {
  vin: string;
  status: "Available" | "PDI" | "Booked" | "Delivered" | "Archived";
  branch: string;
}

export default function InventoryDashboardClient() {
  const [items, setItems] = useState<VehicleStockRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        if (isConfigured) {
          const snap = await getDocs(collection(db, "inventory_items"));
          const list: VehicleStockRecord[] = [];
          snap.forEach((d) => {
            list.push(d.data() as VehicleStockRecord);
          });
          if (isMounted) setItems(list);
        } else {
          const local = localStorage.getItem("lt_inventory_items");
          if (local && isMounted) setItems(JSON.parse(local));
        }
      } catch (err: unknown) {
        console.error("Dashboard count fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = React.useMemo(() => {
    let available = 0;
    let pdi = 0;
    let booked = 0;
    let delivered = 0;
    let activeTotal = 0;

    items.forEach((item) => {
      if (item.status === "Available") {
        available += 1;
        activeTotal += 1;
      } else if (item.status === "PDI") {
        pdi += 1;
        activeTotal += 1;
      } else if (item.status === "Booked") {
        booked += 1;
        activeTotal += 1;
      } else if (item.status === "Delivered") {
        delivered += 1;
        activeTotal += 1;
      }
    });

    return { available, pdi, booked, delivered, activeTotal };
  }, [items]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-8 h-8 text-[#EB0A1E] animate-spin" />
        <span className="text-xs text-slate-400">Loading operations parameters...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-display flex items-center gap-2">
          <Boxes className="text-[#EB0A1E] w-6 h-6" />
          Inventory Operations Console
        </h1>
        <p className="text-xs text-slate-400">Operational status overview of physical vehicle inventory, dealership allocation, and EDP transactions.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Active Stock", value: stats.activeTotal, color: "border-slate-800 text-white" },
          { label: "Available", value: stats.available, color: "border-emerald-800 text-emerald-400" },
          { label: "Under PDI", value: stats.pdi, color: "border-blue-800 text-blue-400" },
          { label: "Booked", value: stats.booked, color: "border-amber-800 text-amber-400" },
          { label: "Delivered", value: stats.delivered, color: "border-purple-800 text-purple-400" },
        ].map((kpi, idx) => (
          <div key={idx} className={`bg-slate-900 border ${kpi.color} p-5 rounded-2xl shadow-lg flex flex-col justify-between h-28`}>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{kpi.label}</span>
            <span className="text-3xl font-black font-display tracking-tight">{kpi.value}</span>
          </div>
        ))}
      </div>

      {/* Shortcut Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Car className="text-[#EB0A1E] w-5 h-5" />
              Central Vehicle Inventory
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Query and filter vehicles in stock by showrooms, variants, colors, and statuses. Perform status log changes, view associated booking reference keys, or soft-delete units.
            </p>
          </div>
          <div>
            <Link
              href="/admin/dashboard/inventory/list"
              className="inline-flex items-center gap-2 bg-slate-850 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors border border-slate-800"
            >
              Access Catalog List <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="text-[#EB0A1E] w-5 h-5" />
              Stock Receive Portal
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Add individual physical records with unique VIN numbers, engine and chassis IDs, and showroom allocations. Supports bulk imports from dealer CSV sheets with validation.
            </p>
          </div>
          <div>
            <Link
              href="/admin/dashboard/inventory/receive"
              className="inline-flex items-center gap-2 bg-[#EB0A1E] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors"
            >
              Intake Log Terminal <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
