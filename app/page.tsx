"use client";
import { useState, useEffect } from "react";
import { products } from "./data/products";
import { Product } from "./data/types";
import Filters from "./components/Filters";
import ProductGrid from "./components/ProductGrid";
import ProductDetailPopup from "./components/ProductDetailPopup";
import { useLanguage } from "./context/LanguageContext";

export default function HomePage() {
  const { language } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Prevent background scrolling when popup is open
  useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPopupOpen]);

  // Deduplicate categories
  const categories = Array.from(
    new Map(products.map((p) => [p.category.en, p.category])).values()
  );

  const filteredProducts = products.filter((p) => {
    const categoryMatch =
      activeCategory === "All" || p.category.en === activeCategory;
    const queryMatch =
      !searchQuery ||
      p.name[language].toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && queryMatch;
  });

  return (
    <div className="min-h-screen bg-white p-4">
      <div
        className={`flex flex-col lg:flex-row transition-opacity ${
          isPopupOpen ? "opacity-20" : ""
        }`}
      >
        <Filters
          categories={categories}
          activeCategory={activeCategory}
          onFilter={setActiveCategory}
          onSearch={setSearchQuery}
        />

        <div className="flex-1 lg:ml-6 mt-6">
          <h1 className="text-xl font-bold mb-4">
            {language === "en" ? "Product Catalog" : "បញ្ជីផលិតផល"}
          </h1>
          <ProductGrid
            products={filteredProducts}
            onProductClick={(p) => {
              setSelectedProduct(p);
              setIsPopupOpen(true);
            }}
          />
        </div>
      </div>

      {isPopupOpen && selectedProduct && (
        <ProductDetailPopup
          product={selectedProduct}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </div>
  );
}
