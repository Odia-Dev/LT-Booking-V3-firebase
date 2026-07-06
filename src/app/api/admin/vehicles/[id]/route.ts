import { NextResponse } from "next/server";
import { db, isConfigured } from "@/lib/firebase";
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { VehicleMaster } from "@/types/vehicle";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const vehicleData: Partial<VehicleMaster> = body.vehicle;

    if (!isConfigured) {
      return NextResponse.json({ success: true, id, note: "Mock update complete." });
    }

    const docRef = doc(db, "vehicles_master", id);
    const payload = {
      ...vehicleData,
      updatedAt: new Date().toISOString()
    };

    await updateDoc(docRef, payload);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PUT vehicle master error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!isConfigured) {
      return NextResponse.json({ success: true, id, note: "Mock soft delete complete." });
    }

    const docRef = doc(db, "vehicles_master", id);
    await updateDoc(docRef, {
      "basicInfo.status": "Archived",
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE vehicle master error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // Duplicate Vehicle
  try {
    const { id } = await params;

    if (!isConfigured) {
      return NextResponse.json({ success: true, id: "duplicate-mock-id" });
    }

    const docRef = doc(db, "vehicles_master", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ success: false, error: "Source vehicle not found." }, { status: 404 });
    }

    const sourceData = docSnap.data() as VehicleMaster;
    const duplicatePayload: VehicleMaster = {
      ...sourceData,
      basicInfo: {
        ...sourceData.basicInfo,
        name: `${sourceData.basicInfo.name} (Copy)`,
        slug: `${sourceData.basicInfo.slug}-copy`,
        status: "Draft",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newDocRef = await addDoc(collection(db, "vehicles_master"), duplicatePayload);
    return NextResponse.json({ success: true, id: newDocRef.id });
  } catch (error: any) {
    console.error("PATCH duplicate vehicle error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
