import { Product } from "../types";

export const foodProducts: Product[] = [
  {
    id: "fd001",
    name: "Golden Victory Trophy",
    image: "/images/product1.jpg",
    images: [
      "/images/product1.jpg",
      "/images/product1.jpg",
      "/images/product1.jpg",
    ],
    category: "Food",
    description:
      "A large, golden trophy for champions. Perfect for sports and competitions.",
    keywords: ["gold", "trophy", "victory", "sports"],
    priceUsd: "$150.00",
    priceKhr: "KHR 600,000",
    contact: "012 345 678",
  },
];
