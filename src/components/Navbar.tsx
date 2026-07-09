"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Skip rendering on the landing page, as it has its own custom navbar layout
  if (pathname === "/") {
    return null;
  }

  return (
    <nav className="border-b border-zinc-850 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Brand Logo (Left) */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tight text-[#EB0A1E]">
                Laxmi Toyota
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links (Center) */}
          <div className="hidden lg:flex space-x-6 items-center">
            <Link href="/" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/#vehicles" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
              Vehicles
            </Link>
            <Link href="/book-test-drive" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
              Test Drive
            </Link>
            <Link href="/toyota-emi-calculator" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
              EMI Check
            </Link>
            <Link href="/#offers" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
              Offer
            </Link>
            <Link href="/#contact-us" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/blog" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
              Blog
            </Link>
          </div>

          {/* Desktop User Panel / CTA (Right) */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/book-online"
              className="bg-[#EB0A1E] text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest shadow-md hover:bg-red-700 transition-all text-center"
            >
              Book Now
            </Link>

            {loading ? (
              <div className="h-8 w-8 rounded-full border border-zinc-800 bg-zinc-900 animate-pulse" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                <Link href="/dashboard" className="relative group cursor-pointer shrink-0">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || "Profile"}
                      width={32}
                      height={32}
                      className="rounded-full border border-zinc-700 hover:border-red-500 transition-all"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[#EB0A1E] flex items-center justify-center text-white font-bold text-xs border border-red-500">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </Link>
                <button
                  onClick={logout}
                  className="rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2 text-xs font-bold text-zinc-350 hover:text-white hover:bg-zinc-800 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all text-center"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger menu (Right) */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-white transition-colors focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer menu (Slide-down overlay) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950 border-b border-zinc-850 px-4 py-6 space-y-4 shadow-2xl absolute w-full left-0 z-50 text-left animate-slide-down">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/#vehicles" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors">
            Vehicles
          </Link>
          <Link href="/book-test-drive" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors">
            Test Drive
          </Link>
          <Link href="/toyota-emi-calculator" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors">
            EMI Check
          </Link>
          <Link href="/#offers" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors">
            Offer
          </Link>
          <Link href="/#contact-us" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors">
            Contact
          </Link>
          <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors">
            Blog
          </Link>
          
          <div className="pt-4 border-t border-zinc-900 flex flex-col gap-2.5">
            <Link
              href="/book-online"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-[#EB0A1E] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-red-700 transition-all"
            >
              Book Now
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-zinc-900 border border-zinc-800 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  My Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-center bg-zinc-950 border border-zinc-850 text-zinc-400 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-zinc-900 border border-zinc-800 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
