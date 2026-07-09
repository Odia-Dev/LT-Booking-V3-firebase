"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-t border-zinc-900 text-left">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
        
        {/* Brand Column */}
        <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-4">
          <h3 className="text-[#EB0A1E] text-lg font-black tracking-tight">Laxmi Toyota</h3>
          <p className="text-zinc-500 text-xs leading-relaxed max-w-sm">
            Official Toyota dealer serving South Odisha. Experience premium automotive standards, certified customer care, and direct digital booking convenience.
          </p>
        </div>
        
        {/* Col 1: Vehicles & Showroom */}
        <div>
          <h4 className="text-zinc-200 text-xs font-bold uppercase tracking-wider mb-4">Vehicles</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/vehicles/toyota-glanza" className="text-zinc-500 hover:text-[#EB0A1E] transition-colors font-semibold block py-0.5">
                Toyota Glanza
              </Link>
            </li>
            <li>
              <Link href="/vehicles/toyota-urban-cruiser-taisor" className="text-zinc-500 hover:text-[#EB0A1E] transition-colors font-semibold block py-0.5">
                Toyota Taisor
              </Link>
            </li>
            <li>
              <Link href="/vehicles/toyota-urban-cruiser-hyryder" className="text-zinc-500 hover:text-[#EB0A1E] transition-colors font-semibold block py-0.5">
                Urban Cruiser Hyryder
              </Link>
            </li>
            <li>
              <Link href="/vehicles/toyota-innova-hycross" className="text-zinc-500 hover:text-[#EB0A1E] transition-colors font-semibold block py-0.5">
                Innova Hycross
              </Link>
            </li>
            <li>
              <Link href="/vehicles/toyota-fortuner" className="text-zinc-500 hover:text-[#EB0A1E] transition-colors font-semibold block py-0.5">
                Toyota Fortuner
              </Link>
            </li>
            <li>
              <Link href="/vehicles/toyota-hilux" className="text-zinc-500 hover:text-[#EB0A1E] transition-colors font-semibold block py-0.5">
                Toyota Hilux
              </Link>
            </li>
            <li>
              <Link href="/vehicles" className="text-[#EB0A1E] hover:text-red-400 transition-colors font-bold block py-1 border-t border-zinc-900/60 mt-2">
                All Vehicles &rarr;
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 2: Sales & Financing */}
        <div>
          <h4 className="text-zinc-200 text-xs font-bold uppercase tracking-wider mb-4">Sales & Finance</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/offers" className="text-zinc-500 hover:text-[#EB0A1E] transition-colors font-semibold block py-0.5">
                Exclusive Offers
              </Link>
            </li>
            <li>
              <Link href="/book-online" className="text-zinc-500 hover:text-[#EB0A1E] transition-colors font-semibold block py-0.5">
                Book Online Portal
              </Link>
            </li>
            <li>
              <Link href="/book-test-drive" className="text-zinc-500 hover:text-[#EB0A1E] transition-colors font-semibold block py-0.5">
                Schedule Test Drive
              </Link>
            </li>
            <li>
              <Link href="/toyota-emi-calculator" className="text-zinc-500 hover:text-[#EB0A1E] transition-colors font-semibold block py-0.5">
                EMI Calculator
              </Link>
            </li>
            <li>
              <Link href="/car-loan-eligibility" className="text-zinc-500 hover:text-[#EB0A1E] transition-colors font-semibold block py-0.5">
                Loan Eligibility Vetting
              </Link>
            </li>
            <li>
              <Link href="/car-exchange-valuation" className="text-zinc-500 hover:text-[#EB0A1E] transition-colors font-semibold block py-0.5">
                Exchange Value Appraisal
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Service & Care */}
        <div>
          <h4 className="text-zinc-200 text-xs font-bold uppercase tracking-wider mb-4">Service & Care</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/service" className="text-zinc-500 hover:text-[#EB0A1E] transition-colors font-semibold block py-0.5">
                Service Desk
              </Link>
            </li>
            <li>
              <Link href="/service/book-service" className="text-zinc-500 hover:text-[#EB0A1E] transition-colors font-semibold block py-0.5">
                Book Service Slot
              </Link>
            </li>
            <li>
              <Link href="/parts-accessories" className="text-zinc-500 hover:text-[#EB0A1E] transition-colors font-semibold block py-0.5">
                Parts & Accessories
              </Link>
            </li>
            <li>
              <Link href="/insurance-finance" className="text-zinc-500 hover:text-[#EB0A1E] transition-colors font-semibold block py-0.5">
                Insurance Renewal
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="text-zinc-500 hover:text-[#EB0A1E] transition-colors font-semibold block py-0.5">
                My Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Trust & Brand */}
        <div>
          <h4 className="text-zinc-200 text-xs font-bold uppercase tracking-wider mb-4">Trust & Brand</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/about" className="text-zinc-500 hover:text-[#EB0A1E] transition-colors font-semibold block py-0.5">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/why-choose-us" className="text-zinc-500 hover:text-[#EB0A1E] transition-colors font-semibold block py-0.5">
                Why Choose Us
              </Link>
            </li>
            <li>
              <Link href="/reviews" className="text-zinc-500 hover:text-[#EB0A1E] transition-colors font-semibold block py-0.5">
                Customer Reviews
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="text-zinc-500 hover:text-[#EB0A1E] transition-colors font-semibold block py-0.5">
                Showroom Gallery
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-zinc-500 hover:text-[#EB0A1E] transition-colors font-semibold block py-0.5">
                Newsroom Blog
              </Link>
            </li>
            <li>
              <Link href="/faqs" className="text-zinc-500 hover:text-[#EB0A1E] transition-colors font-semibold block py-0.5">
                Help & FAQs
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-zinc-500 hover:text-[#EB0A1E] transition-colors font-semibold block py-0.5">
                Contact Desk
              </Link>
            </li>
            <li>
              <Link href="/branches" className="text-zinc-500 hover:text-[#EB0A1E] transition-colors font-semibold block py-0.5">
                Branches Directory
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom area - Apple Copyright Style */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-900 text-left flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 text-[11px] text-zinc-500 font-semibold">
        <div className="space-y-1">
          <p>&copy; {new Date().getFullYear()} Laxmi Toyota. All rights reserved.</p>
          <p className="text-zinc-650 font-normal">Authorized Dealer for Toyota Kirloskar Motor in South Odisha.</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-zinc-600">
          <Link href="/privacy-policy" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
          <span className="text-zinc-800">|</span>
          <Link href="/terms-and-conditions" className="hover:text-zinc-300 transition-colors">Terms of Service</Link>
          <span className="text-zinc-800">|</span>
          <Link href="/refund-policy" className="hover:text-zinc-300 transition-colors">Refund Policy</Link>
          <span className="text-zinc-800">|</span>
          <Link href="/disclaimer" className="hover:text-zinc-300 transition-colors">Legal Disclaimer</Link>
        </div>
      </div>
    </footer>
  );
}
