export interface VehicleBasicInfo {
  brand: string;
  name: string;
  slug: string;
  category: string;
  shortDesc: string;
  longDesc: string;
  tagline: string;
  launchYear: number;
  status: "Draft" | "Published" | "Archived";
  isFeatured: boolean;
}

export interface VehiclePricing {
  startingPrice: string;
  bookingAmount: number;
  isRefundable: boolean;
  refundNotes: string;
}

export interface VehicleSEO {
  title: string;
  description: string;
  keywords: string;
}

export interface VehicleMedia {
  heroImage: string;
  thumbnail: string;
  gallery: string[];
  brochureUrl: string;
}

export interface VehicleInventory {
  stockStatus: string;
  totalUnits: number;
  waitingPeriod: string;
  branches: string[];
}

export interface VehicleVariant {
  name: string;
  engine: string;
  fuel: string;
  transmission: string;
  exShowroom: string;
}

export interface VehicleColor {
  id: string;
  name: string;
  hex: string;
}

export interface VehicleOffer {
  title: string;
  discount: number;
  type: string;
}

export interface VehicleFeatures {
  safety: string[];
  interior: string[];
  exterior: string[];
  technology: string[];
}

export interface VehicleMaster {
  id?: string;
  basicInfo: VehicleBasicInfo;
  pricing: VehiclePricing;
  seo: VehicleSEO;
  media: VehicleMedia;
  inventory: VehicleInventory;
  variants: VehicleVariant[];
  colors: VehicleColor[];
  features: VehicleFeatures;
  offers: VehicleOffer[];
  createdAt?: string;
  updatedAt?: string;
}
