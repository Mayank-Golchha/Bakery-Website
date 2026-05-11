/**
 * Admin Dashboard component.
 * Full product management CRUD interface.
 * - List all products with search/filter
 * - Add new product with image upload
 * - Edit product details, price, description, availability
 * - Delete product
 * - State availability (all states or selected states)
 * - Image upload to Supabase storage
 */

"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Save,
  X,
  Upload,
  Package,
  Search,
  ShoppingBag,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Product, ProductCategory, INDIAN_STATES } from "@/lib/types";
import { supabase } from "@/lib/supabase";

/** Default empty product for the form */
const EMPTY_PRODUCT = {
  name: "",
  description: "",
  price: 0,
  categories: [] as ProductCategory[],
  image_url: "",
  available: true,
  available_all_states: true,
  available_states: [] as string[],
};

export default function AdminDashboard() {
  const { logout } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchProductsAndOrders = useCallback(async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
      ]);

      if (productsRes.error) throw productsRes.error;
      if (ordersRes.error) throw ordersRes.error;

      setProducts(productsRes.data || []);
      setOrders(ordersRes.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductsAndOrders();
  }, [fetchProductsAndOrders]);

  const toggleOrderStatus = async (orderId: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);
      
      if (error) throw error;
      await fetchProductsAndOrders();
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  // Open form for new product
  const handleNewProduct = () => {
    setEditingId(null);
    setForm(EMPTY_PRODUCT);
    setImageFile(null);
    setImagePreview("");
    setIsFormOpen(true);
  };

  // Open form for editing
  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      categories: product.categories || [],
      image_url: product.image_url,
      available: product.available,
      available_all_states: product.available_all_states,
      available_states: product.available_states || [],
    });
    setImageFile(null);
    setImagePreview(product.image_url);
    setIsFormOpen(true);
  };

  // Upload image to Supabase storage
  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // Save product (create or update)
  const handleSave = async () => {
    if (!form.name.trim() || !form.description.trim() || form.price <= 0) {
      return;
    }

    setSaving(true);
    try {
      let imageUrl = form.image_url;

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const productData = {
        name: form.name,
        description: form.description,
        price: form.price,
        categories: form.categories,
        image_url: imageUrl,
        available: form.available,
        available_all_states: form.available_all_states,
        available_states: form.available_all_states ? [] : form.available_states,
      };

      if (editingId) {
        // Update
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingId);

        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from("products")
          .insert([productData]);

        if (error) throw error;
      }

      setIsFormOpen(false);
      setEditingId(null);
      setForm(EMPTY_PRODUCT);
      setImageFile(null);
      setImagePreview("");
      await fetchProductsAndOrders();
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Delete product
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;
      setDeleteConfirm(null);
      await fetchProductsAndOrders();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Toggle state in available_states
  const toggleState = (stateName: string) => {
    setForm((prev) => ({
      ...prev,
      available_states: prev.available_states.includes(stateName)
        ? prev.available_states.filter((s) => s !== stateName)
        : [...prev.available_states, stateName],
    }));
  };

  // Toggle category
  const toggleCategory = (cat: ProductCategory) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  // Filtered products
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.delivery_details?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Admin Dashboard
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Manage your product catalog
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 mr-4">
              <button
                onClick={() => setActiveTab("products")}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "products" ? "bg-[var(--accent-gold)] text-black" : "text-[var(--text-secondary)] hover:text-white"
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "orders" ? "bg-[var(--accent-gold)] text-black" : "text-[var(--text-secondary)] hover:text-white"
                }`}
              >
                Orders
              </button>
            </div>
            {activeTab === "products" && (
              <button
                onClick={handleNewProduct}
                className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5"
                id="add-product-btn"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            )}
            <button
              onClick={logout}
              className="btn-secondary flex items-center gap-2 text-sm py-2.5 px-5"
              id="admin-logout-btn"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </motion.div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-dark text-sm h-10 pl-10 w-full"
              id="admin-search"
            />
          </div>
          {activeTab === "orders" && (
            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="input-dark text-sm h-10 px-4 w-full sm:w-48 cursor-pointer"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          )}
        </div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] overflow-hidden"
        >
          {loading ? (
            <div className="p-8 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 skeleton" />
              ))}
            </div>
          ) : activeTab === "products" ? (
            filteredProducts.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                <p className="text-[var(--text-secondary)]">No products found</p>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  Click "Add Product" to create your first product
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border-subtle)]">
                      <th className="text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-4 py-3">
                        Product
                      </th>
                      <th className="text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-4 py-3 hidden sm:table-cell">
                        Category
                      </th>
                      <th className="text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-4 py-3">
                        Price
                      </th>
                      <th className="text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                        Status
                      </th>
                      <th className="text-right text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-4 py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-[var(--border-subtle)] last:border-b-0 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--bg-secondary)]">
                              {product.image_url && (
                                <Image
                                  src={product.image_url}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[var(--text-primary)] truncate max-w-[200px]">
                                {product.name}
                              </p>
                              <p className="text-xs text-[var(--text-muted)] truncate max-w-[200px] sm:hidden">
                                {product.categories?.join(", ")}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-xs text-[var(--text-secondary)] capitalize">
                            {product.categories?.join(", ")}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-[var(--accent-gold)]">
                            Rs. {product.price.toLocaleString("en-IN")}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              product.available
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-red-500/10 text-red-400"
                            }`}
                          >
                            {product.available ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                              aria-label={`Edit ${product.name}`}
                            >
                              <Pencil className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(product.id)}
                              className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                              aria-label={`Delete ${product.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-[var(--text-muted)] hover:text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            filteredOrders.length === 0 ? (
              <div className="p-12 text-center">
                <ShoppingBag className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                <p className="text-[var(--text-secondary)]">No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border-subtle)]">
                      <th className="text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-4 py-3">
                        Order Info
                      </th>
                      <th className="text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-4 py-3">
                        Customer
                      </th>
                      <th className="text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-4 py-3">
                        Amount
                      </th>
                      <th className="text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-4 py-3">
                        Status
                      </th>
                      <th className="text-right text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-4 py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <React.Fragment key={order.id}>
                        <tr
                          className="border-b border-[var(--border-subtle)] hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-[var(--text-primary)]">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-[var(--text-muted)] font-mono">
                              {order.id.slice(0, 8)}...
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-[var(--text-primary)]">
                              {order.delivery_details?.name}
                            </p>
                            <p className="text-xs text-[var(--text-muted)]">
                              {order.delivery_details?.email}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium text-[var(--accent-gold)]">
                              Rs. {order.total_amount?.toLocaleString("en-IN")}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                order.status === "completed"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-amber-500/10 text-amber-400"
                              }`}
                            >
                              {order.status === "completed" ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <Clock className="w-3 h-3" />
                              )}
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button
                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                className="text-xs font-medium text-[var(--accent-gold)] hover:underline"
                              >
                                {expandedOrder === order.id ? "Hide Details" : "View Items"}
                              </button>
                              <button
                                onClick={() => toggleOrderStatus(order.id, order.status)}
                                className="text-xs font-medium text-[var(--text-secondary)] hover:text-white underline underline-offset-2"
                              >
                                Mark as {order.status === "completed" ? "Pending" : "Completed"}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedOrder === order.id && (
                          <tr className="bg-white/[0.01]">
                            <td colSpan={5} className="px-8 py-4">
                              <div className="space-y-3">
                                <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Order Items:</p>
                                {order.items?.map((item: any, i: number) => (
                                  <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                    <span className="text-[var(--text-primary)]">
                                      {item.product.name} <span className="text-[var(--text-muted)] ml-2">x{item.quantity}</span>
                                    </span>
                                    <span className="text-[var(--text-secondary)]">
                                      Rs. {(item.quantity * item.product.price).toLocaleString("en-IN")}
                                    </span>
                                  </div>
                                ))}
                                <div className="pt-2">
                                  <p className="text-xs text-[var(--text-muted)]">Delivery Address:</p>
                                  <p className="text-sm text-[var(--text-secondary)]">
                                    {order.delivery_details?.address}, {order.delivery_details?.state}
                                  </p>
                                  <p className="text-sm text-[var(--text-secondary)]">
                                    Phone: {order.delivery_details?.phone}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </motion.div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirm && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDeleteConfirm(null)}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]"
              >
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Delete Product
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6">
                  Are you sure you want to delete this product? This action
                  cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 btn-secondary py-2.5 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Product Form Modal */}
        <AnimatePresence>
          {isFormOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFormOpen(false)}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]"
                id="product-form-modal"
              >
                {/* Form Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {editingId ? "Edit Product" : "New Product"}
                  </h3>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    aria-label="Close form"
                  >
                    <X className="w-5 h-5 text-[var(--text-secondary)]" />
                  </button>
                </div>

                <div className="space-y-5">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-2">
                      Product Image
                    </label>
                    <div className="flex items-start gap-4">
                      {imagePreview && (
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--bg-card)]">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                      )}
                      <label className="flex-1 flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/30 transition-colors cursor-pointer bg-[var(--bg-card)]">
                        <Upload className="w-6 h-6 text-[var(--text-muted)] mb-2" />
                        <span className="text-xs text-[var(--text-secondary)]">
                          Click to upload image
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload-input"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="input-dark text-sm"
                      placeholder="e.g. Belgian Dark Chocolate Cake"
                      id="product-name-input"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
                      Description
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, description: e.target.value }))
                      }
                      rows={3}
                      className="input-dark text-sm resize-none"
                      placeholder="Describe the product..."
                      id="product-description-input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Price */}
                    <div>
                      <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
                        Price (Rs.)
                      </label>
                      <input
                        type="number"
                        value={form.price || ""}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            price: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="input-dark text-sm"
                        placeholder="499"
                        min="0"
                        id="product-price-input"
                      />
                    </div>

                    {/* Categories */}
                    <div className="col-span-2">
                      <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
                        Categories
                      </label>
                      <div className="flex gap-4">
                        {(["cakes", "chocolates", "cookies"] as ProductCategory[]).map((cat) => (
                          <label key={cat} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={form.categories.includes(cat)}
                              onChange={() => toggleCategory(cat)}
                              className="w-4 h-4 rounded accent-[var(--accent-gold)]"
                            />
                            <span className="text-sm text-[var(--text-primary)] capitalize">
                              {cat}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Availability Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        Product Available
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        Toggle product visibility in the store
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((f) => ({ ...f, available: !f.available }))
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        form.available ? "bg-emerald-500" : "bg-[var(--border-subtle)]"
                      }`}
                      id="product-available-toggle"
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                          form.available ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* State Availability */}
                  <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                          State Availability
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          Where this product can be delivered
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            available_all_states: !f.available_all_states,
                            available_states: [],
                          }))
                        }
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          form.available_all_states
                            ? "bg-emerald-500"
                            : "bg-[var(--border-subtle)]"
                        }`}
                        id="all-states-toggle"
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                            form.available_all_states
                              ? "translate-x-6"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {form.available_all_states ? (
                      <p className="text-xs text-emerald-400">
                        Available in all states across India
                      </p>
                    ) : (
                      <div className="max-h-48 overflow-y-auto space-y-1">
                        {INDIAN_STATES.map((stateName) => (
                          <label
                            key={stateName}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.02] cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={form.available_states.includes(
                                stateName
                              )}
                              onChange={() => toggleState(stateName)}
                              className="w-3.5 h-3.5 rounded accent-[var(--accent-gold)]"
                            />
                            <span className="text-xs text-[var(--text-secondary)]">
                              {stateName}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSave}
                    disabled={saving || !form.name.trim() || form.price <= 0}
                    className="w-full btn-primary py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    id="save-product-btn"
                  >
                    <Save className="w-4 h-4" />
                    {saving
                      ? "Saving..."
                      : editingId
                      ? "Update Product"
                      : "Create Product"}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
