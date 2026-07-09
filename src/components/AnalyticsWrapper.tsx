"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

export default function AnalyticsWrapper() {
  const GA_ID = "G-XXXXXXXXXX"; // Replace with your Google Analytics ID
  const PIXEL_ID = "XXXXXXXXXXXXXXX"; // Replace with your Meta Pixel ID

  useEffect(() => {
    // This ensures GA/Pixel track SPA navigation (when users click links, not just refresh pages)
    const handlePopState = () => {
      // Logic for page view tracking can go here if needed
      if (typeof window !== "undefined") {
        if (window.gtag) {
          window.gtag("config", GA_ID, {
            page_path: window.location.pathname,
          });
        }
        if (window.fbq) {
          window.fbq("track", "PageView");
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [GA_ID, PIXEL_ID]);

  return (
    <>
      {/* Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>

      {/* Meta Pixel */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
    </>
  );
}
