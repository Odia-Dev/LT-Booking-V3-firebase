import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { VEHICLES } from "@/lib/data";
import VehicleDetailClient from "@/components/VehicleDetailClient";

interface VehiclePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: VehiclePageProps): Promise<Metadata> {
  const { id } = await params;
  const vehicle = VEHICLES[id.toLowerCase()];

  if (!vehicle) {
    return {
      title: "Vehicle Not Found | Laxmi Toyota",
      description: "The requested vehicle is not available in Laxmi Toyota lineup.",
    };
  }

  return {
    title: `${vehicle.name} Price in Odisha | Specs, Colors & Book Online - Laxmi Toyota`,
    description: `Explore ${vehicle.name} starting price, premium features, dynamic color options, and variants. Secure priority allocation online at Laxmi Toyota Odisha.`,
    keywords: `${vehicle.name} Odisha, ${vehicle.name} price, book ${vehicle.name} online, Toyota dealer Odisha`,
  };
}

export default async function VehicleDetailPage({ params }: VehiclePageProps) {
  const { id } = await params;
  const vehicle = VEHICLES[id.toLowerCase()];

  if (!vehicle) {
    notFound();
  }

  return <VehicleDetailClient vehicle={vehicle} id={id.toLowerCase()} />;
}
