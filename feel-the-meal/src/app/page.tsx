/**
 * Homepage - Feel The Meal.
 * Cinematic landing page with:
 * - Hero section (Flow-style animated image grid)
 * - Categories section
 * - Featured products section
 * - Brand statement section
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";

export default function HomePage() {
  return (
    <>
      {/* Hero - Cinematic animated image grid */}
      <HeroSection />

      {/* Categories */}
      <CategoriesSection />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Brand Statement */}
      <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--accent-gold)] font-medium mb-6 block">
              Our Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-8 leading-tight">
              Every creation is a conversation between{" "}
              <span className="text-gradient-gold">flavor</span> and{" "}
              <span className="text-gradient-gold">feeling</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              At Feel The Meal, we believe confections are more than food. They
              are moments of joy, carefully constructed from the finest
              ingredients sourced across the subcontinent. Each piece carries
              the warmth of handcraft and the precision of mastery.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Parallax Image Band */}
      <section className="relative h-64 sm:h-80 overflow-hidden">
        <div className="absolute inset-0 flex gap-3">
          {["/image3.webp", "/image7.webp", "/image11.webp", "/image15.webp"].map(
            (src, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="flex-1 relative"
              >
                <img
                  src={src}
                  alt={`Confection detail ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30" />
              </motion.div>
            )
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)]" />
      </section>
    </>
  );
}
