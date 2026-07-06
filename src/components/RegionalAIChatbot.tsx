'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { MessageCircle, X, Send, User, Bot, Phone } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { db, isConfigured } from '@/lib/firebase';

export default function RegionalAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHandoffForm, setShowHandoffForm] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', phone: '' });
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check for the [SHOW_FORM] trigger from the AI
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && lastMessage.content.includes('[SHOW_FORM]')) {
      setShowHandoffForm(true);
    }
  }, [messages]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone) return;

    try {
      const leadData = {
        name: leadForm.name.trim(),
        phone: leadForm.phone.trim(),
        status: 'New Chat Lead',
        chatHistory: messages.map(m => ({ role: m.role, content: m.content.replace('[SHOW_FORM]', '') })),
        submittedAt: isConfigured ? serverTimestamp() : new Date().toISOString()
      };

      if (isConfigured) {
        await addDoc(collection(db, 'chatbot_leads'), leadData);
      } else {
        const localLeadsRaw = localStorage.getItem('laxmi_toyota_chatbot_leads');
        const localLeads = localLeadsRaw ? JSON.parse(localLeadsRaw) : [];
        localLeads.push(leadData);
        localStorage.setItem('laxmi_toyota_chatbot_leads', JSON.stringify(localLeads));
      }

      setLeadSubmitted(true);
      setTimeout(() => {
        setShowHandoffForm(false);
        setLeadSubmitted(false);
        setLeadForm({ name: '', phone: '' });
      }, 4000);
    } catch (error) {
      console.error("Error saving lead: ", error);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#EB0A1E] text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center justify-center animate-bounce"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-[350px] sm:w-[400px] h-[500px] rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg flex items-center"><Bot size={20} className="mr-2 text-[#EB0A1E]" /> Laxmi AI Assistant</h3>
              <p className="text-xs text-gray-300">English • हिन्दी • ଓଡିଆ • Telugu</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-4">
                Namaskar! 🙏 How can I help you find your dream Toyota today? Ask me anything!
              </div>
            )}
            
            {messages.map((m) => {
              // Hide the trigger keyword from the user
              const cleanContent = m.content.replace('[SHOW_FORM]', '');
              if (!cleanContent.trim()) return null;

              return (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.role === 'user' ? 'bg-slate-900 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                    {cleanContent}
                  </div>
                </div>
              );
            })}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-250 text-gray-500 rounded-2xl rounded-bl-none px-4 py-2 text-sm animate-pulse">
                  Typing...
                </div>
              </div>
            )}

            {/* Human Handoff Form Popup */}
            {showHandoffForm && (
              <div className="bg-white border-2 border-[#EB0A1E] rounded-xl p-4 shadow-lg animate-in fade-in slide-in-from-bottom-4 mt-4">
                {!leadSubmitted ? (
                  <form onSubmit={handleLeadSubmit}>
                    <p className="text-sm font-bold text-gray-800 mb-3">Please provide your details, and our Sales Officer will call you shortly.</p>
                    <div className="space-y-3">
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <input type="text" required placeholder="Your Name" value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})} className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm outline-none focus:border-[#EB0A1E]" />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <input type="tel" required placeholder="Mobile Number" value={leadForm.phone} onChange={e => setLeadForm({...leadForm, phone: e.target.value})} className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm outline-none focus:border-[#EB0A1E]" />
                      </div>
                      <button type="submit" className="w-full bg-[#EB0A1E] text-white py-2 rounded-lg font-bold text-sm hover:bg-red-750 transition-colors">
                        Request Call Back
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-4 text-green-600">
                    <p className="font-bold text-lg">Thank You!</p>
                    <p className="text-sm text-gray-600">Our executive will contact you shortly.</p>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#EB0A1E]/50"
                value={input}
                onChange={handleInputChange}
                placeholder="Type in English, Odia, or Hindi..."
                disabled={showHandoffForm && !leadSubmitted} // Disable typing if form is showing
              />
              <button 
                type="submit" 
                disabled={!input.trim() || (showHandoffForm && !leadSubmitted)}
                className="bg-[#EB0A1E] text-white p-2.5 rounded-full disabled:opacity-50 hover:bg-red-750 transition-colors shrink-0"
              >
                <Send size={18} className="ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
