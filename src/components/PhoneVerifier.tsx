"use client";

import React, { useState, useEffect, useRef } from "react";
import { auth, db, isConfigured } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Phone, Lock, X, Loader2, CheckCircle2, ShieldAlert } from "lucide-react";

interface PhoneVerifierProps {
  onSuccess: (phoneNumber: string) => void;
  onClose: () => void;
  userId?: string | null;
}

export default function PhoneVerifier({ onSuccess, onClose, userId }: PhoneVerifierProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<1 | 2>(1); // 1 = Enter Phone, 2 = Enter OTP
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);

  useEffect(() => {
    if (!isConfigured) return;

    // Initialize Invisible reCAPTCHA
    try {
      if (!window.recaptchaVerifier) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: () => {
              // reCAPTCHA solved
            },
            "expired-callback": () => {
              setError("reCAPTCHA expired. Please try sending OTP again.");
            }
          }
        );
        window.recaptchaVerifier = recaptchaVerifierRef.current;
      } else {
        recaptchaVerifierRef.current = window.recaptchaVerifier;
      }
    } catch (err) {
      console.error("reCAPTCHA initialization error:", err);
    }

    return () => {
      // Clean up verification to prevent duplicate hooks
    };
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSending(true);

    const cleanedPhone = phoneNumber.trim().replace(/\s+/g, "");
    if (!/^\+91\d{10}$/.test(cleanedPhone)) {
      setError("Please enter a valid phone number with +91 country code (e.g. +919876543210).");
      setIsSending(false);
      return;
    }

    if (!isConfigured) {
      // Mock Sandbox OTP Flow
      setTimeout(() => {
        setIsSending(false);
        setStep(2);
        console.log("Mock OTP sent to: ", cleanedPhone);
      }, 1000);
      return;
    }

    try {
      const verifier = recaptchaVerifierRef.current;
      if (!verifier) {
        throw new Error("reCAPTCHA verifier not initialized.");
      }

      const confirmation = await signInWithPhoneNumber(auth, cleanedPhone, verifier);
      confirmationResultRef.current = confirmation;
      setStep(2);
    } catch (err: any) {
      console.error("Send OTP Error:", err);
      if (err.code === "auth/too-many-requests") {
        setError("Too many requests. Please wait a few minutes before trying again.");
      } else {
        setError(err.message || "Failed to send OTP. Please check your network and try again.");
      }
      // Reset reCAPTCHA if error happens
      if (window.grecaptcha && recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsVerifying(true);

    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError("OTP must be a 6-digit numeric code.");
      setIsVerifying(false);
      return;
    }

    const cleanedPhone = phoneNumber.trim().replace(/\s+/g, "");

    if (!isConfigured) {
      // Mock Sandbox Verification Success
      setTimeout(async () => {
        setIsVerifying(false);
        const resolvedUid = userId || "mock-uid-123";
        // Save mock profile in localStorage
        const mockUsersRaw = localStorage.getItem("laxmi_toyota_users") || "{}";
        const mockUsers = JSON.parse(mockUsersRaw);
        mockUsers[resolvedUid] = { phone: cleanedPhone, isPhoneVerified: true };
        localStorage.setItem("laxmi_toyota_users", JSON.stringify(mockUsers));
        
        onSuccess(cleanedPhone);
      }, 1000);
      return;
    }

    try {
      const confirmation = confirmationResultRef.current;
      if (!confirmation) {
        throw new Error("No confirmation session found. Please request a new OTP.");
      }

      const credential = await confirmation.confirm(otp);
      const user = credential.user;

      if (user) {
        const resolvedUid = userId || user.uid;
        // Save verification status to Firestore
        await setDoc(
          doc(db, "users", resolvedUid),
          {
            phone: cleanedPhone,
            isPhoneVerified: true,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );

        setIsVerifying(false);
        onSuccess(cleanedPhone);
      } else {
        throw new Error("Failed to authenticate user.");
      }
    } catch (err: any) {
      console.error("Verify OTP Error:", err);
      if (err.code === "auth/invalid-verification-code") {
        setError("Invalid Code. Please verify the 6-digit OTP code and enter it again.");
      } else {
        setError(err.message || "Authentication failed. Please verify the OTP or try again.");
      }
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      {/* Invisible reCAPTCHA anchor */}
      <div id="recaptcha-container"></div>

      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 animate-scale-up">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors p-1 bg-slate-50 hover:bg-slate-100 rounded-full"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto text-blue-600 border border-blue-500/20">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">OTP Mobile Verification</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Verify your phone number with a quick secure SMS passcode to unlock priority reservation status.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl text-xs font-semibold flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 1 ? (
          /* STEP 1: Phone input */
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="phoneNumber" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Phone className="h-4 w-4" />
                </span>
                <input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+919876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none transition-all duration-150 font-medium"
                />
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                Enter phone number in international format starting with country code (e.g. +91 for India).
              </span>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-blue-500/10 hover:bg-blue-700 disabled:opacity-50 transition-all duration-200"
            >
              {isSending ? (
                <span className="flex items-center justify-center gap-1.5">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending SMS...
                </span>
              ) : (
                "Send Verification Code"
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: OTP Code input */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="otp" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Verification Code
                </label>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  Change Number
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="otp"
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none transition-all duration-150 font-mono tracking-[0.3em] text-center"
                />
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                Sent to: <strong className="text-slate-700">{phoneNumber}</strong>. Please input the passcode received.
              </span>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full rounded-xl bg-green-600 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-green-500/10 hover:bg-green-700 disabled:opacity-50 transition-all duration-200"
            >
              {isVerifying ? (
                <span className="flex items-center justify-center gap-1.5">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying Code...
                </span>
              ) : (
                "Verify & Continue"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// Extend global window object type definition for grecaptcha & recaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier: any;
    grecaptcha: any;
  }
}
