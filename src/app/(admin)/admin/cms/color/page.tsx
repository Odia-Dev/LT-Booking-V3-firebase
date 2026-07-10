import React from "react";
import ColorClient from "./ColorClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Toyota Color Master - CMS",
  description: "Manage vehicle color configurations.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function ColorPage() {
  return <ColorClient />;
}
