"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Send, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { db, isConfigured } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function BookServicePage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [regNo, setRegNo] = useState("");
  const [serviceType, setServiceType] = useState("Periodic Maintenance");
  const [preferredDate, setPreferredDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const serviceLead = {
      fullName: name.trim(),
      phone: phone.trim(),
      registrationNumber: regNo.trim().toUpperCase(),
      serviceType,
      preferredDate,
      type: "Service Appointment",
      status: "New Lead",
      createdAt: new Date().toISOString()
    };

    try {
      if (isConfigured) {
        await addDoc(collection(db, "service_appointments"), serviceLead);
      } else {
        const existingRaw = localStorage.getItem("laxmi_toyota_service_appointments");
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        existing.push(serviceLead);
        localStorage.setItem("laxmi_toyota_service_appointments", JSON.stringify(existing));
      }
      setSuccess(true);
      setName("");
      setPhone("");
      setRegNo("");
      setPreferredDate("");
    } catch (err: any) {
      console.error(err);
      setError("Failed to schedule service appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="space-y-3">
          <Link href="/service" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-[#EB0A1E] transition-colors gap-1">
            <ArrowLeft className="w-4 h-4" /> Service Overview
          </Link>
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-red-50 border border-red-100 px-3 py-1 rounded">
              Appointment Form
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight pt-2">Schedule Service</h1>
            <p className="text-slate-500 text-xs leading-relaxed">
              Book a date and time slot. Our team will verify and lock your express bay.
            </p>
          </div>
        </div>

        {success ? (
          <div className="bg-emerald-50 border border-emerald-250 p-6 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Appointment Booked</h3>
            <p className="text-xs text-slate-650 leading-relaxed">
              Your service slot request has been logged successfully. An advisor will contact you to confirm.
            </p>
            <button onClick={() => setSuccess(false)} className="text-xs text-[#EB0A1E] font-bold uppercase tracking-wider hover:underline">
              Book another service
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-lg text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile Number</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit number"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle Reg No</label>
                <input
                  type="text"
                  required
                  placeholder="OD-07-XX-XXXX"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Service Type</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none transition-all"
                >
                  <option value="Periodic Maintenance">Periodic Maintenance</option>
                  <option value="General Diagnostics">General Diagnostics & Repair</option>
                  <option value="Wheel Care">Wheel Alignment & Balance</option>
                  <option value="Body & Paint">Body & Paint Workshop</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preferred Date</label>
                <input
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#EB0A1E] hover:bg-red-750 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-red-500/10 flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />} Book Appointment
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
