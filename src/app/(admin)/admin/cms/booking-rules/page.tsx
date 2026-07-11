import React from "react";
import BookingRulesClient from "./BookingRulesClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Booking Rules - CMS",
  description: "Configure per-variant booking amounts, refund policies, and waiting period gates.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function BookingRulesPage() {
  return <BookingRulesClient />;
}
