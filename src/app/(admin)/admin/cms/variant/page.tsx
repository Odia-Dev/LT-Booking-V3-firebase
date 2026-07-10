import React from "react";
import VariantClient from "./VariantClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Variant Master - CMS",
  description: "Manage vehicle variant configurations.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function VariantPage() {
  return <VariantClient />;
}
