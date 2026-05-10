/**
 * FeaturedProducts component.
 * Fetches and displays featured products from Supabase.
 * Falls back to seed data if no products exist yet.
 * Products appear on scroll with staggered animations.
 */

"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";

const DUMMY_PRODUCTS: Product[] = [
  {
    id: "dummy-1",
    name: "Dark Chocolate Truffle",
    description: "Rich dark chocolate with a velvet truffle center. Handcrafted with passion.",
    price: 1299,
    categories: ["chocolates"],
    image_url: "/image6.webp",
    available: true,
    available_all_states: true,
    available_states: [],
    created_at: new Date().toISOString()
  },
  {
    id: "dummy-2",
    name: "Raspberry Cream Cake",
    description: "Light sponge layered with fresh raspberry compote and sweet cream.",
    price: 2499,
    categories: ["cakes"],
    image_url: "/image2.webp",
    available: true,
    available_all_states: true,
    available_states: [],
    created_at: new Date().toISOString()
  },
  {
    id: "dummy-3",
    name: "Almond Butter Cookies",
    description: "Crisp, buttery cookies studded with carefully roasted almonds.",
    price: 899,
    categories: ["cookies"],
    image_url: "/image10.webp",
    available: true,
    available_all_states: true,
    available_states: [],
    created_at: new Date().toISOString()
  }
];

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatured();
  }, []);

  async function fetchFeatured() {
    try {
      // Add timeout to fail fast if Supabase is placeholder or slow
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("available", true)
        .order("created_at", { ascending: false })
        .limit(6)
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (error) throw error;
      setProducts(data && data.length > 0 ? data : DUMMY_PRODUCTS);
    } catch {
      // If Supabase is not set up yet or times out, show dummy state
      setProducts(DUMMY_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="featured-section"
      className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)]"
    >
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
            Featured
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Signature Creations
          </h2>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base max-w-lg mx-auto">
            Handpicked selections from our most celebrated artisans
          </p>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-[var(--text-secondary)] mb-2">
              No products available yet
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              Products will appear here once the admin adds them via the dashboard
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
