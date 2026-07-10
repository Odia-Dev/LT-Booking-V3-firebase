"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/AuthForm";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Car, 
  Settings, 
  Palette, 
  QrCode, 
  LayoutDashboard,
  IndianRupee,
  Tag,
  Loader2,
  Menu,
  X
} from "lucide-react";

export default function CMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const menuItems = [
    {
      name: "CMS Dashboard",
      href: "/admin/cms",
      icon: LayoutDashboard,
    },
    {
      name: "Vehicle Master",
      href: "/admin/cms/vehicle",
      icon: Car,
    },
    {
      name: "Variant Master",
      href: "/admin/cms/variant",
      icon: Settings,
    },
    {
      name: "Pricing Management",
      href: "/admin/cms/pricing",
      icon: IndianRupee,
    },
    {
      name: "Offers Management",
      href: "/admin/cms/offers",
      icon: Tag,
    },
    {
      name: "Toyota Color Master",
      href: "/admin/cms/color",
      icon: Palette,
    },
    {
      name: "Toyota Suffix Master",
      href: "/admin/cms/suffix",
      icon: QrCode,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center space-y-2">
          <Loader2 className="w-8 h-8 text-[#EB0A1E] animate-spin mx-auto" />
          <p className="text-xs text-zinc-400">Loading CMS Context...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 shrink-0">
        <div className="p-6 border-b border-slate-800 flex flex-col gap-1">
          <div className="text-[#EB0A1E] font-bold text-lg tracking-wider font-display uppercase">
            Laxmi Toyota
          </div>
          <div className="text-xs text-slate-400 font-medium">Vehicle Management CMS</div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#EB0A1E] text-white shadow-lg shadow-red-900/30"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.name}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-800 mt-4">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200"
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              Admin Dashboard
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 mb-2 truncate px-2">{user.email}</div>
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile Navigation Header */}
      <header className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between z-20">
        <div className="flex flex-col">
          <span className="text-[#EB0A1E] font-bold tracking-wider font-display uppercase text-sm">
            Laxmi Toyota
          </span>
          <span className="text-[10px] text-slate-400">CMS Console</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white hover:text-[#EB0A1E] transition-colors p-1"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] bg-slate-950/95 z-10 flex flex-col p-6 animate-in fade-in slide-in-from-top duration-200">
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#EB0A1E] text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.name}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-slate-800 mt-4">
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800"
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                Admin Dashboard
              </Link>
            </div>
          </nav>
          <div className="pt-4 border-t border-slate-800">
            <div className="text-xs text-slate-400 mb-2 truncate">{user.email}</div>
            <LogoutButton />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-slate-950 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
