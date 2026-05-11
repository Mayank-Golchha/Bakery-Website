/**
 * Hidden Admin route.
 * Accessible only at /vinitanahata
 * Protected by Supabase Auth and email whitelist.
 */

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { motion } from "framer-motion";
import { Lock, LogIn } from "lucide-react";

const ALLOWED_EMAILS = [
  "feelthemeal21@gmail.com",
  "varshadilip999@gmail.com"
];

export default function HiddenAdminPage() {
  const { user, loading, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.email && ALLOWED_EMAILS.includes(user.email)) {
          setIsAuthorized(true);
        } else {
          // Logged in but not authorized
          setIsAuthorized(false);
          router.replace("/");
        }
      } else {
        // Not logged in at all
        setIsAuthorized(null);
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--accent-gold)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If authorized, show dashboard
  if (isAuthorized === true) {
    return <AdminDashboard />;
  }

  // If not logged in, show a login prompt (premium design)
  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)]"
        >
          <div className="w-16 h-16 bg-[var(--accent-gold)]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-[var(--accent-gold)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Admin Access</h1>
          <p className="text-[var(--text-muted)] mb-8">
            Please sign in with an authorized Google account to access the dashboard.
          </p>
          <button
            onClick={loginWithGoogle}
            className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-3 font-semibold"
          >
            <LogIn className="w-5 h-5" />
            Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  // If unauthorized and redirecting
  return null;
}
