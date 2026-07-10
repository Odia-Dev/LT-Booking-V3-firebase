import React from "react";
import VehicleClient from "./VehicleClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Vehicle Master List - CMS",
  description: "Manage vehicles database configurations.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function VehiclePage() {
  return <VehicleClient />;
}
