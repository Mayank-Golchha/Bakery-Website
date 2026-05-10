/**
 * Products listing page.
 * Fetches all products from Supabase with optional category and search filters.
 * Displays products in a responsive grid with scroll animations.
 */

"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import { Product, ProductCategory } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";

const CATEGORY_OPTIONS: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "All Products" },
  { value: "cakes", label: "Cakes" },
  { value: "chocolates", label: "Chocolates" },
  { value: "cookies", label: "Cookies" },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") as ProductCategory | null;
  const searchParam = searchParams.get("search") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<
    ProductCategory | "all"
  >(categoryParam || "all");
  const [searchQuery, setSearchQuery] = useState(searchParam);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      let query = supabase.from("products").select("*").order("created_at", { ascending: false }).abortSignal(controller.signal);

      if (activeCategory !== "all") {
        query = query.contains("categories", [activeCategory]);
      }

      if (searchQuery.trim()) {
        query = query.ilike("name", `%${searchQuery.trim()}%`);
      }

      const { data, error } = await query;
      clearTimeout(timeoutId);
      
      if (error) throw error;
      setProducts(data || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Sync URL params with state
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParam]);

  return (
    <div className="min-h-screen pt-24 lg:pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-3">
            {activeCategory === "all"
              ? "All Products"
              : activeCategory.charAt(0).toUpperCase() +
                activeCategory.slice(1)}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base">
            Explore our curated collection of premium confections
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10"
        >
          {/* Category Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-[var(--text-muted)]" />
            {CATEGORY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setActiveCategory(opt.value)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                  activeCategory === opt.value
                    ? "bg-[var(--accent-gold)] text-black"
                    : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--border-accent)]"
                }`}
                id={`filter-${opt.value}`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64 sm:ml-auto">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-dark text-sm h-10 w-full pr-8"
              id="products-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/5"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
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
            <p className="text-[var(--text-secondary)] text-lg mb-2">
              No products found
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              {searchQuery
                ? "Try a different search term"
                : "Products will appear once the admin adds them"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-24 lg:pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
