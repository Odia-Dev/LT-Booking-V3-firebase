import { VehicleMaster as OriginalVehicleMaster } from "./vehicle";

export type VehicleMaster = OriginalVehicleMaster;

export interface VariantMaster {
  id?: string;
  vehicleId: string; // reference to VehicleMaster
  vehicleName: string; // cached name of vehicle
  name: string;
  engine: string;
  fuel: string; // e.g. Petrol, Diesel, Hybrid, Electric
  transmission: string; // e.g. Manual, Automatic, CVT, e-CVT
  exShowroom: string; // price as formatted string or number string e.g. "₹12.50 Lakh"
  status: "Active" | "Draft" | "Archived";
  createdAt?: string;
  updatedAt?: string;
}

export interface ToyotaColor {
  id?: string;
  colorCode: string;
  colorName: string;
  hex: string;
  dualTone: boolean;
  primaryColor: string;
  secondaryColor: string;
  status: "Active" | "Draft" | "Archived";
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ToyotaSuffix {
  id?: string;
  newSuffix: string; // Primary Suffix Code
  oldSuffix: string; // Hidden ref / Old Suffix Code
  vehicle: string; // Vehicle name/id reference
  variant: string; // Variant name/id reference
  color: string; // Color name/id reference
  fuel: string;
  interior: string;
  status: "Active" | "Draft" | "Archived";
  createdAt?: string;
  updatedAt?: string;
}
