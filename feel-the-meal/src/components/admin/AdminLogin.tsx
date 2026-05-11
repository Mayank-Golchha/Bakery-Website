/**
 * Admin Login component.
 * Minimal dark login form with fixed credentials.
 * Username: admin, Password: admin123
 */

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, AlertCircle } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Trim inputs to handle accidental spaces on mobile
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    const success = login(trimmedUsername, trimmedPassword);
    if (!success) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg-primary)]">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center">
            <Lock className="w-7 h-7 text-[var(--accent-gold)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Admin Access
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-2">
            Sign in to manage products and orders
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]"
          id="admin-login-form"
        >
          <div>
            <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-dark text-sm"
              placeholder="Enter username"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              id="admin-username"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-dark text-sm"
              placeholder="Enter password"
              autoComplete="current-password"
              autoCapitalize="none"
              autoCorrect="off"
              id="admin-password"
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-xs text-red-400"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            className="w-full btn-primary py-3 rounded-xl text-sm font-semibold"
            id="admin-login-btn"
          >
            Sign In
          </button>
        </form>
      </motion.div>
    </div>
  );
}
