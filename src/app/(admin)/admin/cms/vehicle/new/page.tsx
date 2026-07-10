import React from "react";
import VehicleManager from "@/components/VehicleManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Add New Vehicle - CMS",
  description: "Register a new vehicle in Laxmi Toyota inventory.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function NewCMSVehiclePage() {
  return <VehicleManager />;
}
