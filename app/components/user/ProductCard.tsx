"use client";
import { Product } from "../../data/types";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

interface Props {
  product: Product;
  onClick: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: Props) {
  const { language } = useLanguage();
  const { theme } = useTheme();

  return (
    <div
      onClick={() => onClick(product)}
      className="rounded-lg border overflow-hidden relative w-full transition hover:shadow-md cursor-pointer"
      style={{
        backgroundColor: theme.cardBackgroundColor,
        borderRadius: `${theme.cardBorderRadius}px`,
        borderColor: `${theme.primaryColor}20`,
      }}
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
          <div
            className="absolute top-2 right-2 text-white px-2 py-1 rounded text-xs font-medium"
            style={{ backgroundColor: theme.secondaryColor }}
          >
            {language === "en" ? "Out of Stock" : "អស់ស្តុក"}
          </div>
        )}

        {product.is_available && product.is_new_arrival && (
          <div
            className="absolute top-2 left-2 text-white px-2 py-1 rounded text-xs font-medium"
            style={{ backgroundColor: theme.accentColor }}
          >
            {language === "en" ? "New" : "ថ្មី"}
          </div>
        )}
      </div>

      <div className="p-3">
        <h3
          className="font-bold text-base line-clamp-2 md:line-clamp-1 truncate mb-2 transition-colors"
          style={{
            color: !product.is_available
              ? theme.textColorSecondary
              : theme.textColor,
            fontFamily: theme.headingFontFamily,
          }}
        >
          {product.name[language]}
        </h3>

        <div className="flex items-center justify-between mt-2">
          <span
            className="text-base md:text-lg font-bold truncate max-w-[120px] md:max-w-[150px]"
            style={{
              color: !product.is_available
                ? theme.textColorSecondary
                : theme.primaryColor,
            }}
          >
            {language === "en" ? "Price" : "តម្លៃ"}: {product.priceKhr}
          </span>

          <span
            className="text-xs md:text-sm truncate max-w-[70px] md:max-w-[90px]"
            style={{ color: theme.textColorSecondary }}
          >
            {product.priceUsd}
          </span>
        </div>
      </div>
    </div>
  );
}
