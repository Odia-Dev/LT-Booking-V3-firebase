import React from "react";
import HomepageCmsClient from "./HomepageCmsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Homepage CMS - Content Management",
  description: "Edit hero section, trust stats, and featured vehicles without redeployment.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function HomepageCmsPage() {
  return <HomepageCmsClient />;
}
