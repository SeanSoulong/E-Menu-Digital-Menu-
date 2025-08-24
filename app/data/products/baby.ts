import { Product } from "../types";

export const babyProducts: Product[] = [
  {
    id: "BS001",
    name: { en: "Green Tricycle", kh: "ត្រីស៊ីកលីស៊ីក្រហម" },
    image: "/images/babysupplies/product1.jpg",
    images: ["/images/babysupplies/product1.jpg"],
    category: { en: "Baby Supplies", kh: "សម្ភារៈទារក" },
    description: {
      en: "This is a toddler tricycle with a handle for adults to push. It's green and has a basket in front.",
      kh: "នេះគឺជាទ្រីស៊ីកលីស៊ីសម្រាប់កុមារ មានដៃសម្រាប់មនុស្សពេញវ័យ ហើយមានស្កតនៅខាងមុខ។",
    },
    keywords: ["tricycle", "toddler"],
    priceUsd: "$150.00",
    priceKhr: "KHR 600,000",
    contact: "012 345 678",
  },
  {
    id: "BS002",
    name: { en: "Bottle Drying Cabinet", kh: "កាប៊ីនស្ងួតដបទារក" },
    image: "/images/babysupplies/product2.jpg",
    images: ["/images/babysupplies/product2.jpg"],
    category: { en: "Baby Supplies", kh: "សម្ភារៈទារក" },
    description: {
      en: "A compact, clear, three-tier cabinet for drying and storing baby bottles and kitchen dishes.",
      kh: "កាប៊ីនតូចច្បាស់បីស្រទាប់សម្រាប់ស្ងួត និងផ្ទុកដបទារក និងចានផ្ទះបាយ។",
    },
    keywords: ["baby bottle", "drying rack"],
    priceUsd: "$150.00",
    priceKhr: "KHR 600,000",
    contact: "012 345 678",
  },
];
