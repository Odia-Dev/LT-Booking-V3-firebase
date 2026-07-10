import React from "react";
import MovementClient from "./MovementClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Stock Movement Logs - EDP Operations",
  description: "View all vehicle stock movements and status transaction logs.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function MovementPage() {
  return <MovementClient />;
}
