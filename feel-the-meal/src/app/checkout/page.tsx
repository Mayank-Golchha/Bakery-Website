/**
 * Checkout page.
 * Displays cart items / single product buy flow.
 * Collects user name, phone, and state (dropdown).
 * Validates state availability for each product and shows
 * unavailable items before allowing payment.
 */

"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  AlertTriangle,
  MapPin,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { Product, INDIAN_STATES, CartItem } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const singleProductId = searchParams.get("product");

  const { items: cartItems, updateQuantity, removeFromCart, totalPrice } =
    useCart();

  const [singleProduct, setSingleProduct] = useState<Product | null>(null);
  const [singleQuantity, setSingleQuantity] = useState(1);
  const [loading, setLoading] = useState(!!singleProductId);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [unavailableProducts, setUnavailableProducts] = useState<string[]>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // Fetch single product if buying directly
  useEffect(() => {
    async function fetchSingle() {
      if (!singleProductId) return;
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", singleProductId)
          .single();

        if (error) throw error;
        setSingleProduct(data);
      } catch {
        setSingleProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchSingle();
  }, [singleProductId]);

  // Determine which items to show
  const checkoutItems: CartItem[] = singleProduct
    ? [{ product: singleProduct, quantity: singleQuantity }]
    : cartItems;

  const checkoutTotal = singleProduct
    ? singleProduct.price * singleQuantity
    : totalPrice;

  // Validate state availability
  const handleValidateAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim() || !state) return;

    // Check which products are NOT available in the selected state
    const notAvailable = checkoutItems
      .filter((item) => {
        if (item.product.available_all_states) return false;
        if (!item.product.available_states || item.product.available_states.length === 0) return false;
        return !item.product.available_states.includes(state);
      })
      .map((item) => item.product.name);

    setUnavailableProducts(notAvailable);

    if (notAvailable.length > 0) return;

    // Proceed to payment
    handlePayment();
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // 1. Create order
      const createRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: checkoutTotal }),
      });
      
      const { order } = await createRes.json();
      if (!order) throw new Error("Failed to create order");

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: order.amount,
        currency: order.currency,
        name: "Feel The Meal",
        description: "Premium Confections Order",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // 3. Verify Payment & Send Email
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderDetails: {
                  name,
                  email,
                  phone,
                  address,
                  state,
                  items: checkoutItems,
                  totalPaid: checkoutTotal,
                  orderDate: new Date().toISOString(),
                },
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              alert("Payment successful! Your order has been placed.");
              if (!singleProduct) {
                // Clear cart if it was a cart checkout
                cartItems.forEach(item => removeFromCart(item.product.id));
              }
              router.push("/products");
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error(error);
            alert("Error processing payment verification.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: name,
          contact: phone,
        },
        theme: {
          color: "#c9a96e",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setIsProcessing(false);
        alert(response.error.description);
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-8 w-1/3 skeleton" />
          <div className="h-40 skeleton rounded-2xl" />
          <div className="h-40 skeleton rounded-2xl" />
        </div>
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            No items to checkout
          </h2>
          <Link
            href="/products"
            className="text-[var(--accent-gold)] hover:underline text-sm"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-[var(--text-primary)] mb-8"
        >
          Checkout
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 space-y-4"
          >
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Order Summary
            </h2>

            {checkoutItems.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]"
              >
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.product.image_url || "/image1.webp"}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-xs text-[var(--accent-gold)] mt-0.5">
                    Rs. {item.product.price.toLocaleString("en-IN")}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    {singleProduct ? (
                      <>
                        <button
                          onClick={() =>
                            setSingleQuantity((q) => Math.max(1, q - 1))
                          }
                          className="p-1 rounded-md hover:bg-white/5 transition-colors"
                        >
                          <Minus className="w-3 h-3 text-[var(--text-secondary)]" />
                        </button>
                        <span className="text-xs font-medium text-[var(--text-primary)] min-w-[20px] text-center">
                          {singleQuantity}
                        </span>
                        <button
                          onClick={() => setSingleQuantity((q) => q + 1)}
                          className="p-1 rounded-md hover:bg-white/5 transition-colors"
                        >
                          <Plus className="w-3 h-3 text-[var(--text-secondary)]" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="p-1 rounded-md hover:bg-white/5 transition-colors"
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
                        >
                          <Plus className="w-3 h-3 text-[var(--text-secondary)]" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="ml-2 p-1 rounded-md hover:bg-red-500/10 transition-colors group"
                        >
                          <Trash2 className="w-3 h-3 text-[var(--text-muted)] group-hover:text-red-400" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    Rs.{" "}
                    {(item.product.price * item.quantity).toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-accent)]">
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                Total Amount
              </span>
              <span className="text-xl font-bold text-gradient-gold">
                Rs. {checkoutTotal.toLocaleString("en-IN")}
              </span>
            </div>
          </motion.div>

          {/* Delivery Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Delivery Details
            </h2>

            <form
              onSubmit={handleValidateAndProceed}
              className="space-y-4 p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]"
              id="checkout-form"
            >
              {/* Name */}
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-dark text-sm"
                  placeholder="Your full name"
                  id="checkout-name"
                />
                {formSubmitted && !name.trim() && (
                  <p className="text-xs text-red-400 mt-1">Name is required</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-dark text-sm"
                  placeholder="your.email@example.com"
                  id="checkout-email"
                />
                {formSubmitted && !email.trim() && (
                  <p className="text-xs text-red-400 mt-1">Email is required</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-dark text-sm"
                  placeholder="10-digit phone number"
                  id="checkout-phone"
                />
                {formSubmitted && !phone.trim() && (
                  <p className="text-xs text-red-400 mt-1">
                    Phone number is required
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
                  Delivery Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="input-dark text-sm resize-none"
                  placeholder="Street, House/Flat No, Landmark"
                  id="checkout-address"
                />
                {formSubmitted && !address.trim() && (
                  <p className="text-xs text-red-400 mt-1">
                    Address is required
                  </p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
                  <MapPin className="w-3 h-3 inline mr-1" />
                  Delivery State
                </label>
                <select
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setUnavailableProducts([]);
                  }}
                  className="input-dark text-sm"
                  id="checkout-state"
                >
                  <option value="">Select your state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {formSubmitted && !state && (
                  <p className="text-xs text-red-400 mt-1">
                    Please select a state
                  </p>
                )}
              </div>

              {/* Unavailable products warning */}
              {unavailableProducts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-sm font-medium text-red-400">
                      Unavailable in {state}
                    </span>
                  </div>
                  <p className="text-xs text-red-300/80">
                    The following products are not available in your region:{" "}
                    <strong>{unavailableProducts.join(", ")}</strong>
                  </p>
                </motion.div>
              )}

              {/* Pay Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full btn-primary py-3.5 rounded-xl text-sm font-semibold mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                id="checkout-pay-btn"
              >
                {isProcessing ? "Processing..." : unavailableProducts.length > 0 ? "Check Again" : `Pay Rs. ${checkoutTotal.toLocaleString("en-IN")}`}
              </button>

              {unavailableProducts.length === 0 &&
                formSubmitted &&
                name.trim() &&
                email.trim() &&
                phone.trim() &&
                address.trim() &&
                state && (
                  <p className="text-xs text-emerald-400 text-center mt-2">
                    All items are available in {state}. Secure payment powered by Razorpay.
                  </p>
                )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="h-8 w-1/3 skeleton" />
            <div className="h-40 skeleton rounded-2xl" />
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
