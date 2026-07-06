"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Bot, User, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";

interface Message {
  sender: "bot" | "user";
  text: string;
}

const QUICK_REPLIES = [
  "What is the mileage?",
  "Is Glanza in stock?",
  "How to book online?"
];

export default function RegionalAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Namaskar! 🙏 Welcome to Laxmi Toyota. Need help finding a car or want to claim your ₹5,000 online booking bonus? Ask me in Odia, Hindi, or English!"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const newMessages = [...messages, { sender: "user", text } as Message];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.response || "I'm sorry, I encountered an error. Please try booking online directly!" }
      ]);
    } catch (e) {
      console.error("Chat Error:", e);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Connection error. To claim your ₹5,000 online discount, click 'Book Now' on any model!" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans select-none">
      
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-[#EB0A1E] text-white shadow-xl shadow-red-900/30 flex items-center justify-center hover:scale-105 hover:bg-red-700 active:scale-95 transition-all duration-200 animate-bounce"
          title="Ask Laxmi AI Assistant"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window Box */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[500px] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between animate-scale-up">
          
          {/* Header */}
          <div className="bg-slate-950 p-4 text-white flex justify-between items-center border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-red-600 rounded-full flex items-center justify-center border border-red-500 shadow-inner">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm flex items-center gap-1">
                  Laxmi AI Salesman <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </h4>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Online & Assistant Active</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 items-start max-w-[85%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border ${
                  msg.sender === "user"
                    ? "bg-slate-900 border-slate-800 text-white"
                    : "bg-red-50 border-red-100 text-[#EB0A1E]"
                }`}>
                  {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                
                <div className={`rounded-2xl p-3.5 text-xs leading-relaxed font-medium shadow-sm ${
                  msg.sender === "user"
                    ? "bg-[#EB0A1E] text-white rounded-tr-none"
                    : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none"
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2.5 items-start max-w-[80%]">
                <div className="h-8 w-8 rounded-full bg-red-50 border border-red-100 text-[#EB0A1E] flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-1.5 shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-[#EB0A1E]" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies & Input Container */}
          <div className="border-t border-slate-200 bg-white p-3 space-y-3">
            
            {/* Quick replies bubbles */}
            <div className="flex flex-wrap gap-2">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleSendMessage(reply)}
                  disabled={isLoading}
                  className="bg-slate-50 hover:bg-red-50 border border-slate-200/80 hover:border-[#EB0A1E]/30 text-[10px] font-bold text-slate-600 hover:text-[#EB0A1E] px-3 py-1.5 rounded-full transition-all duration-150 uppercase tracking-wider"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Message input bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex gap-2 border border-slate-200 rounded-xl p-1 bg-slate-50 focus-within:bg-white focus-within:border-[#EB0A1E] transition-all"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me in Odia, Hindi, or English..."
                className="flex-1 bg-transparent px-3 py-2 text-xs focus:outline-none text-slate-800"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="h-8 w-8 bg-[#EB0A1E] hover:bg-red-700 text-white rounded-lg flex items-center justify-center disabled:opacity-40 transition-colors shadow-md shadow-red-900/10 shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
