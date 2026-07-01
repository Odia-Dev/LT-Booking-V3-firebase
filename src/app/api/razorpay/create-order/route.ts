import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { db as clientDb, isConfigured } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const admin = {
  get apps() {
    return getApps();
  },
  initializeApp,
  credential: {
    cert,
  },
  firestore: getFirestore,
};

// Use a self-executing function to handle initialization cleanly
const initializeFirebase = () => {
  if (!admin.apps.length) {
    try {
      let projectId = process.env.FIREBASE_PROJECT_ID;
      let clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;

      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        projectId = serviceAccount.project_id;
        clientEmail = serviceAccount.client_email;
        privateKey = serviceAccount.private_key;
      }

      if (privateKey) {
        privateKey = privateKey.replace(/\\n/g, '\n');
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } catch (error) {
      console.error("Firebase Admin Init Error:", error);
    }
  }
  return admin.apps.length ? admin.firestore() : null as any;
};

const db = initializeFirebase();

// Initialize Razorpay SDK using the server environment keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(request: Request) {
  console.log("LOG: Create Order Started");
  try {
    const { bookingId, amount } = await request.json();
    console.log("LOG: Request JSON parsed. Booking ID:", bookingId, "Amount:", amount);

    if (!bookingId || !amount) {
      console.warn("LOG: Missing required parameters: bookingId, amount");
      return NextResponse.json(
        { error: "Missing required parameters: bookingId, amount" },
        { status: 400 }
      );
    }

    // Convert amount to paise (e.g. 11000 INR -> 1100000 Paise)
    const amountInPaise = Math.round(amount * 100);

    // Local sandbox dev mode fallback
    if (!isConfigured || !process.env.RAZORPAY_KEY_ID) {
      console.log("LOG: Dev Mode: Simulating Razorpay order creation");
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
    console.log("LOG: Creating Razorpay order...");
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: bookingId,
      notes: {
        bookingId: bookingId,
      },
    };

    const order = await razorpay.orders.create(options);
    console.log("LOG: Razorpay order created successfully. Order ID:", order.id);

    // Update the corresponding Firestore lead document with the Razorpay order details
    const adminDb = db;
    if (adminDb) {
      console.log("LOG: Using Firebase Admin SDK for Order Creation document update. ID:", bookingId);
      await adminDb.collection("bookings").doc(bookingId).update({
        razorpay_order_id: order.id,
        status: "Pending Payment",
      });
      console.log("LOG: Firebase updated");
    } else {
      console.warn("LOG: Admin SDK environment keys missing. Falling back to Client Firestore SDK in create-order.");
      console.log("LOG: Using Client SDK for Lead document update. ID:", bookingId);
      const bookingRef = doc(clientDb, "bookings", bookingId);
      await updateDoc(bookingRef, {
        razorpay_order_id: order.id,
        status: "Pending Payment",
      });
      console.log("LOG: Firebase updated");
    }

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      notes: order.notes,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error("LOG: Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
