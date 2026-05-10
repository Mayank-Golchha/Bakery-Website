/**
 * HeroSection component.
 * Cinematic hero inspired by Google Flow website.
 * Features animated floating image tiles in a grid pattern,
 * large glowing brand title, and a scroll indicator.
 * Uses the 16 local images as animated background tiles.
 */

"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

/** Image paths for the hero grid tiles */
const HERO_IMAGES = Array.from({ length: 16 }, (_, i) => `/image${i + 1}.webp`);

/** Arrange images into columns for the vertical-scrolling grid */
const COLUMNS = [
  HERO_IMAGES.slice(0, 4),   // Column 1
  HERO_IMAGES.slice(4, 8),   // Column 2
  HERO_IMAGES.slice(8, 12),  // Column 3
  HERO_IMAGES.slice(12, 16), // Column 4
];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section
      ref={containerRef}
      id="hero-section"
      className="relative h-[100vh] min-h-[600px] overflow-hidden bg-[#050505]"
    >
      {/* Animated Image Grid Background */}
      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="absolute inset-0"
      >
        {/* Dark gradient overlays for readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/60 to-[#050505]" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

        {/* Image Grid - Columns that float up and down */}
        <div className="absolute inset-0 flex gap-3 px-2 sm:px-4 -top-[20%] bottom-[-20%]">
          {COLUMNS.map((column, colIdx) => (
            <div
              key={colIdx}
              className={`flex-1 flex flex-col gap-3 ${
                colIdx % 2 === 0 ? "animate-float-up" : "animate-float-down"
              }`}
              style={{
                animationDuration: `${35 + colIdx * 5}s`,
                animationDelay: `${colIdx * -2}s`,
              }}
            >
              {/* Duplicate images for seamless loop */}
              {[...column, ...column].map((src, imgIdx) => (
                <div
                  key={`${colIdx}-${imgIdx}`}
                  className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden flex-shrink-0 image-tile"
                >
                  <img
                    src={src}
                    alt={`Artisan confection showcase ${colIdx * 4 + (imgIdx % 4) + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Subtle overlay on each tile */}
                  <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-all duration-500" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Center Content Overlay */}
      <motion.div
        style={{ y: titleY }}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4"
      >
        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="text-5xl sm:text-7xl lg:text-9xl font-bold tracking-tighter text-white glow-text mb-4"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Feel The Meal
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          className="text-base sm:text-lg lg:text-xl text-white/70 max-w-xl mb-10 font-light tracking-wide"
        >
          Where artisan confections meet sensory perfection
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-300"
            id="hero-cta-btn"
          >
            Explore Collection
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-white/40 uppercase tracking-widest font-light">
          Scroll to Explore
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
