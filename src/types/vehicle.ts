export interface VehicleBasicInfo {
  brand: string;
  name: string;
  slug: string;
  type: string;
  description: string;
  status: "Draft" | "Published" | "Archived";
}

export interface VehiclePricing {
  basePrice: string;
  bookingAmount: number;
  roadTax: number;
  insurance: number;
}

export interface VehicleSEO {
  title: string;
  description: string;
  keywords: string;
}

export interface VehicleMedia {
  images: string[];
}

export interface VehicleInventory {
  stockCount: number;
  stockStatus: "In Stock" | "Waitlisted";
  waitingPeriodWeeks: number;
}

export interface VehicleVariant {
  id: string;
  name: string;
  price: string;
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

export interface VehicleMaster {
  id?: string;
  basicInfo: VehicleBasicInfo;
  pricing: VehiclePricing;
  seo: VehicleSEO;
  media: VehicleMedia;
  inventory: VehicleInventory;
  variants: VehicleVariant[];
  colors: VehicleColor[];
  features: string[];
  offers: VehicleOffer[];
  createdAt?: string;
  updatedAt?: string;
}
