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
  is_available: boolean; // Add this field
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
  is_best_seller?: boolean; // Optional: for best seller badge
  is_new_arrival?: boolean; // Optional: for new arrival badge
  created_at: string;
}

export interface Category {
  id: string;
  name_en: string;
  name_kh: string;
  created_at: string;
}
