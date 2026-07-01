import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { db, isConfigured } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Razorpay SDK using the server environment keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

// Safely initialize the Firebase Admin app (ignoring security rules)
const getAdminDb = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    try {
      if (getApps().length === 0) {
        initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, "\n"),
          }),
        });
      }
      return getFirestore();
    } catch (e) {
      console.error("Error initializing Firebase Admin App:", e);
      return null;
    }
  }
  return null;
};

export async function POST(request: Request) {
  try {
    const { bookingId, amount } = await request.json();

    if (!bookingId || !amount) {
      return NextResponse.json(
        { error: "Missing required parameters: bookingId, amount" },
        { status: 400 }
      );
    }

    // Convert amount to paise (e.g. 11000 INR -> 1100000 Paise)
    const amountInPaise = Math.round(amount * 100);

    // Local sandbox dev mode fallback
    if (!isConfigured || !process.env.RAZORPAY_KEY_ID) {
      console.log("Dev Mode: Simulating Razorpay order creation");
      const mockOrderId = `order_mock_${Date.now()}`;
      
      // Update mock database in localStorage (handled client-side, but let's return it)
      return NextResponse.json({
        id: mockOrderId,
        amount: amountInPaise,
        currency: "INR",
        notes: { bookingId },
        mock: true,
      });
    }

    // Create a real Razorpay Order
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: bookingId,
      notes: {
        bookingId: bookingId,
      },
    };

    const order = await razorpay.orders.create(options);

    // Update the corresponding Firestore lead document with the Razorpay order details
    const adminDb = getAdminDb();
    if (adminDb) {
      console.log("Using Firebase Admin SDK for Order Creation document update.");
      await adminDb.collection("bookings").doc(bookingId).update({
        razorpay_order_id: order.id,
        status: "Pending Payment",
      });
    } else {
      console.warn("Admin SDK environment keys missing. Falling back to Client Firestore SDK in create-order.");
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, {
        razorpay_order_id: order.id,
        status: "Pending Payment",
      });
    }

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      notes: order.notes,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
