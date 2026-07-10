"use client";

import React, { useEffect, useState } from "react";
import { db, isConfigured } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import Papa from "papaparse";
import { useAuth } from "@/context/AuthContext";
import { logStockMovement } from "@/lib/inventoryLogger";
import { 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  FileSpreadsheet, 
  PlusCircle, 
  FileDown
} from "lucide-react";

interface VehicleStockRecord {
  id?: string;
  vehicle: string;
  variant: string;
  color: string;
  vin: string;
  engineNo: string;
  chassisNo: string;
  mfgMonthYear: string;
  branch: string;
  arrivalDate: string;
  status: "Available" | "PDI" | "Booked" | "Delivered" | "Archived";
  createdAt?: string;
  updatedAt?: string;
}

interface ParsedCSVRow {
  vehicle?: string;
  variant?: string;
  color?: string;
  vin?: string;
  engineNo?: string;
  chassisNo?: string;
  mfgMonthYear?: string;
  branch?: string;
  arrivalDate?: string;
}

interface ValidatedRow extends VehicleStockRecord {
  validationStatus: "Valid" | "Duplicate (CSV)" | "Duplicate (DB)" | "Invalid";
  validationError?: string;
}

const OFFICIAL_BRANCHES = [
  "Berhampur",
  "Jeypore",
  "Bargarh",
  "Balangir",
  "Rayagada",
  "Bhawanipatna",
  "Paralakhemundi",
  "Aska"
];

