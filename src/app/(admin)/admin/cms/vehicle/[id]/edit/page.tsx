import React from "react";
import EditClient from "./EditClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Vehicle Configuration - CMS",
  description: "Update vehicle parameters, variants, pricing, and media catalog.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCMSVehiclePage({ params }: PageProps) {
  const { id } = await params;
  return <EditClient id={id} />;
}
