"use client";

import React, { useEffect, useState, useMemo } from "react";
import { db, isConfigured } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { StockMovementLog } from "@/lib/inventoryLogger";
import { 
  History, 
  Search, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  ArrowRight
} from "lucide-react";

export default function MovementClient() {
  const [logs, setLogs] = useState<StockMovementLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    let isMounted = true;
    async function loadLogs() {
      try {
        if (isConfigured) {
          const querySnap = await getDocs(collection(db, "inventoryMovements"));
          const list: StockMovementLog[] = [];
          querySnap.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as StockMovementLog);
          });
          if (isMounted) setLogs(list);
        } else {
          const local = localStorage.getItem("lt_inventory_movements");
          if (local && isMounted) {
            setLogs(JSON.parse(local));
          }
        }
      } catch (error: unknown) {
        const err = error as Error;
        console.error("Load movement logs error:", err);
        if (isMounted) showToast("Failed to load logs: " + err.message, "error");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadLogs();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredLogs = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return logs
      .filter((log) => {
        return (
          log.vin.toLowerCase().includes(q) ||
          log.user.toLowerCase().includes(q) ||
          (log.reason || "").toLowerCase().includes(q) ||
          (log.bookingId || "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [logs, searchQuery]);

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
          <History className="text-[#EB0A1E] w-6 h-6" />
          Stock Movement Logger
        </h1>
        <p className="text-xs text-slate-400">View transaction history, audit trails, and status change logs of vehicles in stock.</p>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-800 p-4 rounded-xl">
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search logs by VIN, user email, booking ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#EB0A1E] transition-colors"
          />
        </div>
      </div>

      {/* Log list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-[#EB0A1E] animate-spin" />
          <span className="text-xs text-slate-400">Loading activity trail...</span>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-16 text-center">
          <p className="text-sm text-slate-400">No stock movements logs registered.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">VIN Mapped</th>
                  <th className="px-6 py-4 text-center">Transition</th>
                  <th className="px-6 py-4">Operator</th>
                  <th className="px-6 py-4">Reason / Booking reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-850 transition-colors">
                    <td className="px-6 py-4 text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-white">{log.vin}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 text-[10px] font-semibold">
                          {log.oldStatus}
                        </span>
                        <ArrowRight className="w-3 h-3 text-[#EB0A1E]" />
                        <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-white text-[10px] font-bold">
                          {log.newStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-semibold">{log.user}</td>
                    <td className="px-6 py-4 text-slate-400">
                      <div className="flex flex-col gap-0.5">
                        <span>{log.reason}</span>
                        {log.bookingId && (
                          <span className="text-[10px] text-amber-400 font-mono font-bold">
                            Ref Booking: {log.bookingId}
                          </span>
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
    </div>
  );
}
