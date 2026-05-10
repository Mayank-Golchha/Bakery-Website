/**
 * ProductCard component.
 * Premium dark card with hover effects, image, price,
 * availability badge, and add-to-cart / buy actions.
 * Appears with scroll-triggered animation.
 */

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Minus, Plus, ShoppingBag } from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 1200);
    setQuantity(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="group relative bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden hover:border-[var(--border-accent)] transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
      id={`product-card-${product.id}`}
    >
      {/* Image */}
      <Link href={`/products/${product.id}`} className="block relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.image_url || "/image1.webp"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={80}
          unoptimized={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-block px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md ${
              product.available
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-red-500/20 text-red-300 border border-red-500/30"
            }`}
          >
            {product.available ? "In Stock" : "Sold Out"}
          </span>
        </div>

        {/* Category Tag */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {product.categories?.map(cat => (
            <span key={cat} className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/10 backdrop-blur-md text-white/80 border border-white/10">
              {cat}
            </span>
          ))}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-gold)] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-[var(--text-muted)] mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-gradient-gold">
            Rs. {product.price.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center border border-[var(--border-subtle)] rounded-lg overflow-hidden">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2 hover:bg-white/5 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            </button>
            <span className="px-4 text-sm font-medium text-[var(--text-primary)] min-w-[40px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-2 hover:bg-white/5 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={!product.available}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
              isAdding
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : product.available
                ? "bg-white/5 text-[var(--text-primary)] border border-[var(--border-accent)] hover:bg-[var(--accent-gold)]/10 hover:border-[var(--accent-gold)]/30 hover:text-[var(--accent-gold)]"
                : "bg-white/5 text-[var(--text-muted)] border border-[var(--border-subtle)] cursor-not-allowed"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {isAdding ? "Added" : "Add to Cart"}
          </button>
          <Link
            href={`/checkout?product=${product.id}`}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
              product.available
                ? "btn-primary"
                : "bg-white/5 text-[var(--text-muted)] border border-[var(--border-subtle)] cursor-not-allowed pointer-events-none"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Buy
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
