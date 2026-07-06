import { NextResponse } from "next/server";
import { db, isConfigured } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, orderBy } from "firebase/firestore";
import { VehicleMaster } from "@/types/vehicle";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");
    const typeFilter = searchParams.get("type");

    if (!isConfigured) {
      return NextResponse.json({ success: true, vehicles: [] });
    }

    let q = collection(db, "vehicles_master");
    let constraints: any[] = [where("basicInfo.status", "!=", "Archived")];

    if (statusFilter) {
      constraints.push(where("basicInfo.status", "==", statusFilter));
    }
    if (typeFilter) {
      constraints.push(where("basicInfo.type", "==", typeFilter));
    }

    const querySnap = await getDocs(query(q, ...constraints));
    const vehicles: VehicleMaster[] = [];

    querySnap.forEach((doc) => {
      vehicles.push({ id: doc.id, ...doc.data() } as VehicleMaster);
    });

    return NextResponse.json({ success: true, vehicles });
  } catch (error: any) {
    console.error("GET vehicles master error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const vehicleData: VehicleMaster = body.vehicle;

    if (!vehicleData.basicInfo?.slug || !vehicleData.basicInfo?.name) {
      return NextResponse.json({ success: false, error: "Slug and name are required fields." }, { status: 400 });
    }

    const payload = {
      ...vehicleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isConfigured) {
      const docRef = await addDoc(collection(db, "vehicles_master"), payload);
      return NextResponse.json({ success: true, id: docRef.id });
    } else {
      return NextResponse.json({ success: true, id: "mock-id-local-only", note: "Firebase not configured. Logged mock record." });
    }
  } catch (error: any) {
    console.error("POST vehicles master error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
