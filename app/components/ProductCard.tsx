"use client";
import { Product } from "../data/types";
import { useLanguage } from "../context/LanguageContext";
import Image from "next/image";

interface Props {
  product: Product;
  onClick: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: Props) {
  const { language } = useLanguage();
  return (
    <div
      onClick={() => onClick(product)}
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
    >
      <Image
        src={product.image}
        alt={product.name[language]}
        width={300}
        height={300}
        unoptimized
        className="w-full h-48 object-cover"
      />

      <div className="p-2">
        <span className="text-[12px] font-bold text-[#3F3F3F]">
          ID: {product.id}
        </span>
        <h3 className="font-bold text-[14px] truncate">
          {product.name[language]}
        </h3>
        <div className="mt-1 text-[#F05656] font-bold text-[12px]">
          {product.priceUsd} / {product.priceKhr}
        </div>
      </div>
    </div>
  );
}
