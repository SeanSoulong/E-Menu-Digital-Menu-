import { Product } from "../types";

export const clothesProducts: Product[] = [
  {
    id: "cl001",
    name: { en: "Golden Victory Trophy", kh: "ពានរង្វាន់មាសឈ្នះ" },
    image: "/images/product1.jpg",
    images: ["/images/product1.jpg", "/images/product1.jpg"],
    category: { en: "Clothes", kh: "សម្លៀកបំពាក់" },
    description: {
      en: "A large golden trophy for champions.",
      kh: "ពានរង្វាន់មាសធំសម្រាប់អ្នកឈ្នះ។",
    },
    keywords: ["gold", "trophy"],
    priceUsd: "$150.00",
    priceKhr: "KHR 600,000",
    contact: "012 345 678",
  },
];
