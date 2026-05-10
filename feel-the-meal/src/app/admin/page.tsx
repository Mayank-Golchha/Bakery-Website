/**
 * Admin page layout.
 * Contains admin login and dashboard.
 * If not authenticated, shows login form.
 * If authenticated, shows product management dashboard.
 */

"use client";

import React from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const { isAuthenticated } = useAdminAuth();

  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
}
