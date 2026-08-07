import { db, isConfigured } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { VehicleMaster, PricingRecord, HomepageCmsConfig } from "@/types/inventory";

// ─── Branded Toyota Fallback Images (Never generic demo cars) ────────────────

export const BRANDED_TOYOTA_PLACEHOLDERS: Record<string, { image: string; spec: string; price: string; booking: string; type: string }> = {
  glanza: {
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800",
    spec: "Smart Hatchback • 22.35 km/l • 1.2L DualJet K-Series Engine",
    price: "₹6.81 Lakh",
    booking: "₹11,000",
    type: "Hatchback",
  },
  taisor: {
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
    spec: "Urban Compact SUV • 1.0L Turbo / 1.2L K-Series • Bold Stance",
    price: "₹7.74 Lakh",
    booking: "₹11,000",
    type: "Compact SUV",
  },
  rumion: {
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
    spec: "Spacious 7-Seater MPV • 20.51 km/l • NeoDrive / CNG Options",
    price: "₹10.44 Lakh",
    booking: "₹21,000",
    type: "MPV",
  },
  hyryder: {
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800",
    spec: "Self-Charging Strong Hybrid SUV • 27.97 km/l • All-Wheel Drive",
    price: "₹11.14 Lakh",
    booking: "₹25,000",
    type: "SUV",
  },
  ebella: {
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800",
    spec: "All-Electric EV SUV • 500+ km Range • Zero Emissions",
    price: "₹12.00 Lakh",
    booking: "₹25,000",
    type: "Electric SUV",
  },
  "innova-crysta": {
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800",
    spec: "Iconic Diesel MPV • 2.4L GD Turbo Diesel • Legendary Comfort",
    price: "₹19.99 Lakh",
    booking: "₹50,000",
    type: "MPV",
  },
  "innova-hycross": {
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800",
    spec: "Self-Charging Hybrid MPV • 23.24 km/l • Ottoman Rear Seats",
    price: "₹18.86 Lakh",
    booking: "₹50,000",
    type: "MPV",
  },
  fortuner: {
    image: "https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?auto=format&fit=crop&q=80&w=800",
    spec: "Legendary 4x4 SUV • 500 Nm Torque • Unmatched Road Presence",
    price: "₹33.43 Lakh",
    booking: "₹1,00,000",
    type: "SUV",
  },
  "fortuner-legender": {
    image: "https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?auto=format&fit=crop&q=80&w=800",
    spec: "Exclusive Styling • Quad-LED Headlamps • Sequential Turn Signals",
    price: "₹43.66 Lakh",
    booking: "₹1,00,000",
    type: "SUV",
  },
  hilux: {
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800",
    spec: "Extreme Off-Road Pickup • 700mm Water Wading • Tough Frame",
    price: "₹30.40 Lakh",
    booking: "₹1,00,000",
    type: "Utility Pickup",
  },
  camry: {
    image: "https://images.unsplash.com/photo-1503376710915-18861d9a2638?auto=format&fit=crop&q=80&w=800",
    spec: "Luxury Self-Charging Hybrid Sedan • 2.5L Dynamic Force • Executive Lounge",
    price: "₹46.17 Lakh",
    booking: "₹1,00,000",
    type: "Luxury Sedan",
  },
  vellfire: {
    image: "https://images.unsplash.com/photo-1517524008436-a3851f153a77?auto=format&fit=crop&q=80&w=800",
    spec: "Ultra-Luxury Executive Lounge MPV • Private Jet Comfort on Wheels",
    price: "₹1.20 Crore",
    booking: "₹2,00,000",
    type: "Luxury MPV",
  },
  landcruiser300: {
    image: "https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?auto=format&fit=crop&q=80&w=800",
    spec: "Flagship Luxury Off-Roader • 3.3L Twin-Turbo V6 Diesel • King of Terrain",
    price: "₹2.10 Crore",
    booking: "₹20,00,000",
    type: "Luxury SUV",
  },
};

