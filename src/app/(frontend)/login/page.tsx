"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/AuthForm";

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-red-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-4">
      {/* Branding Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Laxmi Toyota</h1>
        <p className="text-slate-500 mt-1 font-medium">Digital Dealership Login</p>
      </div>

      {/* The AuthForm handles its own interior spacing, but we constrain it here */}
      <div className="w-full max-w-md">
        <AuthForm />
      </div>

      {/* Footer link */}
      <div className="mt-8 text-center text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} Laxmi Toyota. All rights reserved.</p>
      </div>
    </main>
  );
}
