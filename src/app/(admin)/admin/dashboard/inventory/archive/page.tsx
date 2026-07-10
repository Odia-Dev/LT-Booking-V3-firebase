import React from "react";
import ArchiveClient from "./ArchiveClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Inventory Archive - EDP Operations",
  description: "View and manage archived vehicle stock records.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function ArchivePage() {
  return <ArchiveClient />;
}
