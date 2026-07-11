"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { db, storage, isConfigured } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { MediaAsset, MediaType, VehicleMaster } from "@/types/inventory";
import {
  Plus,
  Search,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  ImageIcon,
  Film,
  Upload,
  Trash2,
  Copy,
  ExternalLink,
  Archive,
  LayoutGrid,
  List,
  Filter,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "lt_media_assets";

const CATEGORIES = [
  "Hero",
  "Gallery",
  "Exterior",
  "Interior",
  "Video",
  "Brochure",
  "Banner",
  "Other",
];

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function getMediaType(mimeType: string): MediaType {
  return mimeType.startsWith("video/") ? "video" : "image";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MediaManagerClient() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [vehicles, setVehicles] = useState<VehicleMaster[]>([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadVehicleId, setUploadVehicleId] = useState("");
  const [uploadVehicleName, setUploadVehicleName] = useState("General");
  const [uploadCategory, setUploadCategory] = useState("Gallery");
  const [uploadAltText, setUploadAltText] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Load Data ──────────────────────────────────────────────────────────────
  const fetchData = async (isMounted: { current: boolean }) => {
    setLoading(true);
    try {
      if (isConfigured) {
        const [aSnap, vhSnap] = await Promise.all([
          getDocs(collection(db, "media_assets")),
          getDocs(collection(db, "vehicles_master")),
        ]);
        const aList: MediaAsset[] = [];
        aSnap.forEach((d) => aList.push({ id: d.id, ...d.data() } as MediaAsset));

        const vhList: VehicleMaster[] = [];
        vhSnap.forEach((d) => vhList.push({ id: d.id, ...d.data() } as VehicleMaster));

        if (isMounted.current) {
          setAssets(aList);
          setVehicles(vhList);
        }
      } else {
        const localA = localStorage.getItem(STORAGE_KEY);
        const localVh = localStorage.getItem("lt_vehicles_master");
        if (isMounted.current) {
          setAssets(localA ? JSON.parse(localA) : []);
          setVehicles(localVh ? JSON.parse(localVh) : []);
        }
      }
    } catch (err: unknown) {
      if (isMounted.current) {
        showToast("Failed to load: " + (err instanceof Error ? err.message : String(err)), "error");
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    const isMounted = { current: true };
    const run = async () => { await fetchData(isMounted); };
    run();
    return () => { isMounted.current = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    const isMounted = { current: true };
    await fetchData(isMounted);
  };

  // ── Upload ─────────────────────────────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const totalFiles = files.length;
      let completed = 0;

      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        const now = new Date().toISOString();
        const mimeType = file.type;
        const mediaType = getMediaType(mimeType);
        const folderPath = uploadVehicleId ? `media/vehicles/${uploadVehicleId}` : "media/general";
        const storagePath = `${folderPath}/${Date.now()}_${file.name}`;

        let fileUrl = "";

        if (isConfigured) {
          // Upload to Firebase Storage
          const storageRef = ref(storage, storagePath);
          const uploadTask = uploadBytesResumable(storageRef, file);

          fileUrl = await new Promise<string>((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const fileProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                const overallProgress = ((completed + fileProgress / 100) / totalFiles) * 100;
                setUploadProgress(Math.round(overallProgress));
              },
              (error) => reject(error),
              async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(url);
              }
            );
          });
        } else {
          // Local fallback — use object URL representation
          fileUrl = URL.createObjectURL(file);
        }

        const asset: Omit<MediaAsset, "id"> = {
          fileName: file.name,
          fileUrl,
          storagePath,
          mediaType,
          mimeType,
          fileSizeBytes: file.size,
          vehicleId: uploadVehicleId,
          vehicleName: uploadVehicleName,
          category: uploadCategory,
          altText: uploadAltText || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          displayOrder: assets.length + i + 1,
          status: "Active",
          uploadedBy: "Admin",
          createdAt: now,
          updatedAt: now,
        };

        if (isConfigured) {
          await addDoc(collection(db, "media_assets"), asset);
        } else {
          const existing = localStorage.getItem(STORAGE_KEY);
          const list: MediaAsset[] = existing ? JSON.parse(existing) : [];
          list.push({ ...asset, id: `local_${Date.now()}_${i}` });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        }

        completed++;
        setUploadProgress(Math.round((completed / totalFiles) * 100));
      }

      showToast(`${totalFiles} file(s) uploaded successfully.`);
      setIsUploadOpen(false);
      setUploadAltText("");
      await loadData();
    } catch (err: unknown) {
      showToast("Upload failed: " + (err instanceof Error ? err.message : String(err)), "error");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── Archive ────────────────────────────────────────────────────────────────
  const archiveAsset = async (asset: MediaAsset) => {
    if (!asset.id) return;
    try {
      const update: Partial<MediaAsset> = { status: "Archived", updatedAt: new Date().toISOString() };
      if (isConfigured) {
        await updateDoc(doc(db, "media_assets", asset.id), update as Record<string, unknown>);
      } else {
        const existing = localStorage.getItem(STORAGE_KEY);
        const list: MediaAsset[] = existing ? JSON.parse(existing) : [];
        const idx = list.findIndex((a) => a.id === asset.id);
        if (idx >= 0) list[idx] = { ...list[idx], ...update };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }
      showToast("Asset archived.");
      await loadData();
    } catch (err: unknown) {
      showToast("Archive failed: " + (err instanceof Error ? err.message : String(err)), "error");
    }
  };

  // ── Copy URL ───────────────────────────────────────────────────────────────
  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      showToast("URL copied to clipboard.");
    } catch {
      showToast("Failed to copy URL.", "error");
    }
  };

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return assets
      .filter((a) => a.status === "Active")
      .filter((a) => vehicleFilter === "All" || a.vehicleName === vehicleFilter)
      .filter((a) => categoryFilter === "All" || a.category === categoryFilter)
      .filter((a) => {
        const q = searchQuery.toLowerCase();
        return !q || a.fileName.toLowerCase().includes(q) || a.altText.toLowerCase().includes(q) || a.vehicleName.toLowerCase().includes(q);
      })
      .sort((a, b) => a.displayOrder - b.displayOrder || (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
  }, [assets, vehicleFilter, categoryFilter, searchQuery]);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalImages = assets.filter((a) => a.mediaType === "image" && a.status === "Active").length;
  const totalVideos = assets.filter((a) => a.mediaType === "video" && a.status === "Active").length;
  const totalSize = assets.filter((a) => a.status === "Active").reduce((sum, a) => sum + a.fileSizeBytes, 0);

  // Unique vehicle names for filter
  const vehicleNames = useMemo(() => {
    const names = new Set(assets.map((a) => a.vehicleName));
    return Array.from(names).sort();
  }, [assets]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold text-white animate-in slide-in-from-top duration-300 ${
          toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
        }`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ImageIcon className="text-[#EB0A1E] w-6 h-6" />
            Media Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">Upload, organize, and manage vehicle images and video assets.</p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 bg-[#EB0A1E] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg transition-all"
        >
          <Upload className="w-4 h-4" /> Upload Files
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-900/40 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <p className="text-xl font-black text-white">{totalImages}</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Images</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-900/40 flex items-center justify-center">
            <Film className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-xl font-black text-white">{totalVideos}</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Videos</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-900/40 flex items-center justify-center">
            <Archive className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xl font-black text-white">{formatFileSize(totalSize)}</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Total Size</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by filename, alt text, or vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-[#EB0A1E] transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#EB0A1E] transition-colors"
            >
              <option value="All">All Vehicles</option>
              {vehicleNames.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#EB0A1E] transition-colors"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex border border-slate-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-all ${viewMode === "grid" ? "bg-[#EB0A1E] text-white" : "bg-slate-900 text-slate-400 hover:text-white"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-all ${viewMode === "list" ? "bg-[#EB0A1E] text-white" : "bg-slate-900 text-slate-400 hover:text-white"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3">
          <Loader2 className="w-7 h-7 text-[#EB0A1E] animate-spin" />
          <span className="text-sm text-slate-400">Loading media assets...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-semibold">No media assets found.</p>
          <p className="text-slate-600 text-xs mt-1">Click &ldquo;Upload Files&rdquo; to add images and videos.</p>
        </div>
      ) : viewMode === "grid" ? (
        /* ═══ Grid View ═══ */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((asset) => (
            <div key={asset.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-slate-600 transition-all">
              {/* Thumbnail */}
              <div className="relative aspect-square bg-slate-950 overflow-hidden">
                {asset.mediaType === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.fileUrl}
                    alt={asset.altText}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film className="w-10 h-10 text-slate-700" />
                  </div>
                )}
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => copyUrl(asset.fileUrl)} title="Copy URL" className="p-2 bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-all">
                    <Copy className="w-4 h-4" />
                  </button>
                  <a href={asset.fileUrl} target="_blank" rel="noopener noreferrer" title="Open" className="p-2 bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-all">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button onClick={() => archiveAsset(asset)} title="Archive" className="p-2 bg-slate-800 rounded-lg text-slate-300 hover:text-red-400 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {/* Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                    asset.mediaType === "video" ? "bg-purple-900/80 text-purple-300" : "bg-sky-900/80 text-sky-300"
                  }`}>
                    {asset.mediaType === "video" ? <Film className="w-2.5 h-2.5" /> : <ImageIcon className="w-2.5 h-2.5" />}
                    {asset.mediaType}
                  </span>
                </div>
              </div>
              {/* Info */}
              <div className="p-3">
                <p className="text-[11px] font-semibold text-white truncate">{asset.fileName}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{asset.category}</span>
                  <span className="text-[9px] text-slate-600">{formatFileSize(asset.fileSizeBytes)}</span>
                </div>
                <p className="text-[9px] text-slate-500 mt-1 truncate">{asset.vehicleName}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ═══ List View ═══ */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/50">
                  <th className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">File</th>
                  <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Vehicle</th>
                  <th className="text-center px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</th>
                  <th className="text-center px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Type</th>
                  <th className="text-right px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Size</th>
                  <th className="text-center px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-950 overflow-hidden shrink-0">
                          {asset.mediaType === "image" ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={asset.fileUrl} alt={asset.altText} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><Film className="w-4 h-4 text-slate-700" /></div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate max-w-[200px]">{asset.fileName}</p>
                          <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{asset.altText}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-300">{asset.vehicleName}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">{asset.category}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        asset.mediaType === "video" ? "bg-purple-900/50 text-purple-400" : "bg-sky-900/50 text-sky-400"
                      }`}>
                        {asset.mediaType === "video" ? <Film className="w-2.5 h-2.5" /> : <ImageIcon className="w-2.5 h-2.5" />}
                        {asset.mediaType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-[11px] text-slate-400 font-mono">{formatFileSize(asset.fileSizeBytes)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => copyUrl(asset.fileUrl)} title="Copy URL" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <a href={asset.fileUrl} target="_blank" rel="noopener noreferrer" title="Open" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button onClick={() => archiveAsset(asset)} title="Archive" className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ Upload Panel ═══ */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-slate-950/80 backdrop-blur-sm" onClick={() => !uploading && setIsUploadOpen(false)} />
          <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full overflow-y-auto shadow-2xl flex flex-col">

            {/* Panel Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-10">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Upload Media</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Select files and assign vehicle + category.</p>
              </div>
              <button
                onClick={() => !uploading && setIsUploadOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Panel Body */}
            <div className="p-6 space-y-5 flex-1">

              {/* Vehicle */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Assign to Vehicle</label>
                <select
                  value={uploadVehicleId}
                  onChange={(e) => {
                    setUploadVehicleId(e.target.value);
                    const v = vehicles.find((vh) => vh.id === e.target.value);
                    setUploadVehicleName(e.target.value === "" ? "General" : (v?.basicInfo?.name ?? e.target.value));
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#EB0A1E] transition-colors"
                >
                  <option value="">General (Unassigned)</option>
                  {vehicles.map((vh) => (
                    <option key={vh.id} value={vh.id}>{vh.basicInfo?.name ?? vh.id}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#EB0A1E] transition-colors"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Alt Text <span className="text-slate-600 normal-case tracking-normal font-normal">(optional — auto-generated from filename if empty)</span>
                </label>
                <input
                  type="text"
                  value={uploadAltText}
                  onChange={(e) => setUploadAltText(e.target.value)}
                  placeholder="e.g. Toyota Fortuner front exterior view"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#EB0A1E] transition-colors"
                />
              </div>

              {/* Drop Zone */}
              <div className="border-2 border-dashed border-slate-700 hover:border-[#EB0A1E] rounded-2xl p-8 text-center transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400 font-semibold">Click to select files</p>
                <p className="text-[10px] text-slate-600 mt-1">
                  Supports: JPG, PNG, WEBP, SVG, MP4, WEBM • Multiple files allowed
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#EB0A1E]" />
                      Uploading...
                    </span>
                    <span className="text-white font-bold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#EB0A1E] h-full rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Panel Footer */}
            <div className="px-6 py-5 border-t border-slate-800 bg-slate-950/60 sticky bottom-0">
              <button
                onClick={() => !uploading && setIsUploadOpen(false)}
                disabled={uploading}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
