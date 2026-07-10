import React from "react";
import CMSDashboardClient from "./CMSDashboardClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "PIM CMS Dashboard - Admin Panel",
  description: "Operational overview of Toyota vehicle master catalogs and configurations.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function CMSDashboardPage() {
  return <CMSDashboardClient />;
}
