import React from "react";
import PricingClient from "./PricingClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pricing Management - CMS",
  description: "Monthly price matrix management per variant with Draft to Publish workflow.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function PricingPage() {
  return <PricingClient />;
}
