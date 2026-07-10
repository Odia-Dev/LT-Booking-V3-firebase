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
  Loader2,
  Menu,
  X,
  FileText,
  Boxes,
  PlusCircle,
  History,
  Archive,
  BookOpen
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const crmItems = [
    {
      name: "CRM Console",
      href: "/admin/dashboard",
      icon: FileText,
    }
  ];

  const inventoryItems = [
    {
      name: "Overview",
      href: "/admin/dashboard/inventory",
      icon: Boxes,
    },
    {
      name: "Vehicle Inventory",
      href: "/admin/dashboard/inventory/list",
      icon: Car,
    },
    {
      name: "Receive New Stock",
      href: "/admin/dashboard/inventory/receive",
      icon: PlusCircle,
    },
    {
      name: "Stock Movement",
      href: "/admin/dashboard/inventory/movement",
      icon: History,
    },
    {
      name: "Archive",
      href: "/admin/dashboard/inventory/archive",
      icon: Archive,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center space-y-2">
          <Loader2 className="w-8 h-8 text-[#EB0A1E] animate-spin mx-auto" />
          <p className="text-xs text-zinc-400">Loading Dashboard Context...</p>
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
          <div className="text-xs text-slate-400 font-medium">Operations Center</div>
        </div>

        <nav className="flex-1 p-4 space-y-6">
          {/* CRM operations section */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-4">
              CRM Operations
            </div>
            <div className="space-y-1">
              {crmItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-205 ${
                      isActive
                        ? "bg-[#EB0A1E] text-white shadow-lg shadow-red-900/30"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Inventory section */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-4">
              EDP Team Inventory
            </div>
            <div className="space-y-1">
              {inventoryItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-205 ${
                      isActive
                        ? "bg-[#EB0A1E] text-white shadow-lg shadow-red-900/30"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <Link
              href="/admin/cms/vehicle"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200"
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              PIM CMS Console
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
          <span className="text-[10px] text-slate-400">Operations Console</span>
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
          <nav className="flex-1 space-y-6">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-2">
                CRM Operations
              </div>
              <div className="space-y-1">
                {crmItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
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
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-2">
                EDP Team Inventory
              </div>
              <div className="space-y-1">
                {inventoryItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
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
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <Link
                href="/admin/cms/vehicle"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold text-slate-300 hover:bg-slate-800"
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                PIM CMS Console
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
