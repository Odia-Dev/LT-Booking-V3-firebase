import React from "react";
import OffersClient from "./OffersClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Offers Management - CMS",
  description: "Create and manage promotional offers with date ranges, vehicle targeting, and multi-surface visibility.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function OffersPage() {
  return <OffersClient />;
}
