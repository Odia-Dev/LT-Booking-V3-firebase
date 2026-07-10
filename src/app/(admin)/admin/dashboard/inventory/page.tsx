import React from "react";
import InventoryDashboardClient from "./InventoryDashboardClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Inventory Dashboard - EDP Operations",
  description: "Operational summary of vehicle inventory, stocks, and branches.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function InventoryDashboardPage() {
  return <InventoryDashboardClient />;
}
