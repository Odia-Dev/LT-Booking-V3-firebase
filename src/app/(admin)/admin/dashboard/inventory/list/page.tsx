import React from "react";
import InventoryListClient from "./InventoryListClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Vehicle Inventory - EDP Team",
  description: "View and manage physical vehicle stock grouped by variant and color.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function InventoryListPage() {
  return <InventoryListClient />;
}
