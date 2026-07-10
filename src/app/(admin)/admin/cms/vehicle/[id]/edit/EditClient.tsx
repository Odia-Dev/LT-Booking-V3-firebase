"use client";

import React, { useEffect, useState } from "react";
import VehicleManager from "@/components/VehicleManager";
import { VehicleMaster } from "@/types/inventory";
import { db, isConfigured } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface EditClientProps {
  id: string;
}

export default function EditClient({ id }: EditClientProps) {
  const [vehicle, setVehicle] = useState<VehicleMaster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadVehicle() {
      if (!isConfigured) {
        // Fallback to local storage
        const local = localStorage.getItem("lt_vehicles_master");
        if (local) {
          const list = JSON.parse(local) as VehicleMaster[];
          const found = list.find((v) => v.id === id);
          if (found) {
            if (isMounted) {
              setVehicle(found);
              setLoading(false);
            }
            return;
          }
        }
        
        // Mock fallback
        if (isMounted) {
          setVehicle({
            id,
            basicInfo: { 
              brand: "Toyota", 
              name: "Mock Name", 
              slug: "mock-slug", 
              category: "SUV", 
              shortDesc: "Mock short details", 
              longDesc: "Mock long details",
              tagline: "Mock tagline",
              launchYear: 2026,
              status: "Draft", 
              isFeatured: false 
            },
            pricing: { 
              startingPrice: "₹10.00 Lakh", 
              bookingAmount: 11000, 
              isRefundable: true,
              refundNotes: "Refundable"
            },
            seo: { title: "Mock", description: "Mock", keywords: "Mock" },
            media: { heroImage: "", thumbnail: "", gallery: [], brochureUrl: "" },
            inventory: { stockStatus: "Available", totalUnits: 5, waitingPeriod: "0 Weeks", branches: [] },
            variants: [],
            colors: [],
            features: { safety: [], interior: [], exterior: [], technology: [] },
            offers: []
          });
          setLoading(false);
        }
        return;
      }

      try {
        const docRef = doc(db, "vehicles_master", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          if (isMounted) setVehicle({ id: docSnap.id, ...docSnap.data() } as VehicleMaster);
        } else {
          if (isMounted) setError("Vehicle configuration not found in Firestore.");
        }
      } catch (err: unknown) {
        const errorObj = err as Error;
        console.error(errorObj);
        if (isMounted) setError("Error loading vehicle parameters: " + errorObj.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadVehicle();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center space-y-2">
          <Loader2 className="w-8 h-8 text-[#EB0A1E] animate-spin mx-auto" />
          <p className="text-xs text-zinc-400">Loading vehicle configuration...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center">
        <div className="space-y-4 max-w-sm">
          <AlertCircle className="w-12 h-12 text-[#EB0A1E] mx-auto animate-pulse" />
          <h2 className="text-xl font-bold">Failed to Edit</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">{error || "Vehicle profile not resolved."}</p>
          <div className="pt-2">
            <Link href="/admin/cms/vehicle" className="inline-block bg-[#EB0A1E] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg">
              Return to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <VehicleManager initialVehicle={vehicle} vehicleId={id} />;
}
