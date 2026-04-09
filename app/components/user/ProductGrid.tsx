import { Product } from "../../data/types";
import ProductCard from "./ProductCard";
import { useLanguage } from "../../context/LanguageContext";

interface ProductGridProps {
  products: Product[];
  gridCols?: string;
  onProductClick: (product: Product) => void;
}

export default function ProductGrid({
  products,
  gridCols = "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3",
  onProductClick,
}: ProductGridProps) {
  const { language } = useLanguage();

  if (products.length === 0) {
    return (
      <div className="flex-1 flex justify-center items-center p-8 text-gray-500 text-[14px] flex-col">
        <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <p className="text-xl font-semibold text-gray-600 mb-2">
          {language === "en" ? "No products found" : "មិនមានផលិតផល"}
        </p>
        <p className="text-gray-500 text-center max-w-sm">
          {language === "en"
            ? "No products found for your selection. Try different filters or search terms."
            : "មិនមានផលិតផលណាមួយសម្រាប់ការជ្រើសរើសរបស់អ្នកទេ។ សាកល្បងតម្រងឬពាក្យស្វែងរកផ្សេងទៀត។"}
        </p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols} gap-4 md:gap-6`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={onProductClick}
        />
      ))}
    </div>
  );
}
