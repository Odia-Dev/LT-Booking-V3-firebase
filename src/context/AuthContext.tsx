"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider, isConfigured } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signingIn: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (!isConfigured) {
      setUser(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    if (signingIn) return;
    setSigningIn(true);

    if (!isConfigured) {
      // Mock login for developer testing
      setUser({
        uid: "mock-uid-123",
        displayName: "Laxmi Customer (Demo)",
        email: "demo@laxmitoyota.co.in",
        photoURL: null,
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: "",
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => "mock-token",
        getIdTokenResult: async () => ({} as any),
        reload: async () => {},
        toJSON: () => ({}),
        providerId: "google.com",
        phoneNumber: null,
      } as any);
      setSigningIn(false);
      return;
    }

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    } finally {
      setSigningIn(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    if (signingIn) return;
    setSigningIn(true);

    if (!isConfigured) {
      // Mock login for developer testing
      setUser({
        uid: "mock-admin-uid",
        displayName: "Laxmi Admin",
        email: email,
        photoURL: null,
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: "",
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => "mock-token",
        getIdTokenResult: async () => ({} as any),
        reload: async () => {},
        toJSON: () => ({}),
        providerId: "password",
        phoneNumber: null,
      } as any);
      setSigningIn(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing in with Email/Password:", error);
      throw error;
    } finally {
      setSigningIn(false);
    }
  };

  const logout = async () => {
    if (!isConfigured) {
      setUser(null);
      return;
    }

    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };


  return (
    <AuthContext.Provider value={{ user, loading, signingIn, loginWithGoogle, loginWithEmail, logout, isConfigured }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
