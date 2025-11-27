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
  images: string[]; // New field for multiple images
  is_available: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name_en: string;
  name_kh: string;
  created_at: string;
}
