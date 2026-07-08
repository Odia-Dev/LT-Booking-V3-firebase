"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/AuthForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // Redirect to admin dashboard if logged in
      router.push("/admin/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative">
      {/* Return to Home link */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          {/* Logo / Brand header */}
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">
            Console Login
          </span>
        </div>

        <AuthForm />
      </div>
    </div>
  );
}
