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
      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer border border-gray-100 font-[Kantumruy_Pro] group"
    >
      <div className="relative overflow-hidden">
        <Image
          src={product.image}
          alt={product.name[language]}
          width={300}
          height={300}
          unoptimized
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* <div className="absolute top-3 left-3 bg-gradient-to-r from-[#3F3F3F] to-[#2F2F2F] text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
          ID: {product.id}
        </div> */}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-base text-gray-900 line-clamp-2 mb-2 group-hover:text-[#3F3F3F] transition-colors">
          {product.name[language]}
        </h3>
        <div className="flex items-center justify-between">
          <div className="text-[#F05656] font-bold text-sm">
            <div>{product.priceUsd}</div>
            <div className="text-xs text-gray-600">{product.priceKhr}</div>
          </div>
          <button className="bg-gradient-to-r from-[#3F3F3F] to-[#2F2F2F] text-white p-2 rounded-lg hover:from-[#2F2F2F] hover:to-[#1F1F1F] transition-all duration-200 transform hover:scale-110 shadow-md">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
