import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    const query = (message || "").toLowerCase();

    let responseText = "";

    if (query.includes("mileage") || query.includes("average")) {
      responseText = "Namaskar! Our advanced Self-Charging Hybrid Electric engines (like in the Hyryder or Innova Hycross) deliver an exceptional mileage of up to 27.97 km/l! This offers unmatched fuel efficiency. Lock in your hybrid allocation today to start saving: http://localhost:3000/book/hyryder";
    } else if (query.includes("glanza") || query.includes("stock") || query.includes("in stock")) {
      responseText = "Toyota Glanza is highly demanded with only 2 units remaining for immediate delivery this month! Don't miss out. Claim your ₹5,000 online-exclusive invoice discount by reserving your Glanza now: http://localhost:3000/book/glanza";
    } else if (query.includes("book") || query.includes("how to") || query.includes("payment")) {
      responseText = "Booking online is 100% secure and self-serve! Simply select your vehicle on our showroom page, select the variant & color, and complete the refundable deposit via Razorpay. Reserve your vehicle in under 60 seconds here: http://localhost:3000/";
    } else {
      responseText = "Namaskar! Laxmi Toyota is offering a limited-time ₹5,000 direct discount on your final invoice when you book online today. With immediate delivery slots running low, we recommend reserving your car right away. Choose your model and start: http://localhost:3000/";
    }

    return NextResponse.json({ response: responseText });
  } catch (error) {
    return NextResponse.json({ response: "Namaskar! Our servers are busy. Please secure your booking directly to claim your ₹5,000 online discount!" }, { status: 500 });
  }
}
