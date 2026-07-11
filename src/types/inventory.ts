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

export interface PricingRecord {
  id?: string;
  vehicleId: string;        // reference to vehicles_master
  vehicleName: string;      // cached display name
  variantId: string;        // reference to variants_master
  variantName: string;      // cached display name
  month: string;            // e.g. "July 2025"
  exShowroom: number;
  roadTax: number;
  insurance: number;
  fastag: number;
  tcs: number;
  accessories: number;
  warranty: number;
  otherCharges: number;
  dealerDiscount: number;
  bookingAmount: number;
  estimatedOnRoad: number;  // auto-calculated server-side snapshot
  status: "Draft" | "Published" | "Archived";
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

// ─── Homepage CMS ─────────────────────────────────────────────────────────────

export interface HeroConfig {
  badgeText: string;         // e.g. "Official Toyota Dealer for South Odisha"
  headline: string;          // Main hero headline
  subheadline: string;       // Supporting subtitle
  ctaLabel: string;          // Button text e.g. "Explore Vehicles"
  ctaLink: string;           // Button href e.g. "#vehicles"
  bannerText: string;        // Top red banner text
  videoUrl: string;          // Hero background video URL
}

export interface TrustStat {
  label: string;             // e.g. "Toyota Deliveries"
  value: string;             // e.g. "3000+" or "4.8★"
  numericValue: number;      // For animated counter (0 if static text like "4.8★")
  suffix: string;            // e.g. "+", " Years", "★" — appended to counter
}

export interface FeaturedVehicle {
  vehicleId: string;         // Slug id e.g. "glanza"
  name: string;
  spec: string;              // e.g. "Smart Hatchback • 22+ km/l"
  price: string;             // e.g. "6.81 Lakh"
  bookingAmount: string;     // e.g. "11,000"
  imageUrl: string;
  badge: string;             // e.g. "Popular", "Sale", "High Demand"
  displayOrder: number;
}

export interface HomepageCmsConfig {
  id?: string;
  hero: HeroConfig;
  trustStats: TrustStat[];
  featuredVehicles: FeaturedVehicle[];
  status: "Draft" | "Published";
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}
export type RefundPolicy =
  | "Non-Refundable"
  | "Fully Refundable"
  | "Partially Refundable"
  | "Refundable within 7 days"
  | "Refundable within 14 days"
  | "Refundable within 30 days";

export interface BookingRule {
  id?: string;
  vehicleId: string;              // "" = default rule (applies to all)
  vehicleName: string;
  variantId: string;              // "" = applies to all variants of vehicle
  variantName: string;
  bookingAmount: number;          // INR collected at booking
  refundPolicy: RefundPolicy;
  partialRefundPercent: number;   // Used only when refundPolicy = "Partially Refundable"
  waitingPeriodEnabled: boolean;
  waitingPeriodWeeks: number;     // Estimated waiting in weeks shown to customer
  waitingPeriodNote: string;      // Free-text e.g. "Subject to stock availability"
  requiresAcknowledgement: boolean; // Customer must tick checkbox at checkout
  acknowledgementText: string;    // Checkbox label shown at checkout
  cancellationAllowed: boolean;
  cancellationWindowDays: number; // Days post-booking in which cancellation is allowed
  isDefault: boolean;             // Fallback when no variant-specific rule exists
  status: "Active" | "Draft" | "Archived";
  createdAt?: string;
  updatedAt?: string;
}
export type OfferType =
  | "Flat Discount"
  | "Percentage Discount"
  | "Free Accessory"
  | "Free Insurance"
  | "Extended Warranty"
  | "Exchange Bonus"
  | "Corporate Discount"
  | "Other";

export interface OfferRecord {
  id?: string;
  title: string;
  description: string;
  offerType: OfferType;
  amount: number;                // INR value or percentage based on offerType
  vehicleId: string;             // "" means "All Vehicles"
  vehicleName: string;           // "All Vehicles" or specific vehicle name
  variantId: string;             // "" means all variants of the vehicle
  variantName: string;
  priority: number;              // 1 = highest priority (shows first)
  startDate: string;             // ISO date string e.g. "2025-07-01"
  endDate: string;               // ISO date string e.g. "2025-07-31"
  isActive: boolean;
  showOnHomepage: boolean;
  showOnVehiclePage: boolean;
  showOnCheckout: boolean;
  status: "Draft" | "Published" | "Archived";
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}
