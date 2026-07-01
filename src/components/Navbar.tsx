"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function Navbar() {
  const { user, loading, signingIn, loginWithGoogle, logout } = useAuth();

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">
                Laxmi Toyota
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="text-zinc-400 hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              Browse Cars
            </Link>
            
            <Link 
              href="/admin/dashboard" 
              className="text-zinc-400 hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              Dashboard
            </Link>

            {loading ? (
              <div className="h-8 w-8 rounded-full border border-zinc-800 bg-zinc-900 animate-pulse" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                <div className="relative group cursor-pointer">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || "User Avatar"}
                      width={36}
                      height={36}
                      className="rounded-full border border-zinc-700 ring-2 ring-transparent group-hover:ring-red-500 transition-all duration-200"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold text-sm border border-red-500 group-hover:border-white transition-colors">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={logout}
                  className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-all duration-200"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                disabled={signingIn}
                className="rounded-full bg-gradient-to-r from-red-600 to-red-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-red-900/20 hover:from-red-500 hover:to-red-400 hover:shadow-red-950/40 hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-50 transition-all duration-200"
              >
                {signingIn ? "Logging in..." : "Login"}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
