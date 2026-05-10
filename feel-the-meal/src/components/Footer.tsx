/**
 * Footer component.
 * Premium dark footer with brand info, navigation links,
 * and social placeholders. Matches the overall dark cinematic style.
 */

import React from "react";
import Link from "next/link";

const FOOTER_LINKS = {
  products: [
    { href: "/products?category=cakes", label: "Cakes" },
    { href: "/products?category=chocolates", label: "Chocolates" },
    { href: "/products?category=cookies", label: "Cookies" },
    { href: "/products", label: "All Products" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ],
  support: [
    { href: "/", label: "Shipping" },
    { href: "/", label: "Returns" },
    { href: "/", label: "FAQ" },
    { href: "/", label: "Privacy Policy" },
  ],
};

export default function Footer() {
  return (
    <footer
      id="footer"
      className="bg-[#080808] border-t border-white/5 mt-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-gradient-gold mb-4">
              Feel The Meal
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
              Premium handcrafted confections delivered to your doorstep.
              Every bite tells a story of passion and precision.
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Crafted with care, delivered with love.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-4">
              Products
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.products.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            2025 Feel The Meal. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer">
              Terms
            </span>
            <span className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer">
              Privacy
            </span>
            <span className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer">
              Cookies
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
