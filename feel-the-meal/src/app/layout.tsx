/**
 * Root layout for Feel The Meal.
 * Provides global fonts, metadata, cart context, admin auth context,
 * navbar, footer, and cart drawer across all pages.
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Feel The Meal - Premium Artisan Confections",
  description:
    "Discover premium handcrafted cakes, chocolates, and cookies. Feel The Meal brings artisan confections crafted with passion and delivered across India.",
  keywords: [
    "cakes",
    "chocolates",
    "cookies",
    "premium confections",
    "artisan bakery",
    "India",
    "Feel The Meal",
  ],
  openGraph: {
    title: "Feel The Meal - Premium Artisan Confections",
    description:
      "Discover premium handcrafted cakes, chocolates, and cookies delivered across India.",
    type: "website",
    siteName: "Feel The Meal",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--bg-primary)]">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
