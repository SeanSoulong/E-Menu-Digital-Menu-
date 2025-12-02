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
      onClick={() => product.is_available && onClick(product)}
      className={`rounded-lg border border-[#EBECF0] font-[kantumruy_Pro] bg-white overflow-hidden relative w-full transition hover:shadow-md ${
        product.is_available
          ? "cursor-pointer hover:shadow-lg"
          : "cursor-default opacity-80"
      }`}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name[language]}
          width={300}
          height={200}
          className="w-full h-36 md:h-44 lg:h-52 object-cover"
        />

        {!product.is_available && (
          <div className="absolute top-2 right-2 bg-green-700 text-white px-2 py-1 rounded text-xs font-medium">
            {language === "en" ? "Out of Stock" : "អស់ស្តុក"}
          </div>
        )}
      </div>

      <div className="p-3">
        <h3
          className={`font-bold text-base text-gray-900 line-clamp-2 md:line-clamp-1 truncate mb-2 transition-colors ${
            !product.is_available ? "text-gray-500" : ""
          }`}
        >
          {product.name[language]}
        </h3>

        <div className="flex items-center justify-between mt-2">
          {/* Price (KHR) with truncate */}
          <span
            className={`text-base md:text-lg font-bold truncate max-w-[120px] md:max-w-[150px] ${
              !product.is_available
                ? "text-gray-500 line-through"
                : "text-green-700"
            }`}
          >
            {language === "en" ? "Price" : "តម្លៃ"}: {product.priceKhr}
          </span>

          {/* Price (USD) */}
          <span
            className={`text-xs md:text-sm truncate max-w-[70px] md:max-w-[90px] ${
              !product.is_available
                ? "text-gray-400 line-through"
                : "text-gray-500"
            }`}
          >
            {product.priceUsd}
          </span>
        </div>
      </div>
    </div>
  );
}
