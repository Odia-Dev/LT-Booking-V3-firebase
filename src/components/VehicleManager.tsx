"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Car, Settings, Image as ImageIcon, IndianRupee, MapPin, 
  Tag, FileText, CheckCircle, Save, Eye, LayoutTemplate,
  Plus, Trash2, UploadCloud, ChevronRight, AlertCircle, Loader2
} from "lucide-react";
import imageCompression from "browser-image-compression";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { VehicleMaster, VehicleVariant, VehicleColor, VehicleOffer } from "@/types/vehicle";

interface VehicleManagerProps {
  initialVehicle?: VehicleMaster;
  vehicleId?: string;
}

const CATEGORIES = ["SUV", "MPV", "Hatchback", "Sedan", "Luxury", "Pickup"];
const BRANCHES = ["Brahmapur", "Jeypore", "Bargarh", "Balangir", "Rayagada", "Bhawanipatna", "Paralakhemundi", "Aska"];
const TABS = [
  { id: "basic", label: "Basic Info & SEO", icon: FileText },
  { id: "pricing", label: "Pricing & Offers", icon: IndianRupee },
  { id: "variants", label: "Variants & Colors", icon: Settings },
  { id: "media", label: "Media Library", icon: ImageIcon },
  { id: "specs", label: "Features & Specs", icon: LayoutTemplate },
  { id: "inventory", label: "Inventory & Branches", icon: MapPin },
];

