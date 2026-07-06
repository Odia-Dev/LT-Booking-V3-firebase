"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { VehicleMaster, VehicleVariant, VehicleColor, VehicleOffer } from "@/types/vehicle";
import imageCompression from "browser-image-compression";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { Plus, Trash2, Save, Send, Image as ImageIcon, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface VehicleManagerProps {
  initialVehicle?: VehicleMaster;
  vehicleId?: string;
}

export default function VehicleManager({ initialVehicle, vehicleId }: VehicleManagerProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Initialize PIM State
  const [basicInfo, setBasicInfo] = useState(initialVehicle?.basicInfo || {
    brand: "Toyota",
    name: "",
    slug: "",
    type: "SUV",
    description: "",
    status: "Draft" as const
  });

  const [pricing, setPricing] = useState(initialVehicle?.pricing || {
    basePrice: "",
    bookingAmount: 11000,
    roadTax: 0,
    insurance: 0
  });

  const [seo, setSeo] = useState(initialVehicle?.seo || {
    title: "",
    description: "",
    keywords: ""
  });

  const [media, setMedia] = useState(initialVehicle?.media || {
    images: []
  });

  const [inventory, setInventory] = useState(initialVehicle?.inventory || {
    stockCount: 5,
    stockStatus: "In Stock" as const,
    waitingPeriodWeeks: 0
  });

  const [variants, setVariants] = useState<VehicleVariant[]>(initialVehicle?.variants || []);
  const [colors, setColors] = useState<VehicleColor[]>(initialVehicle?.colors || []);
  const [features, setFeatures] = useState<string[]>(initialVehicle?.features || []);
  const [offers, setOffers] = useState<VehicleOffer[]>(initialVehicle?.offers || []);

  const [newFeature, setNewFeature] = useState("");

  // Variant helper rows
  const addVariant = () => {
    setVariants([...variants, { id: `var-${Date.now()}`, name: "", price: "" }]);
  };
  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };
  const updateVariant = (index: number, key: keyof VehicleVariant, val: string) => {
    const next = [...variants];
    next[index] = { ...next[index], [key]: val };
    setVariants(next);
  };

  // Color helper rows
  const addColor = () => {
    setColors([...colors, { id: `col-${Date.now()}`, name: "", hex: "#000000" }]);
  };
  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };
  const updateColor = (index: number, key: keyof VehicleColor, val: string) => {
    const next = [...colors];
    next[index] = { ...next[index], [key]: val };
    setColors(next);
  };

  // Features helpers
  const addFeature = () => {
    if (!newFeature.trim()) return;
    setFeatures([...features, newFeature.trim()]);
    setNewFeature("");
  };
  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Offers helpers
  const addOffer = () => {
    setOffers([...offers, { title: "", discount: 5000, type: "Discount" }]);
  };
  const removeOffer = (index: number) => {
    setOffers(offers.filter((_, i) => i !== index));
  };
  const updateOffer = (index: number, key: keyof VehicleOffer, val: any) => {
    const next = [...offers];
    next[index] = { ...next[index], [key]: val };
    setOffers(next);
  };

  // Compressed Image Upload to Firebase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    if (!basicInfo.slug) {
      alert("Please specify the vehicle URL slug before uploading images.");
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
      
      setMedia({
        images: [...media.images, downloadUrl]
      });
    } catch (err: any) {
      console.error("Image upload compression failed:", err);
      alert("Failed to compress or upload image: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Form Submission
  const saveVehicle = async (status: "Draft" | "Published") => {
    if (!basicInfo.name || !basicInfo.slug) {
      alert("Vehicle Name and URL Slug are required PIM fields.");
      return;
    }

    setIsSubmitting(true);
    const vehicleMasterData: VehicleMaster = {
      basicInfo: { ...basicInfo, status },
      pricing,
      seo,
      media,
      inventory,
      variants,
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
        alert(`Vehicle successfully saved as ${status}!`);
        router.push("/admin/dashboard");
      } else {
        alert("Failed to save: " + data.error);
      }
    } catch (err: any) {
      console.error("Save vehicle error:", err);
      alert("Error saving vehicle: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8 text-left">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-5 border-b border-zinc-800">
        <div>
          <Link href="/admin/dashboard" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors gap-1 mb-2">
            <ArrowLeft className="w-4 h-4" /> Admin Console
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-white">
            {vehicleId ? "Edit Vehicle Schema" : "Create New Vehicle PIM"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => saveVehicle("Draft")}
            disabled={isSubmitting}
            className="inline-flex items-center bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-lg transition-colors gap-2"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </button>
          <button
            onClick={() => saveVehicle("Published")}
            disabled={isSubmitting}
            className="inline-flex items-center bg-[#EB0A1E] hover:bg-red-750 text-white font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-lg transition-colors gap-2 shadow-lg shadow-red-500/10"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Publish
          </button>
        </div>
      </div>

      {/* Grid Configuration Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Basic Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Basic Info */}
          <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-zinc-800 pb-2">Basic Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Brand Name</label>
                <input
                  type="text"
                  value={basicInfo.brand}
                  onChange={(e) => setBasicInfo({ ...basicInfo, brand: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Vehicle Name</label>
                <input
                  type="text"
                  placeholder="e.g. Fortuner"
                  value={basicInfo.name}
                  onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">URL Slug</label>
                <input
                  type="text"
                  placeholder="e.g. toyota-fortuner"
                  value={basicInfo.slug}
                  onChange={(e) => setBasicInfo({ ...basicInfo, slug: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Segment Class</label>
                <select
                  value={basicInfo.type}
                  onChange={(e) => setBasicInfo({ ...basicInfo, type: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white outline-none focus:border-red-500 transition-colors"
                >
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="MPV">MPV</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Description</label>
              <textarea
                rows={3}
                placeholder="Product summary details..."
                value={basicInfo.description}
                onChange={(e) => setBasicInfo({ ...basicInfo, description: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>

          {/* Section 2: Variants */}
          <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Variants</h3>
              <button
                onClick={addVariant}
                className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-[#EB0A1E] hover:underline gap-0.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>
            {variants.length === 0 ? (
              <p className="text-xs text-zinc-500 italic">No variants created. Click Add Row.</p>
            ) : (
              <div className="space-y-3">
                {variants.map((v, i) => (
                  <div key={v.id} className="flex gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Variant Name (e.g. VX Hybrid)"
                      value={v.name}
                      onChange={(e) => updateVariant(i, "name", e.target.value)}
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white outline-none focus:border-red-500"
                    />
                    <input
                      type="text"
                      placeholder="Ex-Showroom Price (e.g. ₹19.53 Lakh)"
                      value={v.price}
                      onChange={(e) => updateVariant(i, "price", e.target.value)}
                      className="w-48 bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white outline-none focus:border-red-500"
                    />
                    <button
                      onClick={() => removeVariant(i)}
                      className="text-zinc-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Colors */}
          <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Color Palette</h3>
              <button
                onClick={addColor}
                className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-[#EB0A1E] hover:underline gap-0.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>
            {colors.length === 0 ? (
              <p className="text-xs text-zinc-500 italic">No colors created. Click Add Row.</p>
            ) : (
              <div className="space-y-3">
                {colors.map((c, i) => (
                  <div key={c.id} className="flex gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Color Name (e.g. Attitude Black)"
                      value={c.name}
                      onChange={(e) => updateColor(i, "name", e.target.value)}
                      className="flex-grow bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white outline-none"
                    />
                    <input
                      type="color"
                      value={c.hex}
                      onChange={(e) => updateColor(i, "hex", e.target.value)}
                      className="w-16 h-8 border border-zinc-800 rounded-lg bg-transparent cursor-pointer"
                    />
                    <button
                      onClick={() => removeColor(i)}
                      className="text-zinc-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Pricing, Inventory, SEO & Image Upload */}
        <div className="space-y-6">
          
          {/* Pricing Config */}
          <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-zinc-800 pb-2">Pricing Setup</h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Base Cost</label>
                <input
                  type="text"
                  placeholder="e.g. ₹11.14 Lakh"
                  value={pricing.basePrice}
                  onChange={(e) => setPricing({ ...pricing, basePrice: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Booking Amount (₹)</label>
                <input
                  type="number"
                  value={pricing.bookingAmount}
                  onChange={(e) => setPricing({ ...pricing, bookingAmount: parseInt(e.target.value) || 0 })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Inventory Config */}
          <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-zinc-800 pb-2">Inventory</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Stock Count</label>
                <input
                  type="number"
                  value={inventory.stockCount}
                  onChange={(e) => setInventory({ ...inventory, stockCount: parseInt(e.target.value) || 0 })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</label>
                <select
                  value={inventory.stockStatus}
                  onChange={(e) => setInventory({ ...inventory, stockStatus: e.target.value as any })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white outline-none"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Waitlisted">Waitlisted</option>
                </select>
              </div>
            </div>
          </div>

          {/* Image Upload Gallery */}
          <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-zinc-800 pb-2">Media & Gallery</h3>
            
            <div className="flex items-center justify-center border-2 border-dashed border-zinc-800 hover:border-red-500 rounded-xl p-6 transition-colors relative cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="text-center space-y-1">
                {isUploading ? (
                  <Loader2 className="w-6 h-6 text-[#EB0A1E] mx-auto animate-spin" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-zinc-400 mx-auto" />
                )}
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  {isUploading ? "Compressing & Uploading..." : "Upload & Compress Image"}
                </p>
              </div>
            </div>

            {media.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-2">
                {media.images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-800 group">
                    <img src={img} alt="Vehicle gallery" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setMedia({ images: media.images.filter((_, idx) => idx !== i) })}
                      className="absolute inset-0 bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SEO config */}
          <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-zinc-800 pb-2">SEO Desk</h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Meta Title</label>
                <input
                  type="text"
                  value={seo.title}
                  onChange={(e) => setSeo({ ...seo, title: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Meta Description</label>
                <textarea
                  rows={2}
                  value={seo.description}
                  onChange={(e) => setSeo({ ...seo, description: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white outline-none"
                />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
