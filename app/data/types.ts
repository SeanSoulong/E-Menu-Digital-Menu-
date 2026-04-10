export interface Product {
  id: string;
  name: { en: string; kh: string };
  image: string;
  images?: string[];
  category: { en: string; kh: string };
  description: { en: string; kh: string };
  keywords: string[];
  priceUsd: string;
  priceKhr: string;
  contact: string;
  is_available: boolean;
  is_new_arrival?: boolean;
  stock_quantity?: number;
}

export interface MenuItem {
  id: string;
  name_en: string;
  name_kh: string;
  description_en: string;
  description_kh: string;
  price: number;
  category_id: string;
  categories?: Category;
  image_url: string | null;
  images: string[];
  is_available: boolean;
  is_new_arrival?: boolean;
  created_at: string;
  stock_quantity: number;
}

export interface Category {
  id: string;
  name_en: string;
  name_kh: string;
  created_at: string;
}

export interface Order {
  id: number;
  item_id: string;
  item_name?: string;
  quantity: number;
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  total_price: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
  updated_at?: string;
}
