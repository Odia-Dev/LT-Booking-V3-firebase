import React from "react";
import ReceiveClient from "./ReceiveClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Receive New Stock - EDP Team",
  description: "Receive new physical vehicle stock manually or via CSV import.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function ReceivePage() {
  return <ReceiveClient />;
}