export const DEFAULT_BRANDED_CAR_IMAGE = "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&q=80&w=800";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface LiveVehicleDisplay {
  id: string;
  slug: string;
  name: string;
  type: string;
  category: string;
  price: string;
  rawPriceNumber: number;
  bookingAmount: string;
  rawBookingNumber: number;
  heroImage: string;
  gallery: string[];
  spec: string;
  tagline: string;
  stockCount: number;
  stockStatus: "Ready Delivery" | "Low Stock" | "Reserve Allocation";
  stockBadge: string;
  waitingPeriod: string;
  brochureUrl?: string;
  variants: any[];
  colors: any[];
}

export interface LiveOfferDisplay {
  id: string;
  title: string;
  subtitle: string;
  discountText: string;
  badge: string;
  description: string;
  expiryText: string;
  applicableVehicles: string[];
  bannerUrl?: string;
}

// ─── Helper Functions ────────────────────────────────────────────────────────

function normalizeSlug(name: string): string {
  return name.toLowerCase().replace(/toyota\s+/g, "").replace(/\s+/g, "-").trim();
}

// ─── Core Data Fetchers ──────────────────────────────────────────────────────

export async function fetchLiveVehicles(): Promise<LiveVehicleDisplay[]> {
  const result: LiveVehicleDisplay[] = [];

  try {
    if (isConfigured) {
      const snap = await getDocs(collection(db, "vehicles_master"));
      snap.forEach((docSnap) => {
        const data = docSnap.data() as VehicleMaster;
        if (data.basicInfo?.status === "Published") {
          const rawSlug = data.basicInfo.slug || normalizeSlug(data.basicInfo.name);
          const fallback = BRANDED_TOYOTA_PLACEHOLDERS[rawSlug] || {
            image: DEFAULT_BRANDED_CAR_IMAGE,
            spec: data.basicInfo.shortDesc || "Official Toyota Vehicle",
            price: data.pricing?.startingPrice || "Contact Dealer",
            booking: "₹" + (data.pricing?.bookingAmount || 25000).toLocaleString("en-IN"),
            type: data.basicInfo.category || "Toyota",
          };

          const totalUnits = data.inventory?.totalUnits ?? 5;
          let stockStatus: "Ready Delivery" | "Low Stock" | "Reserve Allocation" = "Ready Delivery";
          let stockBadge = "Immediate Delivery Available";

          if (totalUnits === 0) {
            stockStatus = "Reserve Allocation";
            stockBadge = `Waiting Period: ${data.inventory?.waitingPeriod || "4-6 Weeks"}`;
          } else if (totalUnits <= 3) {
            stockStatus = "Low Stock";
            stockBadge = `Only ${totalUnits} Units Remaining`;
          }

          result.push({
            id: docSnap.id,
            slug: rawSlug,
            name: data.basicInfo.name,
            type: data.basicInfo.category || fallback.type,
            category: (data.basicInfo.category || "suv").toLowerCase(),
            price: data.pricing?.startingPrice ? `₹${data.pricing.startingPrice}` : fallback.price,
            rawPriceNumber: parseFloat(data.pricing?.startingPrice?.replace(/[^0-9.]/g, "") || "0"),
            bookingAmount: data.pricing?.bookingAmount ? `₹${data.pricing.bookingAmount.toLocaleString("en-IN")}` : fallback.booking,
            rawBookingNumber: data.pricing?.bookingAmount || 25000,
            heroImage: data.media?.heroImage || fallback.image,
            gallery: data.media?.gallery && data.media.gallery.length > 0 ? data.media.gallery : [fallback.image],
            spec: data.basicInfo.shortDesc || fallback.spec,
            tagline: data.basicInfo.tagline || "Built for Perfection",
            stockCount: totalUnits,
            stockStatus,
            stockBadge,
            waitingPeriod: data.inventory?.waitingPeriod || "2-4 Weeks",
            brochureUrl: data.media?.brochureUrl,
            variants: data.variants || [],
            colors: data.colors || [],
          });
        }
      });
    }
  } catch (err) {
    console.error("Error fetching live vehicles from Firestore:", err);
  }

  // If no Firestore vehicles retrieved, populate with complete Toyota branded lineup
  if (result.length === 0) {
    Object.entries(BRANDED_TOYOTA_PLACEHOLDERS).forEach(([key, val]) => {
      result.push({
        id: key,
        slug: key,
        name: key.toUpperCase().replace("-", " "),
        type: val.type,
        category: val.type.toLowerCase().includes("suv") ? "suv" : val.type.toLowerCase().includes("mpv") ? "mpv" : "hatchback",
        price: val.price,
        rawPriceNumber: parseFloat(val.price.replace(/[^0-9.]/g, "") || "0"),
        bookingAmount: val.booking,
        rawBookingNumber: parseInt(val.booking.replace(/[^0-9]/g, "") || "25000", 10),
        heroImage: val.image,
        gallery: [val.image],
        spec: val.spec,
        tagline: "Toyota Quality & Assurance",
        stockCount: 8,
        stockStatus: "Ready Delivery",
        stockBadge: "Immediate Delivery Available",
        waitingPeriod: "1-2 Weeks",
        variants: [],
        colors: [],
      });
    });
  }

  return result;
}

