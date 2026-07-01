import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Resend } from "resend";

// Initialize Resend with key
const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature") || "";
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

    // 1. Signature Verification
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Razorpay webhook signature verification failed.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;
    
    if (!paymentEntity) {
      return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
    }

    // Retrieve references from notes
    const bookingId = paymentEntity.notes?.bookingId;
    const paymentId = paymentEntity.id;
    const orderId = paymentEntity.order_id;
    const amount = paymentEntity.amount / 100; // convert paise back to INR

    if (!bookingId) {
      console.warn("Webhook received without bookingId in notes. Skipping processing.");
      return NextResponse.json({ message: "No bookingId in notes" }, { status: 200 });
    }

    // 2. Fetch Firestore Document
    const bookingRef = doc(db, "bookings", bookingId);
    const bookingSnap = await getDoc(bookingRef);

    if (!bookingSnap.exists()) {
      console.error(`Booking document not found: ${bookingId}`);
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const bookingData = bookingSnap.data();

    // 3. Prevent duplicate updates
    if (bookingData.status === "Paid") {
      console.log(`Booking ${bookingId} already marked as Paid. Returning early.`);
      return NextResponse.json({ message: "Already processed" }, { status: 200 });
    }

    let nextStatus = "Pending Payment";
    let emailSubject = "";
    let emailHtml = "";

    // 4. Handle captured / failed events
    if (event === "payment.captured") {
      nextStatus = "Paid";
      emailSubject = `Reservation Confirmed - Laxmi Toyota [Ref: ${bookingId}]`;
      emailHtml = `
        <div style="font-family: sans-serif; background-color: #09090b; color: #f4f4f5; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #27272a;">
          <h1 style="color: #ffffff; border-bottom: 2px solid #ef4444; padding-bottom: 15px; font-size: 24px;">Booking Deposit Confirmed</h1>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">Dear ${bookingData.customerName || "Customer"},</p>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">We have successfully received your reservation deposit of <strong>₹${amount.toLocaleString("en-IN")}</strong> for the <strong>${bookingData.vehicleName}</strong>.</p>
          
          <div style="background-color: #18181b; border: 1px solid #27272a; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #ffffff; margin-top: 0; margin-bottom: 15px; font-size: 16px; border-bottom: 1px solid #27272a; padding-bottom: 8px;">Order Details</h3>
            <table style="width: 100%; font-size: 13px; color: #d4d4d8; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #71717a;">Vehicle Name:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #ffffff;">${bookingData.vehicleName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #71717a;">Allocation Branch:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #ffffff;">${bookingData.branch} Branch</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #71717a;">Transaction ID:</td>
                <td style="padding: 6px 0; text-align: right; font-family: monospace; color: #ffffff;">${paymentId}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #71717a;">Reservation Status:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #10b981;">PAID</td>
              </tr>
            </table>
          </div>

          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">An executive from the ${bookingData.branch} Branch will contact you within 24 hours to coordinate invoice execution, test drives, and delivery dates.</p>
          <hr style="border: 0; border-top: 1px solid #27272a; margin: 30px 0;" />
          <p style="color: #71717a; font-size: 11px; text-align: center;">Laxmi Toyota Dealership Ecosystem. Managed under Portal V3.</p>
        </div>
      `;
    } else if (event === "payment.failed") {
      nextStatus = "Failed";
      emailSubject = `Reservation Failed - Laxmi Toyota [Ref: ${bookingId}]`;
      emailHtml = `
        <div style="font-family: sans-serif; background-color: #09090b; color: #f4f4f5; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #27272a;">
          <h1 style="color: #ffffff; border-bottom: 2px solid #ef4444; padding-bottom: 15px; font-size: 24px;">Booking Payment Failed</h1>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">Dear ${bookingData.customerName || "Customer"},</p>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">We were unable to process your reservation deposit of <strong>₹${amount.toLocaleString("en-IN")}</strong> for the <strong>${bookingData.vehicleName}</strong>.</p>
          
          <div style="background-color: #18181b; border: 1px solid #27272a; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <table style="width: 100%; font-size: 13px; color: #d4d4d8; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #71717a;">Vehicle Name:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #ffffff;">${bookingData.vehicleName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #71717a;">Reservation Status:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #ef4444;">FAILED</td>
              </tr>
            </table>
          </div>

          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">Please re-attempt the transaction from the booking portal or reach out to our support staff if the amount was deducted from your account.</p>
          <hr style="border: 0; border-top: 1px solid #27272a; margin: 30px 0;" />
          <p style="color: #71717a; font-size: 11px; text-align: center;">Laxmi Toyota Dealership Ecosystem. Managed under Portal V3.</p>
        </div>
      `;
    } else {
      // Ignore other events
      return NextResponse.json({ message: "Event ignored" }, { status: 200 });
    }

    // 5. Update Firestore Database
    await updateDoc(bookingRef, {
      status: nextStatus,
      razorpayPaymentId: paymentId,
      razorpayOrderId: orderId,
    });

    // 6. Send transactional email using Resend
    if (bookingData.customerEmail) {
      await resend.emails.send({
        from: "Laxmi Toyota <onboarding@resend.dev>",
        to: bookingData.customerEmail,
        subject: emailSubject,
        html: emailHtml,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
