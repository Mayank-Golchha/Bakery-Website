/**
 * CategoriesSection component.
 * Displays three product categories (Cakes, Chocolates, Cookies)
 * in premium glassmorphism cards with hover effects.
 * Appears on scroll with staggered animations.
 */

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const CATEGORIES = [
  {
    name: "Cakes",
    slug: "cakes",
    description: "Layered perfection crafted for every celebration",
    image: "/image9.webp",
  },
  {
    name: "Chocolates",
    slug: "chocolates",
    description: "Rich indulgence hand-tempered to silky smoothness",
    image: "/image15.webp",
  },
  {
    name: "Cookies",
    slug: "cookies",
    description: "Buttery bites baked with timeless tradition",
    image: "/image6.webp",
  },
];

export default function CategoriesSection() {
  return (
    <section id="categories-section" className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--accent-gold)] font-medium mb-3 block">
            Collections
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Explore Our Craft
          </h2>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base max-w-lg mx-auto">
            Three pillars of confection excellence, each a testament to our
            unwavering pursuit of flavor
          </p>
        </motion.div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
            >
              <Link
                href={`/products?category=${cat.slug}`}
                className="group block relative h-80 sm:h-96 rounded-2xl overflow-hidden"
                id={`category-${cat.slug}`}
              >
                {/* Background Image */}
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={80}
                  unoptimized={true}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/70 transition-all duration-500" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[var(--accent-gold)] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                    {cat.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-[var(--accent-gold)] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">
                    View Collection
                    <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
