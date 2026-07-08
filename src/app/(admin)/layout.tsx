import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "../admin-globals.css";
import { AuthContextProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

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
  title: "Laxmi Toyota - Admin Console",
  description: "Internal administrative systems for Laxmi Toyota dealerships.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-screen bg-slate-950 text-white selection:bg-[#EB0A1E]/30 selection:text-red-200 font-sans">
        <AuthContextProvider>
          <Navbar />
          <div className="min-h-screen bg-slate-950 text-white">
            {children}
          </div>
        </AuthContextProvider>
      </body>
    </html>
  );
}
