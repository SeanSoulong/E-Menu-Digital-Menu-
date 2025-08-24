export interface Product {
  id: string;
  name: { en: string; kh: string };
  image: string; // main image
  images?: string[]; // gallery images
  category: { en: string; kh: string };
  description: { en: string; kh: string };
  keywords: string[];
  priceUsd: string;
  priceKhr: string;
  contact: string;
}
