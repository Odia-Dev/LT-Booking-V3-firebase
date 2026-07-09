export interface Vehicle {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  variants: string[];
  colors: string[];
  category: string;
  image: string;
}

export interface Branch {
  name: string;
  address: string;
  phone: string;
  hours: string;
  mapLink: string;
}

export const VEHICLES: Record<string, Vehicle> = {
  "toyota-glanza": {
    name: "Toyota Glanza",
    price: "₹6.81 Lakh onwards",
    tagline: "Hatchin' Soon - The Cool New Glanza",
    features: [
      "360 Degree View Camera",
      "9-inch Smart Playcast Touchscreen",
      "Head Up Display (HUD)",
      "6 Airbags",
      "Auto Climate Control"
    ],
    variants: ["E", "S", "G", "V"],
    colors: ["Sportin Red", "Gaming Grey", "Enticing Silver", "Insta Blue", "Cafe White"],
    category: "Hatchback",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=200"
  },
  "toyota-urban-cruiser-taisor": {
    name: "Toyota Taisor",
    price: "₹7.74 Lakh onwards",
    tagline: "Make Your Move",
    features: [
      "1.0L Turbo Boosterjet Engine",
      "Head Up Display",
      "360-degree View Camera",
      "Wireless Smartphone Charger",
      "Signature LED DRLs"
    ],
    variants: ["E", "S", "S+", "G", "V"],
    colors: ["Lucent Orange", "Sportin Red", "Cafe White", "Enticing Silver", "Gaming Grey"],
    category: "SUV",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=200"
  },
  "toyota-rumion": {
    name: "Toyota Rumion",
    price: "₹10.44 Lakh onwards",
    tagline: "All New Family MPV",
    features: [
      "Neo Drive Engine Tech",
      "Spacious 7-Seater Cabin Layout",
      "Auto AC with Rear Vents",
      "Toyota i-Connect Telematics",
      "Dual Front & Side Airbags"
    ],
    variants: ["S", "G", "V"],
    colors: ["Rustic Brown", "Iconic Grey", "Spunky Blue", "Cafe White", "Enticing Silver"],
    category: "MPV",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=200"
  },
  "toyota-urban-cruiser-hyryder": {
    name: "Toyota Urban Cruiser Hyryder",
    price: "₹11.14 Lakh onwards",
    tagline: "It's Hybrid Time",
    features: [
      "Self-Charging Strong Hybrid Electric Engine",
      "Panoramic Sunroof",
      "Ventilated Front Seats",
      "All-Wheel Drive (AWD) Options",
      "Drive Mode Selector"
    ],
    variants: ["E", "S", "G", "V"],
    colors: ["Cafe White", "Enticing Silver", "Gaming Grey", "Sportin Red", "Cave Black"],
    category: "SUV",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=200"
  },
  "toyota-urban-cruiser-ebella": {
    name: "Toyota Urban Cruiser Ebella",
    price: "₹12.00 Lakh onwards",
    tagline: "The All-Electric SUV Experience",
    features: [
      "High Capacity EV Battery Pack",
      "Intelligent Regenerative Braking System",
      "ADAS Active Safety Suite",
      "Dual Zone Automatic Climate Control",
      "Ultra-Fast DC Charging Support"
    ],
    variants: ["Standard EV", "Pro EV", "Max EV"],
    colors: ["Nebula Blue", "Cafe White", "Cave Black", "Enticing Silver"],
    category: "Electric",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=200"
  },
  "toyota-innova-crysta": {
    name: "Toyota Innova Crysta",
    price: "₹19.99 Lakh onwards",
    tagline: "The Legendary MPV",
    features: [
      "Powerful 2.4L Diesel Engine",
      "Premium Leather Seats",
      "Eco & Power Drive Modes",
      "7 SRS Airbags",
      "Anti-Theft System"
    ],
    variants: ["G", "GX", "VX", "ZX"],
    colors: ["Super White", "Silver Metallic", "Grey Metallic", "Attitude Black Mica", "Bronze Metallic"],
    category: "MPV",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=200"
  },
  "toyota-innova-hycross": {
    name: "Toyota Innova Hycross",
    price: "₹18.86 Lakh onwards",
    tagline: "The Self-Charging Hybrid Electric MPV",
    features: [
      "Strong Hybrid 2.0L Petrol Engine",
      "Ottoman Seats in Second Row",
      "Panoramic Sunroof with Mood Lighting",
      "Toyota Safety Sense ADAS Package",
      "Multi-zone Climate Control"
    ],
    variants: ["G", "GX", "VX", "ZX", "ZX (O)"],
    colors: ["Super White", "Platinum White Pearl", "Silver Metallic", "Attitude Black Mica", "Blackish Ageha Glass Flake"],
    category: "MPV",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=200"
  },
  "toyota-fortuner": {
    name: "Toyota Fortuner",
    price: "₹33.43 Lakh onwards",
    tagline: "The Art of Dominance",
    features: [
      "Powerful 2.8L Diesel/2.7L Petrol Engine",
      "4WD System with High/Low Range Selector",
      "React Front Seats System",
      "11-speaker Premium JBL Audio System",
      "Active Traction Control (A-TRC)"
    ],
    variants: ["Standard 2WD", "Standard 4WD"],
    colors: ["Super White", "Platinum White Pearl", "Grey Metallic", "Attitude Black", "Phantom Brown"],
    category: "SUV",
    image: "https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?auto=format&fit=crop&q=80&w=200"
  },
  "toyota-fortuner-legender": {
    name: "Toyota Fortuner Legender",
    price: "₹43.66 Lakh onwards",
    tagline: "Power Unleashed",
    features: [
      "Exclusive Dual-Tone Exterior Styling",
      "Quad-LED Headlamps with Waterfall DRLs",
      "Kick Sensor Power Back Door",
      "Wireless Smartphone Charger",
      "Ambient Lighting Cabin"
    ],
    variants: ["Legender 4x2", "Legender 4x4"],
    colors: ["Platinum White Pearl with Black Roof"],
    category: "SUV",
    image: "https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?auto=format&fit=crop&q=80&w=200"
  },
  "toyota-hilux": {
    name: "Toyota Hilux",
    price: "₹30.40 Lakh onwards",
    tagline: "Rich Heritage of Toughness",
    features: [
      "4x4 Electronic Drive Switch",
      "Heavy Duty Suspension",
      "Water Wading Depth of 700mm",
      "7 SRS Airbags",
      "Integrated Cargo Deck Hooks"
    ],
    variants: ["Std", "High", "High AT"],
    colors: ["Super White", "Platinum White Pearl", "Grey Metallic", "Silver Metallic", "Emotional Red"],
    category: "SUV",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=200"
  },
  "toyota-camry": {
    name: "Toyota Camry",
    price: "₹46.17 Lakh onwards",
    tagline: "The Luxury Hybrid Sedan",
    features: [
      "Dynamic Force Hybrid Engine",
      "Rear Power Reclining Seats",
      "3-Zone Climate Control",
      "9 Airbags",
      "Heads Up Display"
    ],
    variants: ["Camry Hybrid"],
    colors: ["Platinum White Pearl", "Silver Metallic", "Attitude Black", "Burning Black", "Red Mica Metallic"],
    category: "Sedan",
    image: "https://images.unsplash.com/photo-1503376710915-18861d9a2638?auto=format&fit=crop&q=80&w=200"
  },
  "toyota-vellfire": {
    name: "Toyota Vellfire",
    price: "₹1.20 Crore onwards",
    tagline: "Masterpiece of Luxury",
    features: [
      "Executive Lounge Reclining Ottoman Seats",
      "Strong Hybrid Engine Tech",
      "14-inch Rear Seat Entertainment Screen",
      "15-speaker JBL Premium Sound System",
      "Twin Sunroof Package"
    ],
    variants: ["Hi-Grade", "VIP Grade"],
    colors: ["Black", "Burning Black", "White Pearl Crystal Shine"],
    category: "Luxury",
    image: "https://images.unsplash.com/photo-1517524008436-a3851f153a77?auto=format&fit=crop&q=80&w=200"
  },
  "toyota-landcruiser300": {
    name: "Toyota Land Cruiser 300",
    price: "₹2.10 Crore onwards",
    tagline: "The Pride of Land",
    features: [
      "3.3L Twin-Turbo V6 Diesel Engine",
      "Multi-Terrain Select (MTS)",
      "E-KDSS Electronic Suspension System",
      "Toyota Safety Sense ADAS",
      "Heated & Ventilated Seats"
    ],
    variants: ["ZX"],
    colors: ["Super White", "Precious White Pearl", "Dark Red Mica Metallic", "Attitude Black", "Dark Blue Mica"],
    category: "Luxury",
    image: "https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?auto=format&fit=crop&q=80&w=200"
  }
};

