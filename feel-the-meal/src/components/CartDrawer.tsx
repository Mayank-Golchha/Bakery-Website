/**
 * CartDrawer component.
 * Slide-in drawer from the right showing cart items,
 * quantity controls, remove functionality, and totals.
 * Includes a "Buy" button linking to checkout.
 */

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-50 cart-overlay"
            id="cart-overlay"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[var(--bg-secondary)] border-l border-white/5 flex flex-col"
            id="cart-drawer"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Your Cart ({totalItems})
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-white/5 transition-colors"
                aria-label="Close cart"
                id="close-cart-btn"
              >
                <X className="w-5 h-5 text-[var(--text-secondary)]" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-12 h-12 text-[var(--text-muted)] mb-4" />
                  <p className="text-[var(--text-secondary)] mb-2">
                    Your cart is empty
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    Discover our premium collection
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="flex gap-4 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]"
                  >
                    {/* Product Image */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image_url || "/image1.webp"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized={true}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-[var(--accent-gold)] mt-0.5">
                        Rs. {item.product.price.toLocaleString("en-IN")}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="p-1 rounded-md hover:bg-white/5 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3 text-[var(--text-secondary)]" />
                        </button>
                        <span className="text-xs font-medium text-[var(--text-primary)] min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="p-1 rounded-md hover:bg-white/5 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3 text-[var(--text-secondary)]" />
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 rounded-md hover:bg-red-500/10 transition-colors group"
                        aria-label="Remove from cart"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-red-400" />
                      </button>
                      <span className="text-sm font-semibold text-[var(--text-primary)]">
                        Rs.{" "}
                        {(item.product.price * item.quantity).toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">
                    Total
                  </span>
                  <span className="text-xl font-bold text-gradient-gold">
                    Rs. {totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full text-center btn-primary py-3 rounded-xl text-sm"
                  id="cart-checkout-btn"
                >
                  Proceed to Buy
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
