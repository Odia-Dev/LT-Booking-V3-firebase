"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Send, CheckCircle2, Loader2, Landmark } from "lucide-react";
import { db, isConfigured } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const leadData = {
      fullName: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      message: message.trim(),
      type: "Contact Inquiry",
      status: "New Lead",
      createdAt: new Date().toISOString()
    };

    try {
      if (isConfigured) {
        await addDoc(collection(db, "contact_inquiries"), leadData);
      } else {
        const existingRaw = localStorage.getItem("laxmi_toyota_contact_inquiries");
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        existing.push(leadData);
        localStorage.setItem("laxmi_toyota_contact_inquiries", JSON.stringify(existing));
      }
      setSuccess(true);
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      console.error(err);
      setError("Failed to submit contact form. Please check your network and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/80">
        
        {/* Left Column - Contact Details */}
        <div className="md:col-span-5 bg-slate-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-red-950/40 via-transparent to-transparent opacity-60 pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E] bg-[#EB0A1E]/10 border border-[#EB0A1E]/20 px-3 py-1 rounded">
              Get in Touch
            </span>
            <h1 className="text-3xl font-black tracking-tight">Contact Desk</h1>
            <p className="text-slate-400 text-xs leading-relaxed pt-1">
              Have questions about pricing, allocations, or technical specs? Fill out the form or reach out directly to our central support lines.
            </p>
          </div>

          <div className="relative z-10 space-y-6 pt-12 border-t border-slate-800/80 text-sm">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#EB0A1E]" />
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Call Support</span>
                <span className="text-slate-200">+91 94370 00001</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-400" />
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Email Support</span>
                <span className="text-slate-200">support@laxmitoyota.co.in</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#EB0A1E]" />
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Headquarters</span>
                <span className="text-slate-200 leading-relaxed">Haldiapadar NH-16, Brahmapur, Ganjam, Odisha 760003</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Send a Query</h2>
            <p className="text-slate-500 text-xs mt-1">Our sales consultants will review and respond within 2 working hours.</p>
          </div>

          {success ? (
            <div className="bg-emerald-50 border border-emerald-250 p-6 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">Inquiry Logged</h3>
              <p className="text-xs text-slate-650 leading-relaxed">
                Thank you! Your message was saved. Our relationship desk will call you shortly.
              </p>
              <button onClick={() => setSuccess(false)} className="text-xs text-[#EB0A1E] font-bold uppercase tracking-wider hover:underline">
                Send another message
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
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help you?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#EB0A1E] hover:bg-red-750 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-red-500/10 flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />} Submit Query
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
