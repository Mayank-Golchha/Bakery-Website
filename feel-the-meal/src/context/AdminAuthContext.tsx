/**
 * Admin authentication context.
 * Fixed credentials authentication with session persistence.
 * Username: admin, Password: admin123
 */

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ADMIN_CREDENTIALS } from "@/lib/types";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "feel-the-meal-admin-auth";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check stored auth on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored === "true") {
        setIsAuthenticated(true);
      }
    } catch {
      // Ignore
    }
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (
      trimmedUsername === ADMIN_CREDENTIALS.username &&
      trimmedPassword === ADMIN_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_STORAGE_KEY, "true");
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}
