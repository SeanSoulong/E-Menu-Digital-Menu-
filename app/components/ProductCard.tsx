"use client";
import { Product } from "../data/types";
import { useLanguage } from "../context/LanguageContext";

interface Props {
  product: Product;
  onClick: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: Props) {
  const { language } = useLanguage();

  return (
    <div
      onClick={() => onClick(product)}
      className="rounded-lg border border-[#EBECF0] font-[kantumruy_Pro] bg-white overflow-hidden relative w-full transition hover:shadow-md cursor-pointer"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name[language]}
          className="w-full h-36 md:h-44 lg:h-52 object-cover"
        />
      </div>

      <div className="p-3">
        {/* Title with truncate */}
        <h3 className="font-bold text-base text-gray-900 line-clamp-2 md:line-clamp-1 truncate mb-2 transition-colors">
          {product.name[language]}
        </h3>

        <div className="flex items-center justify-between mt-2">
          {/* Price (KHR) with truncate */}
          <span className="text-green-700 text-base md:text-lg font-bold truncate max-w-[120px] md:max-w-[150px]">
            {language === "en" ? "Price" : "តម្លៃ"}: {product.priceKhr}
          </span>

          {/* Price (USD) */}
          <span className="text-gray-500 text-xs md:text-sm truncate max-w-[70px] md:max-w-[90px]">
            {product.priceUsd}
          </span>
        </div>
      </div>
    </div>
  );
}
