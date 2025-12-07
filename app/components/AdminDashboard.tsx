"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "../../lib/supabase-client";
import { MenuItem, Category } from "../data/types";
import AdminMenuItemForm from "./AdminMenuItemForm";
import CategoryManager from "./CategoryManager";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

export default function AdminDashboard() {
  const { language } = useLanguage();
  const { user, signOut } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );
  // Add these state variables with the other states at the top of the component
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [itemsPerPageDropdownOpen, setItemsPerPageDropdownOpen] =
    useState(false);

  // Create refs for scrolling
  const formRef = useRef<HTMLDivElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);

  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close category dropdown if clicked outside
      if (
        !(event.target as HTMLElement).closest(".category-dropdown-container")
      ) {
        setCategoryDropdownOpen(false);
      }
      // Close status dropdown if clicked outside
      if (
        !(event.target as HTMLElement).closest(".status-dropdown-container")
      ) {
        setStatusDropdownOpen(false);
      }
      // Close items per page dropdown if clicked outside
      if (
        !(event.target as HTMLElement).closest(
          ".items-per-page-dropdown-container"
        )
      ) {
        setItemsPerPageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "available" | "unavailable"
  >("all");
  const [sortBy, setSortBy] = useState<"name" | "price" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const supabase = createClient();

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
    // Check screen size on mount and resize
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize("mobile");
        setItemsPerPage(5); // Fewer items on mobile
      } else if (width >= 768 && width < 1024) {
        setScreenSize("tablet");
        setItemsPerPage(8); // Medium items on tablet
      } else {
        setScreenSize("desktop");
        setItemsPerPage(10); // More items on desktop
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    fetchData();

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
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [fetchData, supabase]);

  // Auto-scroll to form when editing an item on mobile/tablet
  useEffect(() => {
    if (editingItem && (screenSize === "mobile" || screenSize === "desktop")) {
      // Small delay to ensure the form is rendered
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

  const handleEditClick = (item: MenuItem, event?: React.MouseEvent) => {
    setEditingItem(item);

    // For mobile/tablet, store the button ref if available
    if (event && event.currentTarget) {
      editButtonRef.current = event.currentTarget as HTMLButtonElement;
    }
  };

  // Filter and sort items
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name_kh.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description_kh?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || item.category_id === selectedCategory;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "available" && item.is_available) ||
      (statusFilter === "unavailable" && !item.is_available);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    let aValue: string | number | Date;
    let bValue: string | number | Date;

    switch (sortBy) {
      case "name":
        aValue = language === "en" ? a.name_en : a.name_kh;
        bValue = language === "en" ? b.name_en : b.name_kh;
        break;
      case "price":
        aValue = a.price;
        bValue = b.price;
        break;
      case "date":
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
        break;
      default:
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
    }

    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Pagination logic
  const totalItems = sortedItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedItems.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, statusFilter, sortBy, sortOrder]);

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

  const handleSort = (field: "name" | "price" | "date") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setStatusFilter("all");
    setSortBy("date");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  // Pagination controls
  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of the items list
    const itemsContainer = document.getElementById("items-container");
    if (itemsContainer) {
      itemsContainer.scrollIntoView({ behavior: "smooth" });
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center font-[Kantumruy_Pro]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#70A2EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">
            {language === "en" ? "Loading..." : "កំពុងផ្ទុក..."}
          </div>
        </div>
      </div>
    );
  }

  // Helper function to get category name
  const getCategoryName = (categoryId: string) => {
    if (categoryId === "all") {
      return language === "en" ? "All Categories" : "ប្រភេទទាំងអស់";
    }
    const category = categories.find((cat) => cat.id === categoryId);
    return category
      ? language === "en"
        ? category.name_en
        : category.name_kh
      : language === "en"
      ? "All Categories"
      : "ប្រភេទទាំងអស់";
  };

  // Helper function to get status name
  const getStatusName = (status: string) => {
    switch (status) {
      case "all":
        return language === "en" ? "All Status" : "ស្ថានភាពទាំងអស់";
      case "available":
        return language === "en" ? "InStock" : "មានក្នុងស្តុក";
      case "unavailable":
        return language === "en" ? "OutStock" : "អស់ស្តុក";
      default:
        return language === "en" ? "All Status" : "ស្ថានភាពទាំងអស់";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 font-[Kantumruy_Pro]">
      <div className="w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Main Dashboard Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-8 p-4 md:p-6 bg-[#E5E7EB] rounded-2xl shadow-lg border border-gray-100">
          <div className="mb-4 lg:mb-0">
            <div className="flex items-center gap-3 mb-2">
              <img
                src="/logo.svg"
                alt="logo"
                className="w-12 h-12  rounded-xl"
              />
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                  {language === "en" ? "Admin Panel" : "ផ្ទាំងគ្រប់គ្រង"}
                </h1>
                <p className="text-gray-600 mt-1 flex items-center gap-2 text-sm md:text-base">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {language === "en" ? "Logged in as:" : "ចូលជា:"} {user?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 bg-white text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:shadow-md font-medium text-sm md:text-base"
            >
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
              {language === "en" ? "View Menu" : "មើលមីនុយ"}
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 border border-red-500 bg-red-50 text-gray-700 px-3 py-2 rounded-xl font-medium text-sm md:text-base"
            >
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              {language === "en" ? "Sign Out" : "ចាកចេញ"}
            </button>
          </div>
        </div>

        {/* Category Management */}
        <div className="mb-6 md:mb-8">
          <CategoryManager categories={categories} onUpdate={fetchData} />
        </div>

        {/* Main Content Grid - ALWAYS show both form and list */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6">
          {/* Form Section - ALWAYS VISIBLE */}
          <div ref={formRef} className="xl:col-span-1">
            <AdminMenuItemForm
              categories={categories}
              editingItem={editingItem}
              onSave={() => {
                setEditingItem(null);
                fetchData();
                // Scroll back to items list on save (mobile/tablet only)
                if (screenSize !== "desktop") {
                  setTimeout(() => {
                    const itemsContainer =
                      document.getElementById("items-container");
                    if (itemsContainer) {
                      itemsContainer.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }, 300);
                }
              }}
              onCancel={() => {
                setEditingItem(null);
                // Scroll back to items list on cancel (mobile/tablet only)
                if (screenSize !== "desktop") {
                  setTimeout(() => {
                    const itemsContainer =
                      document.getElementById("items-container");
                    if (itemsContainer) {
                      itemsContainer.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }, 100);
                }
              }}
            />
          </div>

          {/* Items List - ALWAYS VISIBLE */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              {/* Enhanced Header with Search & Filters */}
              <div className="px-4 md:px-6 py-4 md:py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-0">
                    {language === "en" ? "Menu Items" : "ធាតុមីនុយ"}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="bg-[#70A2EB]  text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                      {filteredItems.length}/{menuItems.length}{" "}
                      {language === "en" ? "items" : "ធាតុ"}
                    </span>
                    {editingItem && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-blue-600 font-semibold hidden sm:inline">
                          {language === "en" ? "Editing:" : "កំពុងកែសម្រួល:"}
                        </span>
                        <span className="text-sm font-medium text-gray-700 truncate max-w-[120px] sm:max-w-[200px]">
                          {language === "en"
                            ? editingItem.name_en
                            : editingItem.name_kh}
                        </span>
                        <button
                          onClick={() => {
                            setEditingItem(null);
                            // Scroll back to items list on cancel (mobile/tablet only)
                            if (screenSize !== "desktop") {
                              setTimeout(() => {
                                const itemsContainer =
                                  document.getElementById("items-container");
                                if (itemsContainer) {
                                  itemsContainer.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                  });
                                }
                              }, 100);
                            }
                          }}
                          className="text-sm text-gray-600 hover:text-gray-800 transition-colors bg-gray-100 px-2 py-1 rounded-lg"
                        >
                          {language === "en" ? "Cancel" : "បោះបង់"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  {/* Search Input */}
                  <div className="flex-1 min-w-0">
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <input
                        type="text"
                        style={{ fontSize: "16px" }}
                        placeholder={
                          language === "en"
                            ? "Search items..."
                            : "ស្វែងរកធាតុ..."
                        }
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400 text-sm sm:text-base"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Category Filter - Custom Dropdown */}
                  <div className="relative category-dropdown-container">
                    <button
                      onClick={() =>
                        setCategoryDropdownOpen(!categoryDropdownOpen)
                      }
                      className="flex items-center justify-between w-full pl-3 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-[140px] bg-white"
                    >
                      <span className="text-gray-700 truncate">
                        {getCategoryName(selectedCategory)}
                      </span>
                      <ChevronDownIcon
                        className={`w-5 h-5 text-gray-500 ml-2 transition-transform duration-200 ${
                          categoryDropdownOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>

                    {categoryDropdownOpen && (
                      <div className="absolute left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                        <ul className="py-1">
                          <li
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-700"
                            onClick={() => {
                              setSelectedCategory("all");
                              setCategoryDropdownOpen(false);
                            }}
                          >
                            {language === "en"
                              ? "All Categories"
                              : "ប្រភេទទាំងអស់"}
                          </li>
                          {categories.map((category) => (
                            <li
                              key={category.id}
                              className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-700"
                              onClick={() => {
                                setSelectedCategory(category.id);
                                setCategoryDropdownOpen(false);
                              }}
                            >
                              {language === "en"
                                ? category.name_en
                                : category.name_kh}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Status Filter - Custom Dropdown */}
                  <div className="relative status-dropdown-container">
                    <button
                      onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                      className="flex items-center justify-between w-full pl-3 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-[140px] bg-white"
                    >
                      <span className="text-gray-700 truncate">
                        {getStatusName(statusFilter)}
                      </span>
                      <ChevronDownIcon
                        className={`w-5 h-5 text-gray-500 ml-2 transition-transform duration-200 ${
                          statusDropdownOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>

                    {statusDropdownOpen && (
                      <div className="absolute left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <ul className="py-1">
                          <li
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-700"
                            onClick={() => {
                              setStatusFilter("all");
                              setStatusDropdownOpen(false);
                            }}
                          >
                            {language === "en"
                              ? "All Status"
                              : "ស្ថានភាពទាំងអស់"}
                          </li>
                          <li
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-700"
                            onClick={() => {
                              setStatusFilter("available");
                              setStatusDropdownOpen(false);
                            }}
                          >
                            {language === "en" ? "InStock" : "មានក្នុងស្តុក"}
                          </li>
                          <li
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-700"
                            onClick={() => {
                              setStatusFilter("unavailable");
                              setStatusDropdownOpen(false);
                            }}
                          >
                            {language === "en" ? "OutStock" : "អស់ស្តុក"}
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Clear Filters */}
                  {(searchTerm ||
                    selectedCategory !== "all" ||
                    statusFilter !== "all") && (
                    <button
                      onClick={clearAllFilters}
                      className="px-3 py-2 text-sm text-gray-600  bg-gray-200  rounded-lg transition-colors"
                    >
                      {language === "en" ? "Clear" : "លុបចោល"}
                    </button>
                  )}
                </div>

                {/* Sort Options */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">
                    {language === "en" ? "Sort by:" : "តម្រៀបតាម:"}
                  </span>
                  <button
                    onClick={() => handleSort("name")}
                    className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                      sortBy === "name"
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "text-gray-600 hover:text-gray-800 bg-gray-100"
                    }`}
                  >
                    {language === "en" ? "Name" : "ឈ្មោះ"}{" "}
                    {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                  <button
                    onClick={() => handleSort("price")}
                    className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                      sortBy === "price"
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "text-gray-600 hover:text-gray-800 bg-gray-100"
                    }`}
                  >
                    {language === "en" ? "Price" : "តម្លៃ"}{" "}
                    {sortBy === "price" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                  <button
                    onClick={() => handleSort("date")}
                    className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                      sortBy === "date"
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "text-gray-600 hover:text-gray-800 bg-gray-100"
                    }`}
                  >
                    {language === "en" ? "Date" : "កាលបរិច្ឆេទ"}{" "}
                    {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </div>
              </div>

              {/* Items Per Page Selector */}
              <div className="px-4 md:px-6 py-3 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3 relative items-per-page-dropdown-container">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">
                    {language === "en"
                      ? "Items per page:"
                      : "ធាតុក្នុងមួយទំព័រ:"}
                  </span>
                  <div className="relative ">
                    <button
                      onClick={() =>
                        setItemsPerPageDropdownOpen(!itemsPerPageDropdownOpen)
                      }
                      className="flex items-center justify-between text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white pr-6"
                    >
                      {itemsPerPage}
                      <ChevronDownIcon
                        className={`w-3 h-3 text-gray-500 ml-1 transition-transform duration-200 ${
                          itemsPerPageDropdownOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>

                    {itemsPerPageDropdownOpen && (
                      <div className="absolute left-0 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg z-10">
                        <ul className="py-1">
                          {[5, 10, 20, 50].map((num) => (
                            <li
                              key={num}
                              className="px-2 py-1 cursor-pointer hover:bg-gray-100 text-xs text-gray-700"
                              onClick={() => {
                                setItemsPerPage(num);
                                setCurrentPage(1);
                                setItemsPerPageDropdownOpen(false);
                              }}
                            >
                              {num}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pagination Info */}
                <div className="text-xs text-gray-600">
                  {language === "en" ? "Showing" : "កំពុងបង្ហាញ"}{" "}
                  {startIndex + 1}-{Math.min(endIndex, totalItems)}{" "}
                  {language === "en" ? "of" : "នៃ"} {totalItems}{" "}
                  {language === "en" ? "items" : "ធាតុ"}
                </div>
              </div>

              {/* Items Container with ID for scrolling */}
              <div id="items-container">
                {/* Mobile & Tablet Card View */}
                {(screenSize === "mobile" || screenSize === "tablet") && (
                  <div className="divide-y divide-gray-200">
                    {currentItems.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
                          editingItem?.id === item.id
                            ? "bg-blue-50 border-l-4 border-l-blue-500"
                            : ""
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          {item.image_url && (
                            <img
                              src={item.image_url}
                              alt={
                                language === "en" ? item.name_en : item.name_kh
                              }
                              width={64}
                              height={64}
                              className="h-16 w-16 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h3 className="text-sm font-semibold text-gray-900 truncate">
                                {language === "en"
                                  ? item.name_en
                                  : item.name_kh}
                              </h3>
                              <div className="text-sm font-bold text-gray-900 ml-2 flex-shrink-0">
                                ${item.price.toFixed(2)}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                              {language === "en"
                                ? item.description_en
                                : item.description_kh}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {language === "en"
                                  ? item.categories?.name_en
                                  : item.categories?.name_kh}
                              </span>
                              <button
                                onClick={() => handleToggleAvailability(item)}
                                className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                  item.is_available
                                    ? "bg-gradient-to-br from-green-500 to-green-600 text-white"
                                    : "bg-gradient-to-br from-red-500 to-red-600 text-white"
                                }`}
                              >
                                {item.is_available
                                  ? language === "en"
                                    ? "InStock"
                                    : "មានក្នុងស្តុក"
                                  : language === "en"
                                  ? "OutStock"
                                  : "អស់ស្តុក"}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Images */}
                          <div className="flex -space-x-2">
                            {item.images &&
                              item.images
                                .slice(0, screenSize === "mobile" ? 2 : 3)
                                .map((image, index) => (
                                  <img
                                    key={index}
                                    src={image}
                                    alt={`${
                                      language === "en"
                                        ? item.name_en
                                        : item.name_kh
                                    } ${index + 1}`}
                                    width={32}
                                    height={32}
                                    className="h-8 w-8 rounded-lg border-2 border-white object-cover shadow-sm"
                                  />
                                ))}
                            {item.images &&
                              item.images.length >
                                (screenSize === "mobile" ? 2 : 3) && (
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 border-2 border-white flex items-center justify-center text-xs font-medium text-white shadow-sm">
                                  +
                                  {item.images.length -
                                    (screenSize === "mobile" ? 2 : 3)}
                                </div>
                              )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleEditClick(item, e)}
                              className={`text-blue-600 hover:text-blue-800 transition-colors duration-200 p-2 rounded-lg ${
                                editingItem?.id === item.id
                                  ? "bg-blue-100"
                                  : "bg-blue-50"
                              }`}
                              title={language === "en" ? "Edit" : "កែសម្រួល"}
                            >
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-800 transition-colors duration-200 p-2 bg-red-50 rounded-lg"
                              title={language === "en" ? "Delete" : "លុប"}
                            >
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Desktop Table View */}
                {screenSize === "desktop" && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            {language === "en" ? "Item" : "ធាតុ"}
                          </th>
                          <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            <button
                              onClick={() => handleSort("price")}
                              className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                            >
                              {language === "en" ? "Price" : "តម្លៃ"}
                              {sortBy === "price" && (
                                <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                              )}
                            </button>
                          </th>
                          <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            {language === "en" ? "Category" : "ប្រភេទ"}
                          </th>
                          <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            {language === "en" ? "Images" : "រូបភាព"}
                          </th>
                          <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            {language === "en" ? "Status" : "ស្ថានភាព"}
                          </th>
                          <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            {language === "en" ? "Actions" : "សកម្មភាព"}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((item) => (
                          <tr
                            key={item.id}
                            className={`hover:bg-gray-50 transition-colors duration-200 ${
                              editingItem?.id === item.id
                                ? "bg-blue-50 border-l-4 border-l-blue-500"
                                : ""
                            }`}
                          >
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {item.image_url && (
                                  <img
                                    src={item.image_url}
                                    alt={
                                      language === "en"
                                        ? item.name_en
                                        : item.name_kh
                                    }
                                    width={48}
                                    height={48}
                                    className="h-10 md:h-12 w-10 md:w-12 rounded-xl object-cover mr-3 md:mr-4 border border-gray-200"
                                  />
                                )}
                                <div className="min-w-0">
                                  <div className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                                    {language === "en"
                                      ? item.name_en
                                      : item.name_kh}
                                  </div>
                                  <div className="text-sm text-gray-500 line-clamp-2 max-w-[200px]">
                                    {language === "en"
                                      ? item.description_en
                                      : item.description_kh}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-bold text-gray-900">
                                ${item.price.toFixed(2)}
                              </div>
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {language === "en"
                                  ? item.categories?.name_en
                                  : item.categories?.name_kh}
                              </span>
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                              <div className="flex -space-x-1 md:-space-x-2">
                                {item.images &&
                                  item.images
                                    .slice(0, 3)
                                    .map((image, index) => (
                                      <img
                                        key={index}
                                        src={image}
                                        alt={`${
                                          language === "en"
                                            ? item.name_en
                                            : item.name_kh
                                        } ${index + 1}`}
                                        width={32}
                                        height={32}
                                        className="h-8 w-8 md:h-10 md:w-10 rounded-xl border-2 border-white object-cover shadow-sm"
                                      />
                                    ))}
                                {item.images && item.images.length > 3 && (
                                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 border-2 border-white flex items-center justify-center text-xs font-medium text-white shadow-sm">
                                    +{item.images.length - 3}
                                  </div>
                                )}
                                {(!item.images || item.images.length === 0) &&
                                  item.image_url && (
                                    <img
                                      src={item.image_url}
                                      alt={
                                        language === "en"
                                          ? item.name_en
                                          : item.name_kh
                                      }
                                      width={32}
                                      height={32}
                                      className="h-8 w-8 md:h-10 md:w-10 rounded-xl border-2 border-white object-cover shadow-sm"
                                    />
                                  )}
                              </div>
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleToggleAvailability(item)}
                                className={`inline-flex items-center px-3 md:px-4 py-1 md:py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
                                  item.is_available
                                    ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl"
                                    : "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl"
                                }`}
                              >
                                {item.is_available
                                  ? language === "en"
                                    ? "InStock"
                                    : "មានក្នុងស្តុក"
                                  : language === "en"
                                  ? "OutStock"
                                  : "អស់ស្តុក"}
                              </button>
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 md:space-x-3">
                              <button
                                onClick={(e) => handleEditClick(item, e)}
                                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 flex items-center gap-1 text-xs md:text-sm"
                              >
                                <svg
                                  className="w-3 h-3 md:w-4 md:h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                                {language === "en" ? "Edit" : "កែសម្រួល"}
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600 hover:text-red-800 font-semibold transition-colors duration-200 flex items-center gap-1 text-xs md:text-sm"
                              >
                                <svg
                                  className="w-3 h-3 md:w-4 md:h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                {language === "en" ? "Delete" : "លុប"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="px-4 md:px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                      {language === "en" ? "Page" : "ទំព័រ"} {currentPage}{" "}
                      {language === "en" ? "of" : "នៃ"} {totalPages}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Previous Button */}
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {language === "en" ? "Previous" : "ត្រឡប់ក្រោយ"}
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
                        {getPageNumbers().map((page) => (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                              currentPage === page
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        {/* Ellipsis for many pages */}
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                          <span className="px-2 text-gray-500">...</span>
                        )}

                        {totalPages > 5 && currentPage < totalPages - 1 && (
                          <button
                            onClick={() => goToPage(totalPages)}
                            className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                              currentPage === totalPages
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {totalPages}
                          </button>
                        )}
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {language === "en" ? "Next" : "បន្ទាប់"}
                      </button>
                    </div>

                    {/* Items Per Page Selector (Bottom) */}
                    <div className="flex items-center gap-2 ">
                      <span className="text-xs text-gray-600">
                        {language === "en" ? "Show:" : "បង្ហាញ:"}
                      </span>
                      <div className=" relative items-per-page-dropdown-container ">
                        <button
                          onClick={() =>
                            setItemsPerPageDropdownOpen(
                              !itemsPerPageDropdownOpen
                            )
                          }
                          className="flex items-center justify-between text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white pr-6"
                        >
                          {itemsPerPage}
                          <ChevronDownIcon
                            className={`w-3 h-3 text-gray-500 ml-1 transition-transform duration-200 ${
                              itemsPerPageDropdownOpen
                                ? "rotate-180"
                                : "rotate-0"
                            }`}
                          />
                        </button>

                        {itemsPerPageDropdownOpen && (
                          <div
                            className="absolute left-0 bottom-full mb-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[80px]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ul className="py-1">
                              {[5, 10, 20, 50].map((num) => (
                                <li
                                  key={num}
                                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-700 transition-colors"
                                  onClick={() => {
                                    setItemsPerPage(num);
                                    setCurrentPage(1);
                                    setItemsPerPageDropdownOpen(false);
                                  }}
                                >
                                  {num}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {sortedItems.length === 0 && (
                <div className="text-center py-8 md:py-12">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 md:w-12 md:h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div className="text-gray-500 max-w-sm mx-auto px-4">
                    <p className="text-base md:text-lg font-medium mb-2">
                      {language === "en"
                        ? "No menu items found"
                        : "មិនមានធាតុមីនុយណាមួយទេ"}
                    </p>
                    <p className="text-xs md:text-sm">
                      {language === "en"
                        ? searchTerm ||
                          selectedCategory !== "all" ||
                          statusFilter !== "all"
                          ? "Try adjusting your search or filters."
                          : "Add your first item using the form to get started."
                        : searchTerm ||
                          selectedCategory !== "all" ||
                          statusFilter !== "all"
                        ? "ព្យាយាមកែសម្រួលការស្វែងរក ឬតម្រងរបស់អ្នក។"
                        : "បន្ថែមធាតុដំបូងរបស់អ្នកដោយប្រើទម្រង់ដើម្បីចាប់ផ្តើម។"}
                    </p>
                    {(searchTerm ||
                      selectedCategory !== "all" ||
                      statusFilter !== "all") && (
                      <button
                        onClick={clearAllFilters}
                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        {language === "en"
                          ? "Clear all filters"
                          : "លុបតម្រងទាំងអស់"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
