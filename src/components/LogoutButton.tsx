import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Ensure we clear any local storage state to prevent stale session artifacts
      window.localStorage.clear();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Something went wrong while logging out. Please try again.");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center text-red-500 hover:text-red-400 bg-red-500/10 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
    >
      <LogOut className="w-4 h-4 mr-2" /> Logout
    </button>
  );
}