export default function VehicleManager({ initialVehicle, vehicleId }: VehicleManagerProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [isSaving, setIsSaving] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Map state fields to initial values if provided
  const [basicInfo, setBasicInfo] = useState(initialVehicle?.basicInfo || {
    brand: "Toyota",
    name: "",
    slug: "",
    category: "SUV",
    shortDesc: "",
    longDesc: "",
    tagline: "",
    launchYear: new Date().getFullYear(),
    status: "Draft" as const,
    isFeatured: false
  });

  const [seo, setSeo] = useState(initialVehicle?.seo || {
    title: "",
    description: "",
    keywords: ""
  });

  const [pricing, setPricing] = useState(initialVehicle?.pricing || {
    basePrice: "", // mapped to startingPrice
    bookingAmount: 11000,
    roadTax: 0,
    insurance: 0
  });

  const [variants, setVariants] = useState<any[]>(initialVehicle?.variants || []);
  const [colors, setColors] = useState<VehicleColor[]>(initialVehicle?.colors || []);
  const [media, setMedia] = useState(initialVehicle?.media || {
    images: [] // mapped to gallery
  });

  const [inventory, setInventory] = useState(initialVehicle?.inventory || {
    stockCount: 0, // mapped to totalUnits
    stockStatus: "In Stock" as const, // mapped to stockStatus
    waitingPeriodWeeks: 0 // mapped to waitingPeriod
  });

  const [offers, setOffers] = useState<VehicleOffer[]>(initialVehicle?.offers || []);
  
  // Custom features categorized matching specification fields
  const [features, setFeatures] = useState<string[]>(initialVehicle?.features || []);
  const [newFeature, setNewFeature] = useState("");

  const updateBasicInfo = (field: string, value: any) => {
    setBasicInfo(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const updatePricing = (field: string, value: any) => {
    setPricing(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const updateSEO = (field: string, value: any) => {
    setSeo(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const updateInventory = (field: string, value: any) => {
    setInventory(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  // Variants handlers
  const addVariant = () => {
    setVariants(prev => [
      ...prev,
      { id: `var-${Date.now()}`, name: "", fuel: "Petrol", transmission: "Manual (MT)", price: "" }
    ]);
    setUnsavedChanges(true);
  };

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
    setUnsavedChanges(true);
  };

  const updateVariantField = (index: number, field: string, value: string) => {
    setVariants(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
    setUnsavedChanges(true);
  };

  // Colors handlers
  const addColor = () => {
    setColors(prev => [...prev, { id: `col-${Date.now()}`, name: "", hex: "#000000" }]);
    setUnsavedChanges(true);
  };

  const removeColor = (index: number) => {
    setColors(prev => prev.filter((_, i) => i !== index));
    setUnsavedChanges(true);
  };

  const updateColorField = (index: number, field: string, value: string) => {
    setColors(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
    setUnsavedChanges(true);
  };

  // Offers handlers
  const addOffer = () => {
    setOffers(prev => [...prev, { title: "", discount: 5000, type: "Discount" }]);
    setUnsavedChanges(true);
  };

  const removeOffer = (index: number) => {
    setOffers(prev => prev.filter((_, i) => i !== index));
    setUnsavedChanges(true);
  };

  const updateOfferField = (index: number, field: string, value: any) => {
    setOffers(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
    setUnsavedChanges(true);
  };

  // Features helpers
  const addFeature = () => {
    if (!newFeature.trim()) return;
    setFeatures([...features, newFeature.trim()]);
    setNewFeature("");
    setUnsavedChanges(true);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
    setUnsavedChanges(true);
  };

  // Image Upload with compression
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    if (!basicInfo.slug) {
      alert("Please specify the vehicle URL slug on Tab 1 before uploading images.");
      return;
    }

    setIsUploading(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      const storageRef = ref(storage, `vehicles/${basicInfo.slug}/gallery/${Date.now()}_${file.name}`);
      
      const uploadResult = await uploadBytes(storageRef, compressedFile);
      const downloadUrl = await getDownloadURL(uploadResult.ref);
      
      setMedia(prev => ({
        ...prev,
        images: [...prev.images, downloadUrl]
      }));
      setUnsavedChanges(true);
    } catch (err: any) {
      console.error("Image upload failed:", err);
      alert("Upload failed: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // API Call to save Draft or Publish
  const handleSave = async (status: "Draft" | "Published") => {
    if (!basicInfo.name || !basicInfo.slug) {
      alert("Vehicle Name and URL Slug are required PIM fields.");
      return;
    }

    setIsSaving(true);
    const vehicleMasterData: VehicleMaster = {
      basicInfo: { ...basicInfo, status },
      pricing,
      seo,
      media,
      inventory,
      variants: variants.map(v => ({ id: v.id || `var-${Date.now()}`, name: v.name, price: v.price })),
      colors,
      features,
      offers
    };

    try {
      const endpoint = vehicleId ? `/api/admin/vehicles/${vehicleId}` : "/api/admin/vehicles";
      const method = vehicleId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicle: vehicleMasterData })
      });

      const data = await res.json();
      if (data.success) {
        setUnsavedChanges(false);
        alert(`Vehicle successfully saved as ${status}!`);
        router.push("/admin/dashboard");
      } else {
        alert("Failed to save: " + data.error);
      }
    } catch (err: any) {
      console.error(err);
      alert("Error saving vehicle schema: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Core Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Vehicle Name</label>
            <input 
              type="text" 
              value={basicInfo.name} 
              onChange={(e) => {
                updateBasicInfo("name", e.target.value);
                updateBasicInfo("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"));
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-[#EB0A1E] text-slate-900" 
              placeholder="e.g., Urban Cruiser Hyryder" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">SEO Slug (URL)</label>
            <input 
              type="text" 
              value={basicInfo.slug} 
              onChange={(e) => updateBasicInfo("slug", e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-[#EB0A1E] text-slate-900" 
              placeholder="toyota-urban-cruiser-hyryder" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
            <select 
              value={basicInfo.category} 
              onChange={(e) => updateBasicInfo("category", e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-[#EB0A1E] text-slate-900"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tagline</label>
            <input 
              type="text" 
              value={basicInfo.tagline} 
              onChange={(e) => updateBasicInfo("tagline", e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-[#EB0A1E] text-slate-900" 
              placeholder="Self-Charging Hybrid Electric SUV" 
            />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Short Description (Appears on Cards)</label>
          <textarea 
            rows={2} 
            value={basicInfo.shortDesc} 
            onChange={(e) => updateBasicInfo("shortDesc", e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-[#EB0A1E] resize-none text-slate-900"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Search Engine Optimization</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">SEO Title Tag</label>
            <input 
              type="text" 
              value={seo.title} 
              onChange={(e) => updateSEO("title", e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-[#EB0A1E] text-slate-900" 
              placeholder="Toyota Hyryder Price, Features & Specs in Odisha" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Meta Description</label>
            <textarea 
              rows={2} 
              value={seo.description} 
              onChange={(e) => updateSEO("description", e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-[#EB0A1E] resize-none text-slate-900"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Base Pricing Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Starting Ex-Showroom (Base Variant)</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={pricing.basePrice} 
                onChange={(e) => updatePricing("basePrice", e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 outline-none focus:border-[#EB0A1E] text-slate-900" 
                placeholder="e.g. ₹11.14 Lakh" 
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Online Booking Amount</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                type="number" 
                value={pricing.bookingAmount} 
                onChange={(e) => updatePricing("bookingAmount", parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 outline-none focus:border-[#EB0A1E] text-slate-900" 
                placeholder="21000" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-[#EB0A1E]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900">Active Offers & Discounts</h3>
          <button 
            onClick={addOffer}
            className="text-xs font-bold text-[#EB0A1E] flex items-center bg-red-50 px-3 py-1.5 rounded-md hover:bg-red-100"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Offer
          </button>
        </div>
        {offers.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No active offers configured for this model.</p>
        ) : (
          <div className="space-y-4">
            {offers.map((offer, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <input
                  type="text"
                  placeholder="Offer Title (e.g. ₹5,000 Online Bonus)"
                  value={offer.title}
                  onChange={(e) => updateOfferField(idx, "title", e.target.value)}
                  className="flex-grow bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none text-slate-900"
                />
                <input
                  type="number"
                  placeholder="Value"
                  value={offer.discount}
                  onChange={(e) => updateOfferField(idx, "discount", parseInt(e.target.value) || 0)}
                  className="w-32 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none text-slate-900"
                />
                <button onClick={() => removeOffer(idx)} className="text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderVariants = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Variant Management</h3>
            <p className="text-xs text-slate-500">Add all available trims (e.g., E MT, G Hybrid, V AT)</p>
          </div>
          <button onClick={addVariant} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-slate-800 flex items-center">
            <Plus className="w-4 h-4 mr-2" /> Add Variant
          </button>
        </div>

        {variants.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No variants added yet. Click above to start building the lineup.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {variants.map((v, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-4 p-4 border border-slate-200 rounded-lg bg-slate-50 items-center">
                <div className="flex-1">
                   <label className="block text-[10px] font-bold text-slate-400 uppercase">Variant Name</label>
                   <input 
                     type="text" 
                     value={v.name} 
                     onChange={(e) => updateVariantField(idx, "name", e.target.value)}
                     className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-sm outline-none text-slate-900" 
                     placeholder="e.g. S E-CNG" 
                   />
                </div>
                <div className="w-32">
                   <label className="block text-[10px] font-bold text-slate-400 uppercase">Trans. / Trim</label>
                   <input 
                     type="text" 
                     value={v.fuel || ""} 
                     onChange={(e) => updateVariantField(idx, "fuel", e.target.value)}
                     className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-sm outline-none text-slate-900" 
                     placeholder="Fuel/Trans" 
                   />
                </div>
                <div className="w-32">
                   <label className="block text-[10px] font-bold text-slate-400 uppercase">Ex-Showroom Price</label>
                   <input 
                     type="text" 
                     value={v.price} 
                     onChange={(e) => updateVariantField(idx, "price", e.target.value)}
                     className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-sm outline-none text-slate-900" 
                     placeholder="e.g. ₹12.82 Lakh" 
                   />
                </div>
                <button onClick={() => removeVariant(idx)} className="text-red-400 hover:text-red-650 p-2 mt-4 md:mt-0">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900">Color Palette</h3>
          <button 
            onClick={addColor}
            className="text-xs font-bold text-[#EB0A1E] flex items-center bg-red-50 px-3 py-1.5 rounded-md hover:bg-red-100"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Color
          </button>
        </div>
        {colors.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No colors configured.</p>
        ) : (
          <div className="space-y-3">
            {colors.map((c, i) => (
              <div key={c.id} className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Color Name (e.g. Attitude Black)"
                  value={c.name}
                  onChange={(e) => updateColorField(i, "name", e.target.value)}
                  className="flex-grow bg-slate-55 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 outline-none"
                />
                <input
                  type="color"
                  value={c.hex}
                  onChange={(e) => updateColorField(i, "hex", e.target.value)}
                  className="w-16 h-8 border border-slate-200 rounded-lg bg-transparent cursor-pointer"
                />
                <button onClick={() => removeColor(i)} className="text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Availability Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Global Stock Status</label>
            <select 
              value={inventory.stockStatus} 
              onChange={(e) => updateInventory("stockStatus", e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-[#EB0A1E] text-slate-900"
            >
              <option value="In Stock">In Stock (Available immediately)</option>
              <option value="Waitlisted">Waitlisted (Booking required)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Average Waiting Weeks</label>
            <input 
              type="number" 
              value={inventory.waitingPeriodWeeks} 
              onChange={(e) => updateInventory("waitingPeriodWeeks", parseInt(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-[#EB0A1E] text-slate-900" 
              placeholder="e.g. 12" 
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Showroom Availability</h3>
        <p className="text-xs text-slate-500 mb-4">Select which showrooms are authorized to sell and display this vehicle.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BRANCHES.map(branch => (
            <label key={branch} className="flex items-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <input type="checkbox" className="w-4 h-4 text-[#EB0A1E] rounded border-gray-300 focus:ring-[#EB0A1E]" defaultChecked />
              <span className="ml-2 text-sm font-medium text-slate-700">{branch}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Sticky Header Actions */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
              <Car className="w-6 h-6 mr-2 text-[#EB0A1E]" /> 
              {basicInfo.name ? basicInfo.name : "New Vehicle Master"}
            </h1>
            <div className="flex items-center text-xs mt-1">
              <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${basicInfo.status === "Draft" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                {basicInfo.status}
              </span>
              {unsavedChanges && <span className="ml-2 text-slate-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> Unsaved changes</span>}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => handleSave("Draft")}
              disabled={isSaving}
              className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-sm px-4 py-2 rounded-lg flex items-center transition-colors disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save Draft
            </button>
            <button 
              onClick={() => handleSave("Published")}
              disabled={isSaving}
              className="bg-[#EB0A1E] text-white hover:bg-red-750 font-bold text-sm px-6 py-2 rounded-lg shadow-md flex items-center transition-colors disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />} Publish Live
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-sm sticky top-28">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-lg mb-1 transition-all ${
                    isActive 
                      ? "bg-red-50 text-[#EB0A1E]" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? "text-[#EB0A1E]" : "text-slate-400"}`} />
                  {tab.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === "basic" && renderBasicInfo()}
          {activeTab === "pricing" && renderPricing()}
          {activeTab === "variants" && renderVariants()}
          {activeTab === "inventory" && renderInventory()}

          {/* Media Tab */}
          {activeTab === "media" && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Media Library</h3>
              
              <div className="flex items-center justify-center border-2 border-dashed border-slate-200 hover:border-red-500 rounded-xl p-8 transition-colors relative cursor-pointer bg-slate-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="text-center space-y-2">
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 text-[#EB0A1E] mx-auto animate-spin" />
                  ) : (
                    <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                  )}
                  <h4 className="text-sm font-bold text-slate-800">
                    {isUploading ? "Compressing & Uploading..." : "Upload High-Res Banner"}
                  </h4>
                  <p className="text-xs text-slate-400">Compressed automatically on client browser before storage upload.</p>
                </div>
              </div>

              {media.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {media.images.map((img, i) => (
                    <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group">
                      <img src={img} alt="Vehicle gallery" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setMedia(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}
                        className="absolute inset-0 bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Specs / Features Tab */}
          {activeTab === "specs" && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 font-black">Specs & Feature Checklist</h3>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a product feature (e.g. Panoramic sunroof)"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="flex-grow bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none text-slate-900"
                />
                <button
                  onClick={addFeature}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Add Feature
                </button>
              </div>

              {features.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No features configured.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 border border-slate-200 rounded-lg bg-slate-50 text-xs font-semibold text-slate-800">
                      <span>{feature}</span>
                      <button onClick={() => removeFeature(idx)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
