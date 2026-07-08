"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" {...props}>
    <path
      fill="#EA4335"
      d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3A11.966 11.966 0 0 0 12 0C7.309 0 3.268 2.686 1.277 6.605l3.99 3.16Z"
    />
    <path
      fill="#34A853"
      d="M16.04 15.345c-1.127.764-2.509 1.218-4.04 1.218a7.09 7.09 0 0 1-6.733-4.854l-3.995 3.16C3.268 21.314 7.31 24 12 24c3.245 0 6.18-1.08 8.41-2.918l-4.37-3.737Z"
    />
    <path
      fill="#4285F4"
      d="M23.82 12.218c0-.79-.07-1.554-.2-2.3H12v4.545h6.636a5.673 5.673 0 0 1-2.463 3.736l4.37 3.737c2.554-2.355 3.82-5.71 3.82-9.718Z"
    />
    <path
      fill="#FBBC05"
      d="M5.266 14.236A7.09 7.09 0 0 1 4.91 12c0-.79.136-1.55.356-2.235L1.277 6.605A11.962 11.962 0 0 0 0 12c0 1.94.464 3.764 1.277 5.395l3.99-3.16Z"
    />
  </svg>
);

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error(err);
      setError("Google Sign-In failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/user-not-found") {
        setError("Account not found. Please sign up instead.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("Email is already registered. Please sign in.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(err.message || "Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-slate-900/40 border border-slate-800/80 rounded-3xl shadow-2xl backdrop-blur-md">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-white tracking-tight">
          {isLogin ? "Welcome Back" : "Join Laxmi Toyota"}
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          {isLogin ? "Sign in to access your dashboard" : "Create an account to start booking"}
        </p>
      </div>

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-850 bg-slate-950 hover:bg-slate-900 hover:border-slate-800 transition-all font-bold text-sm text-white mb-6 disabled:opacity-50"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <div className="relative flex items-center mb-6">
        <div className="flex-grow border-t border-slate-850"></div>
        <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Or continue with</span>
        <div className="flex-grow border-t border-slate-850"></div>
      </div>

      <form onSubmit={handleEmailAuth} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-850 rounded-xl text-white focus:border-red-650 outline-none transition-all text-sm font-semibold focus:outline-none"
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-950/60 border border-slate-850 rounded-xl text-white focus:border-red-650 outline-none transition-all text-sm font-semibold focus:outline-none"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-350"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && <p className="text-xs font-bold text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#EB0A1E] text-white py-3 rounded-xl font-bold text-sm shadow-xl shadow-red-950/10 hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLogin ? "Sign In" : "Create Account")}
        </button>
      </form>

      <p className="text-center text-xs text-slate-400 mt-6 font-medium">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button onClick={() => setIsLogin(!isLogin)} className="text-red-500 font-bold ml-1 hover:underline">
          {isLogin ? "Sign up" : "Sign in"}
        </button>
      </p>
    </div>
  );
}