export default function ReceiveClient() {
  const { user } = useAuth();
  
  // Database references
  const [vehiclesList, setVehiclesList] = useState<string[]>([]);
  const [variantsList, setVariantsList] = useState<string[]>([]);
  const [colorsList, setColorsList] = useState<string[]>([]);

  // Form states (Manual Entry)
  const [vehicle, setVehicle] = useState("");
  const [variant, setVariant] = useState("");
  const [color, setColor] = useState("");
  const [vin, setVin] = useState("");
  const [engineNo, setEngineNo] = useState("");
  const [chassisNo, setChassisNo] = useState("");
  const [mfgMonthYear, setMfgMonthYear] = useState("");
  const [branch, setBranch] = useState("Berhampur");
  const [arrivalDate, setArrivalDate] = useState(() => new Date().toISOString().split("T")[0]);

  // Bulk / CSV Upload States
  const [uploadedRows, setUploadedRows] = useState<ValidatedRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [committing, setCommitting] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load configuration dropdown parameters
  useEffect(() => {
    let isMounted = true;
    async function loadCMSData() {
      try {
        if (isConfigured) {
          const vhSnap = await getDocs(collection(db, "vehicles_master"));
          const vhNames: string[] = [];
          vhSnap.forEach((d) => {
            const data = d.data();
            if (data.basicInfo?.name) vhNames.push(data.basicInfo.name);
          });

          const vrSnap = await getDocs(collection(db, "variants_master"));
          const vrNames: string[] = [];
          vrSnap.forEach((d) => {
            const data = d.data();
            if (data.name) vrNames.push(data.name);
          });

          const colSnap = await getDocs(collection(db, "colors_master"));
          const colNames: string[] = [];
          colSnap.forEach((d) => {
            const data = d.data();
            if (data.colorName) colNames.push(data.colorName);
          });

          if (isMounted) {
            setVehiclesList(vhNames);
            setVariantsList(vrNames);
            setColorsList(colNames);
            if (vhNames.length > 0) setVehicle(vhNames[0]);
            if (vrNames.length > 0) setVariant(vrNames[0]);
            if (colNames.length > 0) setColor(colNames[0]);
          }
        } else {
          // Fallbacks for local storage
          const localV = localStorage.getItem("lt_vehicles_master");
          const localVr = localStorage.getItem("lt_variants_master");
          const localCol = localStorage.getItem("lt_colors_master");

          const vhNames = localV ? (JSON.parse(localV) as Array<{ basicInfo: { name: string } }>).map((v) => v.basicInfo.name) : ["Fortuner", "Innova Hycross", "Glanza"];
          const vrNames = localVr ? (JSON.parse(localVr) as Array<{ name: string }>).map((v) => v.name) : ["2.8L 4x4 AT", "ZX (O) Hybrid", "V MT"];
          const colNames = localCol ? (JSON.parse(localCol) as Array<{ colorName: string }>).map((c) => c.colorName) : ["Attitude Black Mica", "Platinum White Pearl", "Super White"];

          if (isMounted) {
            setVehiclesList(vhNames);
            setVariantsList(vrNames);
            setColorsList(colNames);
            setVehicle(vhNames[0] || "");
            setVariant(vrNames[0] || "");
            setColor(colNames[0] || "");
          }
        }
      } catch (err: unknown) {
        console.error("Error loading dropdown data:", err);
      }
    }
    loadCMSData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch registered VIN list to prevent duplicates
  const getExistingVINs = async (): Promise<Set<string>> => {
    const vinSet = new Set<string>();
    if (isConfigured) {
      const snap = await getDocs(collection(db, "inventory_items"));
      snap.forEach((d) => {
        const data = d.data();
        if (data.vin) vinSet.add((data.vin as string).toUpperCase());
      });
    } else {
      const local = localStorage.getItem("lt_inventory_items");
      if (local) {
        (JSON.parse(local) as Array<{ vin?: string }>).forEach((item) => {
          if (item.vin) vinSet.add(item.vin.toUpperCase());
        });
      }
    }
    return vinSet;
  };

  // Submit Manual Form
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vehicle || !variant || !color || !vin.trim() || !engineNo.trim() || !chassisNo.trim()) {
      showToast("Please fill all required vehicle fields.", "error");
      return;
    }

    setCommitting(true);
    try {
      const cleanedVin = vin.trim().toUpperCase();
      const existing = await getExistingVINs();

      if (existing.has(cleanedVin)) {
        showToast(`Vehicle with VIN ${cleanedVin} is already registered in the inventory.`, "error");
        setCommitting(false);
        return;
      }

      const payload: VehicleStockRecord = {
        vehicle,
        variant,
        color,
        vin: cleanedVin,
        engineNo: engineNo.trim().toUpperCase(),
        chassisNo: chassisNo.trim().toUpperCase(),
        mfgMonthYear: mfgMonthYear.trim(),
        branch,
        arrivalDate,
        status: "Available",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (isConfigured) {
        // VIN acts as document key to guarantee uniqueness at database level
        await setDoc(doc(db, "inventory_items", cleanedVin), payload);
      } else {
        const local = localStorage.getItem("lt_inventory_items");
        const list = local ? JSON.parse(local) as VehicleStockRecord[] : [];
        list.push(payload);
        localStorage.setItem("lt_inventory_items", JSON.stringify(list));
      }

      // Log the movement
      await logStockMovement(
        cleanedVin,
        "None",
        "Available",
        user?.email || "anonymous_edp",
        "Initial stock intake (Manual receive)"
      );

      showToast(`Vehicle VIN ${cleanedVin} successfully received into inventory!`);
      // Reset inputs
      setVin("");
      setEngineNo("");
      setChassisNo("");
      setMfgMonthYear("");
    } catch (err: unknown) {
      const errorObj = err as Error;
      showToast("Error saving stock item: " + errorObj.message, "error");
    } finally {
      setCommitting(false);
    }
  };

  // CSV Parse & Validate
  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setIsProcessing(true);
    try {
      const existingVINs = await getExistingVINs();
      
      Papa.parse<ParsedCSVRow>(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const validated: ValidatedRow[] = [];
          const csvVinSet = new Set<string>();

          for (const row of results.data) {
            const rowVin = (row.vin || "").trim().toUpperCase();
            const rowEngine = (row.engineNo || "").trim().toUpperCase();
            const rowChassis = (row.chassisNo || "").trim().toUpperCase();
            const rowVehicle = (row.vehicle || "").trim();
            const rowVariant = (row.variant || "").trim();
            const rowColor = (row.color || "").trim();
            const rowBranch = (row.branch || "").trim();
            const rowMfg = (row.mfgMonthYear || "").trim();
            const rowArrival = (row.arrivalDate || "").trim() || new Date().toISOString().split("T")[0];

            let validationStatus: ValidatedRow["validationStatus"] = "Valid";
            let validationError = "";

            if (!rowVin || !rowEngine || !rowChassis || !rowVehicle || !rowVariant || !rowColor) {
              validationStatus = "Invalid";
              validationError = "Missing required parameters (VIN, Engine No, Chassis No, Vehicle, Variant, Color).";
            } else if (existingVINs.has(rowVin)) {
              validationStatus = "Duplicate (DB)";
              validationError = "VIN already registered in central inventory.";
            } else if (csvVinSet.has(rowVin)) {
              validationStatus = "Duplicate (CSV)";
              validationError = "VIN repeated inside this upload file.";
            }

            if (rowVin) {
              csvVinSet.add(rowVin);
            }

            validated.push({
              vehicle: rowVehicle,
              variant: rowVariant,
              color: rowColor,
              vin: rowVin,
              engineNo: rowEngine,
              chassisNo: rowChassis,
              mfgMonthYear: rowMfg,
              branch: OFFICIAL_BRANCHES.includes(rowBranch) ? rowBranch : "Berhampur",
              arrivalDate: rowArrival,
              status: "Available",
              validationStatus,
              validationError
            });
          }

          setUploadedRows(validated);
          setIsProcessing(false);
          showToast(`Parsed ${validated.length} CSV rows. Review before committing.`);
        },
        error: (err) => {
          showToast("Error parsing CSV: " + err.message, "error");
          setIsProcessing(false);
        }
      });
    } catch (err: unknown) {
      const errorObj = err as Error;
      showToast("Failed to process CSV file: " + errorObj.message, "error");
      setIsProcessing(false);
    }
  };

  // Commit valid CSV rows
  const handleCommitCSV = async () => {
    const validRows = uploadedRows.filter(r => r.validationStatus === "Valid");
    if (validRows.length === 0) {
      showToast("There are no valid rows to commit.", "error");
      return;
    }

    setCommitting(true);
    try {
      if (isConfigured) {
        for (const row of validRows) {
          const payload: VehicleStockRecord = {
            vehicle: row.vehicle,
            variant: row.variant,
            color: row.color,
            vin: row.vin,
            engineNo: row.engineNo,
            chassisNo: row.chassisNo,
            mfgMonthYear: row.mfgMonthYear,
            branch: row.branch,
            arrivalDate: row.arrivalDate,
            status: "Available",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          await setDoc(doc(db, "inventory_items", row.vin), payload);
          await logStockMovement(
            row.vin,
            "None",
            "Available",
            user?.email || "anonymous_edp",
            "Initial stock intake (CSV upload)"
          );
        }
      } else {
        const local = localStorage.getItem("lt_inventory_items");
        const list = local ? JSON.parse(local) as VehicleStockRecord[] : [];
        
        for (const row of validRows) {
          const payload: VehicleStockRecord = {
            vehicle: row.vehicle,
            variant: row.variant,
            color: row.color,
            vin: row.vin,
            engineNo: row.engineNo,
            chassisNo: row.chassisNo,
            mfgMonthYear: row.mfgMonthYear,
            branch: row.branch,
            arrivalDate: row.arrivalDate,
            status: "Available",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          list.push(payload);
          await logStockMovement(
            row.vin,
            "None",
            "Available",
            user?.email || "anonymous_edp",
            "Initial stock intake (CSV upload)"
          );
        }
        localStorage.setItem("lt_inventory_items", JSON.stringify(list));
      }

      showToast(`Successfully received ${validRows.length} vehicle(s) into inventory.`);
      setUploadedRows([]);
    } catch (err: unknown) {
      const errorObj = err as Error;
      showToast("Error committing inventory items: " + errorObj.message, "error");
    } finally {
      setCommitting(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = "vehicle,variant,color,vin,engineNo,chassisNo,mfgMonthYear,branch,arrivalDate\nFortuner,2.8L 4x4 AT,Attitude Black Mica,VIN1234567890ABCD,ENG99999,CHA88888,January 2026,Berhampur,2026-07-10\nInnova Hycross,ZX (O) Hybrid,Platinum White Pearl,VIN0987654321WXYZ,ENG55555,CHA44444,February 2026,Jeypore,2026-07-10";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Lt_inventory_receive_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-semibold animate-in slide-in-from-top-4 duration-300 ${
          toast.type === "success" 
            ? "bg-slate-900 border-emerald-800 text-emerald-400" 
            : "bg-slate-900 border-red-800 text-red-400"
        }`}>
          {toast.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" /> : <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-display flex items-center gap-2">
          <PlusCircle className="text-[#EB0A1E] w-6 h-6" />
          Receive New Stock
        </h1>
        <p className="text-xs text-slate-400">Receive new physical stock units by filling the manual form or uploading bulk CSV records.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Manual Intake Form */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Manual Unit Registration</h2>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Vehicle Model</label>
                <select
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                >
                  {vehiclesList.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Variant</label>
                <select
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                >
                  {variantsList.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Color</label>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                >
                  {colorsList.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">VIN (Chassis Code)</label>
                <input
                  type="text"
                  required
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  placeholder="17-Digit Alpha-Numeric VIN"
                  maxLength={17}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EB0A1E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Engine No</label>
                <input
                  type="text"
                  required
                  value={engineNo}
                  onChange={(e) => setEngineNo(e.target.value)}
                  placeholder="Engine Ident. Code"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EB0A1E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Chassis No</label>
                <input
                  type="text"
                  required
                  value={chassisNo}
                  onChange={(e) => setChassisNo(e.target.value)}
                  placeholder="Chassis Frame Ident."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EB0A1E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Mfg Month/Year</label>
                <input
                  type="text"
                  required
                  value={mfgMonthYear}
                  onChange={(e) => setMfgMonthYear(e.target.value)}
                  placeholder="e.g. January 2026"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EB0A1E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Branch Allocation</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                >
                  {OFFICIAL_BRANCHES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Arrival Date</label>
                <input
                  type="date"
                  required
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={committing}
                className="flex items-center gap-2 bg-[#EB0A1E] hover:bg-red-700 text-white font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
              >
                {committing ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                Add Vehicle to Stock
              </button>
            </div>
          </form>
        </div>

        {/* CSV Import Sidebar */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex justify-between items-center">
            <span>Bulk CSV Intake</span>
            <button
              onClick={downloadTemplate}
              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" /> Template
            </button>
          </h2>

          <div className="border-2 border-dashed border-slate-800 hover:border-[#EB0A1E] rounded-xl p-6 text-center transition-colors relative bg-slate-950/40">
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              disabled={isProcessing}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {isProcessing ? (
              <div className="space-y-2">
                <Loader2 className="w-8 h-8 text-[#EB0A1E] animate-spin mx-auto" />
                <p className="text-xs text-slate-300">Processing file logs...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 text-slate-500 mx-auto" />
                <h4 className="text-xs font-bold text-slate-300">Upload Inventory CSV</h4>
                <p className="text-[10px] text-slate-500">Drop your file here or click to select.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSV Preview Table */}
      {uploadedRows.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileSpreadsheet className="text-[#EB0A1E] w-5 h-5" />
                CSV Data Intake Preview
              </h3>
              <p className="text-[11px] text-slate-400">Review validation status before final inventory commit.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setUploadedRows([])}
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleCommitCSV}
                disabled={committing || uploadedRows.filter(r => r.validationStatus === "Valid").length === 0}
                className="flex items-center gap-2 bg-[#EB0A1E] hover:bg-red-700 text-white font-semibold text-[10px] uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {committing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Commit Valid Rows ({uploadedRows.filter(r => r.validationStatus === "Valid").length})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="px-4 py-3">Validation</th>
                  <th className="px-4 py-3">VIN</th>
                  <th className="px-4 py-3">Model</th>
                  <th className="px-4 py-3">Variant</th>
                  <th className="px-4 py-3">Color</th>
                  <th className="px-4 py-3">Engine No</th>
                  <th className="px-4 py-3">Chassis No</th>
                  <th className="px-4 py-3">Branch</th>
                  <th className="px-4 py-3 text-right">Error Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {uploadedRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        row.validationStatus === "Valid"
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/80"
                          : row.validationStatus === "Duplicate (CSV)" || row.validationStatus === "Duplicate (DB)"
                          ? "bg-amber-950/80 text-amber-400 border border-amber-800/80"
                          : "bg-red-950/80 text-red-400 border border-red-800/80"
                      }`}>
                        {row.validationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-white">{row.vin}</td>
                    <td className="px-4 py-3 text-slate-300">{row.vehicle}</td>
                    <td className="px-4 py-3 text-slate-400">{row.variant}</td>
                    <td className="px-4 py-3 text-slate-400">{row.color}</td>
                    <td className="px-4 py-3 font-mono text-slate-400">{row.engineNo}</td>
                    <td className="px-4 py-3 font-mono text-slate-400">{row.chassisNo}</td>
                    <td className="px-4 py-3 text-slate-400">{row.branch}</td>
                    <td className="px-4 py-3 text-right text-[10px] text-red-400 font-semibold">{row.validationError || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
