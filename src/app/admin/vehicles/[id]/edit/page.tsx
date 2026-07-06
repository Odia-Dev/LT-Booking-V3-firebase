"use client";

import React, { use, useEffect, useState } from "react";
import VehicleManager from "@/components/VehicleManager";
import { VehicleMaster } from "@/types/vehicle";
import { db, isConfigured } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditVehiclePage({ params }: PageProps) {
  const { id } = use(params);
  const [vehicle, setVehicle] = useState<VehicleMaster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadVehicle() {
      if (!isConfigured) {
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
        return;
      }

      try {
        const docRef = doc(db, "vehicles_master", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setVehicle({ id: docSnap.id, ...docSnap.data() } as VehicleMaster);
        } else {
          setError("Vehicle not found in PIM master repository.");
        }
      } catch (err: any) {
        console.error(err);
        setError("Error loading vehicle parameters: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    loadVehicle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center space-y-2">
          <Loader2 className="w-8 h-8 text-[#EB0A1E] animate-spin mx-auto" />
          <p className="text-xs text-zinc-400">Loading vehicle schema...</p>
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
            <Link href="/admin/dashboard" className="inline-block bg-[#EB0A1E] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg">
              Return to Console
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-6">
      <VehicleManager initialVehicle={vehicle} vehicleId={id} />
    </div>
  );
}
