/**
 * Navbar component.
 * Premium dark glassmorphism navbar with logo, navigation links,
 * search bar, cart icon with badge, and admin login link.
 * Collapses into a mobile hamburger menu on small screens.
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, Menu, X, Lock, LogIn, LogOut, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/products?category=cakes", label: "Cakes" },
  { href: "/products?category=chocolates", label: "Chocolates" },
  { href: "/products?category=cookies", label: "Cookies" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const { user, loginWithGoogle, logout } = useAuth();

  // Track scroll to add glass effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" id="logo-link">
            <span className="text-xl lg:text-2xl font-bold tracking-tight text-gradient-gold">
              Feel The Meal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 hover:text-[var(--accent-gold)] ${
                  pathname === link.href
                    ? "text-[var(--accent-gold)]"
                    : "text-[var(--text-secondary)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Search (Desktop) */}
            <AnimatePresence>
              {isSearchOpen && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSearch}
                  className="hidden lg:flex overflow-hidden"
                >
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-dark text-sm h-9 w-full"
                    autoFocus
                    id="desktop-search-input"
                  />
                </motion.form>
              )}
            </AnimatePresence>

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full hover:bg-white/5 transition-colors"
              aria-label="Toggle search"
              id="search-toggle-btn"
            >
              <Search className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-white/5 transition-colors"
              aria-label="Open cart"
              id="cart-toggle-btn"
            >
              <ShoppingCart className="w-5 h-5 text-[var(--text-secondary)]" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 bg-[var(--accent-gold)] text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </motion.span>
              )}
            </button>

            {/* User Auth */}
            {user ? (
              <div className="hidden sm:flex items-center gap-3 border-l border-white/10 pl-3">
                <Link
                  href="/orders"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-[var(--accent-gold)]/30 hover:bg-white/5 transition-all text-xs text-[var(--text-secondary)] hover:text-[var(--accent-gold)]"
                >
                  <Package className="w-3.5 h-3.5" />
                  Orders
                </Link>
                <div className="flex items-center gap-2">
                  {user.user_metadata?.avatar_url && (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Avatar"
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-red-500/30 hover:text-red-400 hover:bg-red-500/10 transition-all text-xs text-[var(--text-secondary)]"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-[var(--accent-gold)]/30 hover:bg-white/5 transition-all text-xs text-[var(--text-secondary)] hover:text-[var(--accent-gold)]"
              >
                <LogIn className="w-3.5 h-3.5" />
                Login
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[var(--text-secondary)]" />
              ) : (
                <Menu className="w-5 h-5 text-[var(--text-secondary)]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="px-4 py-4 space-y-3">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-dark text-sm h-10 w-full"
                  id="mobile-search-input"
                />
              </form>

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-2 text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-[var(--accent-gold)]"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <>
                  <Link
                    href="/orders"
                    className="flex items-center gap-2 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-gold)]"
                  >
                    <Package className="w-4 h-4" />
                    My Orders
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 py-2 text-sm text-red-400 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={loginWithGoogle}
                  className="flex items-center gap-2 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-gold)] w-full text-left"
                >
                  <LogIn className="w-4 h-4" />
                  Login with Google
                </button>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