export async function fetchLiveOffers(): Promise<LiveOfferDisplay[]> {
  const offers: LiveOfferDisplay[] = [];

  try {
    if (isConfigured) {
      const snap = await getDocs(collection(db, "offers_cms"));
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.status === "Published" || !data.status) {
          offers.push({
            id: docSnap.id,
            title: data.title || "Special Toyota Benefits",
            subtitle: data.subtitle || "Limited period authorized dealer offer",
            discountText: data.discountText || "Up to ₹70,000",
            badge: data.badge || "Limited Time",
            description: data.description || "Applicable on select Toyota variants.",
            expiryText: data.expiryText || "Ends this month",
            applicableVehicles: data.applicableVehicles || ["All Models"],
            bannerUrl: data.bannerUrl,
          });
        }
      });
    }
  } catch (err) {
    console.error("Error fetching offers from Firestore:", err);
  }

  if (offers.length === 0) {
    offers.push(
      {
        id: "off-1",
        title: "Exchange Bonus",
        subtitle: "Upgrade to Toyota",
        discountText: "Up to ₹70,000",
        badge: "Limited Time",
        description: "Get up to ₹70,000 instant exchange bonus when trading in your current car.",
        expiryText: "Ends in 5 days",
        applicableVehicles: ["Glanza", "Hyryder", "Taisor", "Rumion"],
      },
      {
        id: "off-2",
        title: "Self-Charging Hybrid Benefits",
        subtitle: "Eco Savings Campaign",
        discountText: "Up to ₹1.60 Lakh",
        badge: "Popular",
        description: "Special hybrid battery warranty extension & service package benefits on Hyryder.",
        expiryText: "Limited Stock",
        applicableVehicles: ["Hyryder", "Innova Hycross"],
      },
      {
        id: "off-3",
        title: "Corporate Exclusive",
        subtitle: "Special Salaried Pricing",
        discountText: "Up to ₹30,000",
        badge: "Ongoing",
        description: "Exclusive corporate pricing & zero-down-payment options for registered employees.",
        expiryText: "Valid this quarter",
        applicableVehicles: ["Camry", "Innova Crysta", "Fortuner"],
      }
    );
  }

  return offers;
}

export async function fetchHomepageCms(): Promise<HomepageCmsConfig | null> {
  try {
    if (isConfigured) {
      const docRef = doc(db, "homepage_cms", "current");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as HomepageCmsConfig;
      }
    }
  } catch (err) {
    console.error("🔥 FIREBASE HOMEPAGE FETCH ERROR:", err);
  }
  return null;
}

/**
 * Utility to resolve live CMS images:
 * Prioritizes real Firebase Storage or custom uploaded URLs over demo placeholders.
 */
export function getLiveImage(cmsUrl?: string, fallbackSlug?: string): string {
  if (cmsUrl && cmsUrl.trim().length > 0 && !cmsUrl.includes("unsplash.com")) {
    return cmsUrl.trim();
  }
  if (fallbackSlug && BRANDED_TOYOTA_PLACEHOLDERS[fallbackSlug]) {
    return BRANDED_TOYOTA_PLACEHOLDERS[fallbackSlug].image;
  }
  return cmsUrl || DEFAULT_BRANDED_CAR_IMAGE;
}

