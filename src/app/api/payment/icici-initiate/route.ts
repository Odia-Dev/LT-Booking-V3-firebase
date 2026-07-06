import { NextResponse } from "next/server";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import crypto from "crypto";

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

const initializeFirebase = () => {
  if (!admin.apps.length) {
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
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: formattedKey,
        }),
      });
      console.log("LOG: Firebase Admin Initialized in ICICI initiate route");
    } catch (error) {
      console.error("LOG: Firebase Admin Init Error in ICICI:", error);
    }
  }
  return admin.apps.length ? admin.firestore() : null;
};

// AES-128 Encryption function for ICICI Eazypay
function encryptAES128(plainText: string, key: string): string {
  // Standard Eazypay AES-128-ECB configuration (first 16 bytes of key)
  const cipher = crypto.createCipheriv("aes-128-ecb", Buffer.from(key.substring(0, 16)), null);
  let encrypted = cipher.update(plainText, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

export async function POST(req: Request) {
  try {
    const db = initializeFirebase();
    if (!db) {
      return NextResponse.json({ useFallback: true, message: "Firebase Admin is not configured. Fallback to Razorpay." });
    }

    const docRef = db.collection("settings").doc("payment_gateways");
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ useFallback: true, message: "ICICI settings not found, use Razorpay" });
    }

    const config = docSnap.data();
    const enabled = config?.enabled;
    const merchantId = config?.merchantId;
    const encryptionKey = config?.encryptionKey;

    if (!enabled || !merchantId || !encryptionKey) {
      return NextResponse.json({ useFallback: true, message: "ICICI disabled, use Razorpay" });
    }

    const body = await req.json();
    const { amount, bookingId, customerName, customerEmail, customerPhone } = body;

    if (!amount || !bookingId) {
      return NextResponse.json({ useFallback: true, message: "Missing required booking details." });
    }

    // Construct mandatory parameter block for Eazypay: merchantId | subMerchantId | referenceNo | amount | returnUrl
    const paymentUrl = "https://eazypay.icicibank.com/EazyPayLink";
    const mandatoryFields = `${merchantId}|${bookingId}|${amount}|https://laxmitoyota.co.in/checkout/confirmation`;
    
    // Encrypt fields using the dynamic key retrieved from Firestore settings
    const encryptedMandatory = encryptAES128(mandatoryFields, encryptionKey);
    const checkoutUrl = `${paymentUrl}?merchantid=${merchantId}&mandatoryfields=${encodeURIComponent(encryptedMandatory)}`;

    return NextResponse.json({
      success: true,
      useFallback: false,
      checkoutUrl,
      bookingId,
      amount
    });
  } catch (error: any) {
    console.error("ICICI initiation error:", error);
    return NextResponse.json({ useFallback: true, message: "Error initiating ICICI payment, fallback to Razorpay." });
  }
}
