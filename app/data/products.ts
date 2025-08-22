export interface Product {
  id: number;
  name: string;
  image: string;
  category: string;
  description: string;
  keywords: string[];
  priceUsd: string;
  priceKhr: string;
  contact: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Golden Victory Trophy",
    image: "/images/product1.jpg",
    category: "Trophy",
    description:
      "A large, golden trophy for champions. Perfect for sports and competitions.",
    keywords: ["gold", "trophy", "victory", "sports"],
    priceUsd: "$150.00",
    priceKhr: "KHR 600,000",
    contact: "012 345 678",
  },
  {
    id: 2,
    name: "Classic Silver Cup",
    image: "/images/product2.jpg",
    category: "Trophy",
    description: "Elegant silver cup, ideal for academic and corporate awards.",
    keywords: ["silver", "trophy", "cup", "award"],
    priceUsd: "$120.00",
    priceKhr: "KHR 480,000",
    contact: "012 345 678",
  },
  {
    id: 3,
    name: "Bronze Medal Trophy",
    image: "/images/product3.jpg",
    category: "Trophy",
    description: "A classic bronze trophy to recognize third-place winners.",
    keywords: ["bronze", "medal", "trophy", "award"],
    priceUsd: "$95.00",
    priceKhr: "KHR 380,000",
    contact: "012 345 678",
  },
  {
    id: 4,
    name: "Star Acrylic Plaque",
    image: "/images/product4.jpg",
    category: "Acrylic",
    description:
      "Modern acrylic plaque with a star design for special recognition.",
    keywords: ["star", "plaque", "acrylic", "award"],
    priceUsd: "$45.00",
    priceKhr: "KHR 180,000",
    contact: "012 345 678",
  },
  {
    id: 5,
    name: "Clear Acrylic Award",
    image: "/images/product5.jpg",
    category: "Acrylic",
    description: "Simple and clear acrylic award, customizable for any event.",
    keywords: ["clear", "acrylic", "award", "simple"],
    priceUsd: "$30.00",
    priceKhr: "KHR 120,000",
    contact: "012 345 678",
  },
  {
    id: 6,
    name: "Engraved Crystal Figure",
    image: "/images/product6.jpg",
    category: "Crystal",
    description:
      "Exquisite crystal figure with detailed engraving. A timeless piece.",
    keywords: ["crystal", "engraved", "figure", "glass"],
    priceUsd: "$250.00",
    priceKhr: "KHR 1,000,000",
    contact: "012 345 678",
  },
  {
    id: 7,
    name: "Crystal Recognition Plaque",
    image: "/images/product7.jpg",
    category: "Crystal",
    description:
      "A beautiful, multifaceted crystal plaque for corporate honors.",
    keywords: ["crystal", "plaque", "recognition", "award"],
    priceUsd: "$200.00",
    priceKhr: "KHR 800,000",
    contact: "012 345 678",
  },
  {
    id: 8,
    name: "Athlete Figure Trophy",
    image: "/images/product8.jpg",
    category: "Figure",
    description:
      "A detailed figurine of an athlete, celebrating excellence in sports.",
    keywords: ["figure", "athlete", "sports", "trophy"],
    priceUsd: "$75.00",
    priceKhr: "KHR 300,000",
    contact: "012 345 678",
  },
  {
    id: 9,
    name: "Musical Figure Award",
    image: "/images/product9.jpg",
    category: "Figure",
    description:
      "A musician figurine award, perfect for music competitions and recitals.",
    keywords: ["figure", "music", "award", "musician"],
    priceUsd: "$60.00",
    priceKhr: "KHR 240,000",
    contact: "012 345 678",
  },
];
