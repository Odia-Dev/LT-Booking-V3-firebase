import { NextResponse } from "next/server";
import crypto from "crypto";
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

const getDb = () => {
    if (!admin.getApps().length) {
        try {
            const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
            admin.initializeApp({
                credential: admin.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: privateKey,
                }),
            });
        } catch (e) {
            return null; // Failed to init
        }
    }
    return getFirestore();
};

export async function POST(request: Request) {
  console.log("LOG: Webhook Request Received");
  const db = getDb();
  
  // THE FIX: Add this safety check
  if (!db) {
      console.error("LOG: Webhook Error: Database not initialized!");
      return new Response("Database Error", { status: 500 });
  }

  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature") || "";
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

    // 1. Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("LOG: Webhook signature verification failed.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    console.log("LOG: Webhook signature verified successfully. Event:", event);

    const paymentEntity = payload.payload?.payment?.entity;

    if (!paymentEntity) {
      console.error("LOG: Invalid payload format");
      return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
    }

    const orderId = paymentEntity.order_id;
    const paymentId = paymentEntity.id;
    const amount = paymentEntity.amount / 100;

    if (!orderId) {
      console.warn("LOG: Webhook received without order_id. Skipping.");
      return NextResponse.json({ message: "No order_id found" }, { status: 200 });
    }

    let bookingId = "";
    let bookingData: any = null;

    // 2. Fetch Document strictly using Admin SDK
    console.log("LOG: Fetching booking document matching razorpay_order_id:", orderId);
    const bookingsSnap = await db
      .collection("bookings")
      .where("razorpay_order_id", "==", orderId)
      .limit(1)
      .get();

    if (bookingsSnap.empty) {
      console.error(`LOG: No booking found matching razorpay_order_id: ${orderId} (Admin)`);
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const docRef = bookingsSnap.docs[0];
    bookingId = docRef.id;
    bookingData = docRef.data();
    console.log("LOG: Booking document fetched successfully. bookingId:", bookingId);

    // 3. Idempotency Check: Avoid processing if already Paid/Failed
    if (bookingData.status === "Paid" || bookingData.status === "Failed") {
      console.log(`LOG: Booking ${bookingId} already marked as ${bookingData.status}. Skipping webhook.`);
      return NextResponse.json({ message: "Webhook already processed" }, { status: 200 });
    }

    let nextStatus = "Pending Payment";
    let emailSubject = "";
    let emailHtml = "";

    // 4. Construct templates
    if (event === "payment.captured") {
      nextStatus = "Paid";
      emailSubject = `Reservation Confirmed - Laxmi Toyota [Ref: ${bookingId}]`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; background-color: #09090b; color: #f4f4f5; padding: 40px; border-radius: 16px; max-width: 600px; margin: 20px auto; border: 1px solid #27272a;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #ffffff; font-size: 26px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">LAXMI TOYOTA</h2>
            <span style="color: #ef4444; font-size: 10px; font-weight: 700; tracking-widest: 2px; text-transform: uppercase;">Digital Showroom</span>
          </div>

          <h1 style="color: #ffffff; border-bottom: 1px solid #27272a; padding-bottom: 20px; font-size: 22px; font-weight: 700;">Booking Deposit Confirmed</h1>
          
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">Dear ${bookingData.customerName || "Valued Customer"},</p>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">We have successfully received your booking deposit of <strong>₹${amount.toLocaleString("en-IN")}</strong> for the <strong>${bookingData.vehicleName}</strong>.</p>
          
          <div style="background-color: #18181b; border: 1px solid #27272a; padding: 24px; border-radius: 12px; margin: 25px 0;">
            <h3 style="color: #ffffff; margin-top: 0; margin-bottom: 15px; font-size: 15px; border-bottom: 1px solid #27272a; padding-bottom: 8px;">Order Details</h3>
            <table style="width: 100%; font-size: 13px; color: #d4d4d8; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #71717a;">Vehicle Name:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 700; color: #ffffff;">${bookingData.vehicleName} (${bookingData.vehicleType})</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #71717a;">Selected Branch:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 700; color: #ffffff;">${bookingData.branch} Branch</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #71717a;">Booking ID Reference:</td>
                <td style="padding: 8px 0; text-align: right; font-family: monospace; color: #ffffff;">${bookingId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #71717a;">Payment Receipt:</td>
                <td style="padding: 8px 0; text-align: right; font-family: monospace; color: #ffffff;">${paymentId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #71717a;">Reservation Status:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 800; color: #10b981;">PAID & CONFIRMED</td>
              </tr>
            </table>
          </div>

          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">Our representative from the ${bookingData.branch} Branch will contact you within 24 hours.</p>
          
          <div style="text-align: center; margin: 35px 0 20px 0;">
            <a href="https://laxmitoyota.co.in" style="background-color: #ffffff; color: #09090b; padding: 12px 30px; border-radius: 9999px; text-decoration: none; font-size: 13px; font-weight: 700; display: inline-block;">Visit Digital Dealership</a>
          </div>

          <hr style="border: 0; border-top: 1px solid #27272a; margin: 30px 0;" />
          <p style="color: #71717a; font-size: 11px; text-align: center;">Laxmi Toyota. Powered under Portal V3.</p>
        </div>
      `;
    } else if (event === "payment.failed") {
      nextStatus = "Failed";
      emailSubject = `Reservation Payment Failed - Laxmi Toyota`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; background-color: #09090b; color: #f4f4f5; padding: 40px; border-radius: 16px; max-width: 600px; margin: 20px auto; border: 1px solid #27272a;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #ffffff; font-size: 26px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">LAXMI TOYOTA</h2>
            <span style="color: #ef4444; font-size: 10px; font-weight: 700; tracking-widest: 2px; text-transform: uppercase;">Digital Showroom</span>
          </div>

          <h1 style="color: #ffffff; border-bottom: 1px solid #27272a; padding-bottom: 20px; font-size: 22px; font-weight: 700; border-left: 4px solid #ef4444; padding-left: 10px;">Booking Payment Failed</h1>
          
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">Dear ${bookingData.customerName || "Valued Customer"},</p>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">We were unable to process the reservation deposit of <strong>₹${amount.toLocaleString("en-IN")}</strong> for the <strong>${bookingData.vehicleName}</strong>.</p>
          
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">Please re-attempt the booking transaction, or contact support if funds were deducted from your bank account.</p>
          
          <hr style="border: 0; border-top: 1px solid #27272a; margin: 30px 0;" />
          <p style="color: #71717a; font-size: 11px; text-align: center;">Laxmi Toyota. Powered under Portal V3.</p>
        </div>
      `;
    } else {
      console.log("LOG: Ignored event");
      return NextResponse.json({ message: "Ignored event" }, { status: 200 });
    }

    // 5. Save Status Update (Strict Admin SDK)
    console.log("LOG: Updating database status for booking:", bookingId);
    const bookingRef = db.collection("bookings").doc(bookingId);
    try {
      await bookingRef.update({
        status: 'Paid',
        payment_verified_at: new Date().toISOString()
      });
      console.log("LOG: Firebase updated. Returning OK.");
      return new Response("OK", { status: 200 });
    } catch (error: any) {
      console.error("LOG: Firestore Update Failed:", error.message);
      // Return 500 so Razorpay knows to retry later
      return new Response("Internal Server Error", { status: 500 });
    }
  } catch (error: any) {
    console.error("LOG: Webhook integration error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