export const BRANCHES: Record<string, Branch> = {
  "brahmapur": {
    name: "Brahmapur",
    address: "National Highway 16, Haldiapadar, Brahmapur, Odisha 760003",
    phone: "+91 94370 00001",
    hours: "Showroom: 09:00 AM - 08:00 PM | Workshop: 08:30 AM - 06:30 PM",
    mapLink: "https://maps.google.com/?q=Laxmi+Toyota+Brahmapur"
  },
  "jeypore": {
    name: "Jeypore",
    address: "NH-26, Jeypore Bypass Road, Jeypore, Odisha 764001",
    phone: "+91 94370 00002",
    hours: "Showroom: 09:00 AM - 08:00 PM | Workshop: 08:30 AM - 06:30 PM",
    mapLink: "https://maps.google.com/?q=Laxmi+Toyota+Jeypore"
  },
  "bargarh": {
    name: "Bargarh",
    address: "NH-53, Canal Avenue, Bargarh, Odisha 768028",
    phone: "+91 94370 00003",
    hours: "Showroom: 09:00 AM - 08:00 PM | Workshop: 08:30 AM - 06:30 PM",
    mapLink: "https://maps.google.com/?q=Laxmi+Toyota+Bargarh"
  },
  "balangir": {
    name: "Balangir",
    address: "Patnagarh Road, Balangir, Odisha 767001",
    phone: "+91 94370 00004",
    hours: "Showroom: 09:00 AM - 08:00 PM | Workshop: 08:30 AM - 06:30 PM",
    mapLink: "https://maps.google.com/?q=Laxmi+Toyota+Balangir"
  },
  "rayagada": {
    name: "Rayagada",
    address: "Gunupur Road, Rayagada, Odisha 765001",
    phone: "+91 94370 00005",
    hours: "Showroom: 09:00 AM - 08:00 PM | Workshop: 08:30 AM - 06:30 PM",
    mapLink: "https://maps.google.com/?q=Laxmi+Toyota+Rayagada"
  },
  "bhawanipatna": {
    name: "Bhawanipatna",
    address: "NH-26, Bhawanipatna, Odisha 766001",
    phone: "+91 94370 00006",
    hours: "Showroom: 09:00 AM - 08:00 PM | Workshop: 08:30 AM - 06:30 PM",
    mapLink: "https://maps.google.com/?q=Laxmi+Toyota+Bhawanipatna"
  },
  "paralakhemundi": {
    name: "Paralakhemundi",
    address: "Palasa Road, Paralakhemundi, Odisha 761200",
    phone: "+91 94370 00007",
    hours: "Showroom: 09:00 AM - 08:00 PM | Workshop: 08:30 AM - 06:30 PM",
    mapLink: "https://maps.google.com/?q=Laxmi+Toyota+Paralakhemundi"
  },
  "aska": {
    name: "Aska",
    address: "Bhanjanagar Road, Aska, Odisha 761111",
    phone: "+91 94370 00008",
    hours: "Showroom: 09:00 AM - 08:00 PM | Workshop: 08:30 AM - 06:30 PM",
    mapLink: "https://maps.google.com/?q=Laxmi+Toyota+Aska"
  }
};
