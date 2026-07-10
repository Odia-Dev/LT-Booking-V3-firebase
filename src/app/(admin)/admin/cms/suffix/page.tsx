import React from "react";
import SuffixClient from "./SuffixClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Toyota Suffix Master - CMS",
  description: "Manage vehicle suffix mappings.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function SuffixPage() {
  return <SuffixClient />;
}
