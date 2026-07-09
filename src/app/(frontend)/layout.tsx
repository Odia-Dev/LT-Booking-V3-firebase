import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "../globals.css";
import { AuthContextProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegionalAIChatbot from "@/components/RegionalAIChatbot";
import AnalyticsWrapper from "@/components/AnalyticsWrapper";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Laxmi Toyota - Official Dealer South Odisha | Online Toyota Booking",
  description: "Official online booking platform for Laxmi Toyota in South Odisha. Reserve your Glanza, Hyryder, Taisor, Rumion, Innova Hycross, or Fortuner online with instant confirmation.",
  keywords: "Toyota Odisha, Laxmi Toyota, Book Toyota Online, Toyota Brahmapur, Toyota Fortuner booking, Toyota Hycross hybrid",
};

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 selection:bg-[#EB0A1E]/30 selection:text-red-200 font-sans">
        <AuthContextProvider>
          <AnalyticsWrapper />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <RegionalAIChatbot />
        </AuthContextProvider>
      </body>
    </html>
  );
}
