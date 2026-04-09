"use client";
import { useState, useEffect } from "react";
import { createClient } from "../lib/supabase-client";
import { Product, MenuItem, Category } from "./data/types";
import Filters from "./components/user/Filters";
import ProductGrid from "./components/user/ProductGrid";
import ProductDetailPopup from "./components/user/ProductDetailPopup";
import { useLanguage } from "./context/LanguageContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

// Inner component that uses theme
function HomePageContent() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchMenuData();

    const subscription = supabase
      .channel("menu_items_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_items" },
        () => {
          fetchMenuData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchMenuData = async () => {
    try {
      const [itemsResponse, categoriesResponse] = await Promise.all([
        supabase
          .from("menu_items")
          .select(
            `
            *,
            categories (name_en, name_kh)
          `
          )
          .order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("name_en"),
      ]);

      if (itemsResponse.error) throw itemsResponse.error;
      if (categoriesResponse.error) throw categoriesResponse.error;

      setMenuItems(itemsResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (error) {
      console.error("Error fetching menu data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = categories.map((cat) => ({
    en: cat.name_en,
    kh: cat.name_kh,
  }));

  const filteredProducts = menuItems.filter((item) => {
    const categoryMatch =
      activeCategory === "All" || item.categories?.name_en === activeCategory;

    const name = language === "en" ? item.name_en : item.name_kh;
    const description =
      language === "en" ? item.description_en : item.description_kh;

    const queryMatch =
      !searchQuery ||
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name_kh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && queryMatch;
  });

  const isNewArrival = (createdAt: string): boolean => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const convertToProduct = (item: MenuItem): Product => ({
    id: item.id,
    name: { en: item.name_en, kh: item.name_kh },
    image: item.image_url || "/images/default-food.jpg",
    images:
      item.images && item.images.length > 0
        ? item.images
        : [item.image_url || "/images/default-food.jpg"],
    category: {
      en: item.categories?.name_en || "Uncategorized",
      kh: item.categories?.name_kh || "មិនបានចាត់ថ្នាក់",
    },
    description: {
      en: item.description_en,
      kh: item.description_kh,
    },
    keywords: [],
    priceUsd: `$${item.price.toFixed(2)}`,
    priceKhr: `៛${(item.price * 4100).toLocaleString()}`,
    contact: "098253453",
    is_available: item.is_available,
    is_new_arrival: isNewArrival(item.created_at),
  });

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

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme.backgroundColor }}
      >
        <div className="text-lg" style={{ color: theme.textColorSecondary }}>
          {language === "en" ? "Loading menu..." : "កំពុងផ្ទុកមីនុយ..."}
        </div>
      </div>
    );
  }

  // Get grid columns based on products per row setting
  const getGridCols = () => {
    switch (theme.productsPerRow) {
      case "2":
        return "grid-cols-1 sm:grid-cols-2";
      case "3":
        return "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3";
      case "4":
        return "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4";
      default:
        return "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3";
    }
  };

  return (
    <div
      className="min-h-screen p-4"
      style={{
        backgroundColor: theme.backgroundColor,
        fontFamily: theme.fontFamily,
      }}
    >
      {/* Header Image */}
      {theme.headerImageUrl && (
        <div className="mb-6 rounded-2xl overflow-hidden">
          <img
            src={theme.headerImageUrl}
            alt="Header"
            className="w-full h-32 md:h-48 object-cover"
          />
        </div>
      )}

      <div
        className={`flex flex-col lg:flex-row transition-opacity ${
          isPopupOpen ? "opacity-20" : ""
        }`}
      >
        <Filters
          categories={filterCategories}
          activeCategory={activeCategory}
          onFilter={setActiveCategory}
          onSearch={setSearchQuery}
        />

        <div className="flex-1 lg:ml-6 mt-6">
          <div className="flex justify-between items-center p-4">
            <h1
              className="text-xl font-bold"
              style={{
                color: theme.textColor,
                fontFamily: theme.headingFontFamily,
              }}
            >
              {language === "en" ? "Menu" : "មីនុយ"}
            </h1>
            <div
              className="text-sm"
              style={{ color: theme.textColorSecondary }}
            >
              {language === "en"
                ? `${filteredProducts.length} items found`
                : `ទំនិញ ${filteredProducts.length} មុខ`}
            </div>
          </div>

          <ProductGrid
            products={filteredProducts.map(convertToProduct)}
            gridCols={getGridCols()}
            onProductClick={(p) => {
              const originalItem = menuItems.find((item) => item.id === p.id);
              setSelectedProduct(convertToProduct(originalItem!));
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

// Main export with ThemeProvider
export default function HomePage() {
  return (
    <ThemeProvider>
      <HomePageContent />
    </ThemeProvider>
  );
}
