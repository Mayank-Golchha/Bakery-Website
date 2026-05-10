/**
 * Type definitions for the entire application.
 * Covers products, cart, and admin-related types.
 */

/** All Indian states for availability selection */
export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;

export type IndianState = (typeof INDIAN_STATES)[number];

/** Product category */
export type ProductCategory = "cakes" | "chocolates" | "cookies";

/** Product entity from the database */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categories: ProductCategory[];
  image_url: string;
  available: boolean;
  available_all_states: boolean;
  available_states: string[];
  created_at: string;
}

/** Cart item with product and quantity */
export interface CartItem {
  product: Product;
  quantity: number;
}

/** Order form data for the buy/checkout flow */
export interface OrderFormData {
  name: string;
  phone: string;
  address: string;
  state: string;
}

/** Admin credentials (fixed) */
export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
} as const;
