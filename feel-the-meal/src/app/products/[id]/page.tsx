/**
 * Product detail page.
 * Shows full product information including image, name, price,
 * description, availability, state availability, quantity controls,
 * add-to-cart, and buy button.
 */

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  ShoppingBag,
  Minus,
  Plus,
  MapPin,
  Check,
} from "lucide-react";
import { Product } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 1200);
    setQuantity(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square skeleton rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 skeleton" />
              <div className="h-4 w-1/3 skeleton" />
              <div className="h-4 w-full skeleton" />
              <div className="h-4 w-3/4 skeleton" />
              <div className="h-12 w-1/3 skeleton mt-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            Product not found
          </h2>
          <Link
            href="/products"
            className="text-[var(--accent-gold)] hover:underline text-sm"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--bg-card)]"
          >
            <Image
              src={product.image_url || "/image1.webp"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={90}
              priority
            />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Category */}
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--accent-gold)] font-medium mb-2">
              {product.category}
            </span>

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-3">
              {product.name}
            </h1>

            {/* Price */}
            <span className="text-2xl font-bold text-gradient-gold mb-6">
              Rs. {product.price.toLocaleString("en-IN")}
            </span>

            {/* Availability */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                  product.available
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {product.available ? (
                  <>
                    <Check className="w-3 h-3" /> In Stock
                  </>
                ) : (
                  "Sold Out"
                )}
              </span>
            </div>

            {/* Description */}
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* State Availability */}
            <div className="mb-8 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-[var(--accent-gold)]" />
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  Delivery Availability
                </span>
              </div>
              {product.available_all_states ? (
                <p className="text-xs text-emerald-400">
                  Available in all states across India
                </p>
              ) : product.available_states &&
                product.available_states.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {product.available_states.map((state) => (
                    <span
                      key={state}
                      className="px-2 py-1 rounded-md bg-white/5 text-[10px] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                    >
                      {state}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[var(--text-muted)]">
                  Availability information not specified
                </p>
              )}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-[var(--text-secondary)]">
                Quantity:
              </span>
              <div className="flex items-center border border-[var(--border-subtle)] rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 hover:bg-white/5 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4 text-[var(--text-secondary)]" />
                </button>
                <span className="px-6 text-sm font-medium text-[var(--text-primary)]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 hover:bg-white/5 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4 text-[var(--text-secondary)]" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={!product.available}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isAdding
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : product.available
                    ? "btn-secondary"
                    : "bg-white/5 text-[var(--text-muted)] border border-[var(--border-subtle)] cursor-not-allowed"
                }`}
                id="add-to-cart-btn"
              >
                <ShoppingCart className="w-4 h-4" />
                {isAdding ? "Added to Cart" : "Add to Cart"}
              </button>
              <Link
                href={`/checkout?product=${product.id}`}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  product.available
                    ? "btn-primary"
                    : "bg-white/5 text-[var(--text-muted)] border border-[var(--border-subtle)] cursor-not-allowed pointer-events-none"
                }`}
                id="buy-now-btn"
              >
                <ShoppingBag className="w-4 h-4" />
                Buy Now
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
