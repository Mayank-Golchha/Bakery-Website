"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [user, authLoading, router]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="h-8 w-1/3 skeleton" />
          <div className="h-40 skeleton rounded-2xl" />
          <div className="h-40 skeleton rounded-2xl" />
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center bg-[var(--bg-primary)] px-4">
        <Package className="w-16 h-16 text-[var(--text-muted)] mb-4" />
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">No Orders Yet</h2>
        <p className="text-[var(--text-secondary)] mb-6 text-center max-w-sm">
          You haven't placed any orders yet. Discover our premium confections to get started.
        </p>
        <button
          onClick={() => router.push("/products")}
          className="btn-primary py-3 px-8 rounded-xl text-sm font-semibold"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-[var(--text-primary)] mb-8"
        >
          My Orders
        </motion.h1>

        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-white/5">
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Order ID: {order.id}</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col sm:items-end">
                  <p className="text-lg font-bold text-[var(--accent-gold)] mb-1">
                    Rs. {order.total_amount.toLocaleString("en-IN")}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {order.status === "completed" ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--bg-secondary)]">
                      {item.product.image_url && (
                        <Image
                          src={item.product.image_url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Qty: {item.quantity} × Rs. {item.product.price}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      Rs. {(item.quantity * item.product.price).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
