import { NextResponse } from "next/server";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

const getDb = () => {
  if (!admin.getApps().length) {
    try {
      const rawKey = process.env.FIREBASE_PRIVATE_KEY || "";
      let formattedKey = rawKey.trim();
      if (formattedKey.startsWith('"') || formattedKey.startsWith("'")) {
        formattedKey = formattedKey.slice(1);
      }
      while (
        formattedKey.endsWith('"') ||
        formattedKey.endsWith("'") ||
        formattedKey.endsWith(",") ||
        formattedKey.endsWith("\r") ||
        formattedKey.endsWith("\n") ||
        formattedKey.endsWith(" ")
      ) {
        formattedKey = formattedKey.slice(0, -1);
      }
      formattedKey = formattedKey.replace(/\\n/g, "\n");

      admin.initializeApp({
        credential: admin.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: formattedKey,
        }),
      });
    } catch (e) {
      console.error("Firebase Admin initialization error:", e);
      return null;
    }
  }
  return getFirestore();
};

export async function POST(request: Request) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
  }

  try {
    const body = await request.json() as {
      bookingId?: string;
      vehicleName?: string;
      variantName?: string;
      colorName?: string;
      userEmail?: string;
    };
    const { bookingId, vehicleName, variantName, colorName, userEmail } = body;

    if (!bookingId || !vehicleName || !variantName || !colorName) {
      return NextResponse.json(
        { error: "Missing required booking details (bookingId, vehicleName, variantName, colorName)" },
        { status: 400 }
      );
    }

    const allocationResult = await db.runTransaction(async (transaction) => {
      // 1. Query the first available item in inventory matching the parameters
      const itemsColl = db.collection("inventory_items");
      const availableQuery = itemsColl
        .where("vehicle", "==", vehicleName)
        .where("variant", "==", variantName)
        .where("color", "==", colorName)
        .where("status", "==", "Available")
        .limit(1);

      const querySnap = await transaction.get(availableQuery);
      const bookingRef = db.collection("bookings").doc(bookingId);

      if (!querySnap.empty) {
        const itemDoc = querySnap.docs[0];
        const itemRef = itemDoc.ref;
        const itemData = itemDoc.data();

        // Update item status to 'Booked' and map booking ID
        transaction.update(itemRef, {
          status: "Booked",
          bookingId: bookingId,
          updatedAt: new Date().toISOString()
        });

        // Log movement inside inventoryMovements
        const movementRef = db.collection("inventoryMovements").doc();
        transaction.set(movementRef, {
          vin: itemData.vin as string,
          oldStatus: "Available",
          newStatus: "Booked",
          user: userEmail || "system_allocation",
          reason: `Auto-allocated on Booking Creation (ID: ${bookingId})`,
          bookingId: bookingId,
          timestamp: new Date().toISOString()
        });

        // Set status in booking document to Allocated (merge: true handles case where booking is being registered)
        transaction.set(bookingRef, {
          vinAllocationStatus: "Allocated",
          allocatedVin: itemData.vin as string,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        return { success: true, allocated: true, vin: itemData.vin as string };
      } else {
        // No stock available: flag as Waitlisted
        transaction.set(bookingRef, {
          vinAllocationStatus: "Waitlisted/Pending VIN Allocation",
          updatedAt: new Date().toISOString()
        }, { merge: true });

        return { success: true, allocated: false };
      }
    });

    return NextResponse.json(allocationResult);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Transactional allocation failed:", err);
    return NextResponse.json(
      { error: "Allocation failed", details: err.message },
      { status: 500 }
    );
  }
}
