/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "../../../lib/supabase-client";
import { MenuItem, Category } from "../../data/types";
import AdminMenuItemForm from "./AdminMenuItemForm";
import CategoryManager from "./CategoryManager";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import ThemeDesigner from "../util/ThemeDesigner";
import DashboardHeader from "./DashboardHeader";
import MenuItemsList from "./MenuItemsList";
import ImagePreviewModal from "./ImagePreviewModal";
import OrdersManager from "./OrdersManager";
import { useScreenSize } from "../hooks/useScreenSize";
import { useImagePreview } from "../hooks/useImagePreview";
import { useMenuFilters } from "../hooks/useMenuFilters";

export default function AdminDashboard() {
  const { language } = useLanguage();
  const { user, signOut } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showThemeDesigner, setShowThemeDesigner] = useState(false);
  const [activeTab, setActiveTab] = useState<"menu" | "orders">("menu");
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const screenSize = useScreenSize();

  // Image preview
  const {
    previewImage,
    previewImagesList,
    currentImageIndex,
    openImagePreview,
    closeImagePreview,
    nextImage,
    prevImage,
  } = useImagePreview();

  // Filters and pagination
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    statusFilter,
    setStatusFilter,
    sortBy,
    sortOrder,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    currentItems,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    clearAllFilters,
    handleSort,
  } = useMenuFilters(menuItems, categories, language, screenSize);

  const formRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Fetch pending orders count
  const fetchPendingOrdersCount = async () => {
    try {
      const response = await fetch("/api/orders?status=pending&limit=1");
      const data = await response.json();
      setPendingOrdersCount(data.count || 0);
    } catch (error) {
      console.error("Error fetching orders count:", error);
    }
  };

  const fetchData = useCallback(async () => {
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
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
    fetchPendingOrdersCount();

    const subscription = supabase
      .channel("admin_menu_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_items" },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchData, supabase]);

  // Auto-scroll to form when editing an item on mobile/tablet
  useEffect(() => {
    if (editingItem && screenSize !== "desktop") {
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  }, [editingItem, screenSize]);

  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item);
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        language === "en"
          ? "Are you sure you want to delete this item?"
          : "តើអ្នកពិតជាចង់លុបធាតុនេះមែនទេ?"
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase.from("menu_items").delete().eq("id", id);
      if (error) throw error;
      setMenuItems(menuItems.filter((item) => item.id !== id));
      alert(
        language === "en" ? "Item deleted successfully!" : "លុបធាតុដោយជោគជ័យ!"
      );
    } catch (error) {
      console.error("Error deleting item:", error);
      alert(language === "en" ? "Error deleting item" : "កំហុសក្នុងការលុបធាតុ");
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const { error } = await supabase
        .from("menu_items")
        .update({ is_available: !item.is_available })
        .eq("id", item.id);

      if (error) throw error;

      setMenuItems(
        menuItems.map((i) =>
          i.id === item.id ? { ...i, is_available: !i.is_available } : i
        )
      );
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleOrderPlaced = () => {
    fetchData();
    fetchPendingOrdersCount();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center font-[Kantumruy_Pro]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3F3F3F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">
            {language === "en" ? "Loading..." : "កំពុងផ្ទុក..."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 font-[Kantumruy_Pro]">
      <div className="w-full">
        <DashboardHeader
          user={user}
          onSignOut={handleSignOut}
          onToggleThemeDesigner={() => setShowThemeDesigner(!showThemeDesigner)}
          showThemeDesigner={showThemeDesigner}
        />

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("menu")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === "menu"
                ? "bg-[#0E4123] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {language === "en" ? "📦 Menu Items" : "📦 មីនុយ"}
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors relative ${
              activeTab === "orders"
                ? "bg-[#0E4123] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {language === "en" ? "📋 Orders" : "📋 ការបញ្ជាទិញ"}
            {pendingOrdersCount > 0 && activeTab !== "orders" && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs rounded-full bg-red-500 text-white animate-pulse">
                {pendingOrdersCount}
              </span>
            )}
          </button>
        </div>

        {showThemeDesigner && (
          <div className="mb-6 md:mb-8">
            <ThemeDesigner />
          </div>
        )}

        {activeTab === "menu" ? (
          <>
            <div className="mb-6 md:mb-8">
              <CategoryManager categories={categories} onUpdate={fetchData} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6">
              <div ref={formRef} className="xl:col-span-1">
                <AdminMenuItemForm
                  categories={categories}
                  editingItem={editingItem}
                  onSave={() => {
                    setEditingItem(null);
                    fetchData();
                    if (screenSize !== "desktop") {
                      setTimeout(() => {
                        document
                          .getElementById("items-container")
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                      }, 300);
                    }
                  }}
                  onCancel={() => {
                    setEditingItem(null);
                    if (screenSize !== "desktop") {
                      setTimeout(() => {
                        document
                          .getElementById("items-container")
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                      }, 100);
                    }
                  }}
                />
              </div>

              <div className="xl:col-span-3">
                <MenuItemsList
                  menuItems={currentItems}
                  categories={categories}
                  editingItem={editingItem}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  screenSize={screenSize}
                  onEdit={handleEditClick}
                  onDelete={handleDelete}
                  onToggleAvailability={handleToggleAvailability}
                  onSort={handleSort}
                  onClearFilters={clearAllFilters}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={(value) => {
                    setItemsPerPage(value);
                    setCurrentPage(1);
                  }}
                  onOpenImagePreview={openImagePreview}
                />
              </div>
            </div>
          </>
        ) : (
          <OrdersManager />
        )}
      </div>

      <ImagePreviewModal
        isOpen={!!previewImage}
        imageUrl={previewImage || ""}
        imagesList={previewImagesList}
        currentIndex={currentImageIndex}
        onClose={closeImagePreview}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </div>
  );
}
