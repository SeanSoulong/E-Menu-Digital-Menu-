export interface Product {
  id: string;
  name: string;
  image: string; // main image (cover)
  images?: string[]; // gallery images (optional)
  category: string;
  description: string;
  keywords: string[];
  priceUsd: string;
  priceKhr: string;
  contact: string;
}
