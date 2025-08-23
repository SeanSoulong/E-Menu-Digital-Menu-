"use client";
import { Product } from "./data/types";
import { products } from "./data/products";
import Filters from "./components/Filters";
import ProductGrid from "./components/ProductGrid";
import ProductDetailPopup from "./components/ProductDetailPopup";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );

  useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Cleanup function to reset overflow when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPopupOpen]);

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      activeCategory === "All" || product.category === activeCategory;
    const queryMatch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && queryMatch;
  });

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setSelectedProduct(null);
    setIsPopupOpen(false);
  };

  return (
    <div className="">
      <div
        className={`flex flex-col lg:flex-row min-h-screen bg-white transition-opacity duration-300 ${
          isPopupOpen ? "opacity-20" : ""
        }`}
      >
        <Filters
          categories={categories}
          onSearch={setSearchQuery}
          onFilter={setActiveCategory}
          activeCategory={activeCategory}
        />
        <div className="flex-1 bg-white">
          <h1 className="text-[20px] font-bold p-2 lg:p-6">Product Catalog</h1>
          <ProductGrid
            products={filteredProducts}
            onProductClick={handleProductClick}
          />
        </div>
      </div>
      {isPopupOpen && (
        <ProductDetailPopup
          product={selectedProduct}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
}
