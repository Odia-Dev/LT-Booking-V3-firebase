import React from "react";
import MediaManagerClient from "./MediaManagerClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Media Manager - CMS",
  description: "Upload and manage vehicle images and video assets.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function MediaManagerPage() {
  return <MediaManagerClient />;
}
