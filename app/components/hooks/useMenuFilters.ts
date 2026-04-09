import { useState, useEffect } from "react";
import { MenuItem, Category } from "../../data/types";

export function useMenuFilters(
  menuItems: MenuItem[],
  categories: Category[],
  language: string,
  screenSize: "mobile" | "tablet" | "desktop"
) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "available" | "unavailable"
  >("all");
  const [sortBy, setSortBy] = useState<"name" | "price" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Update items per page based on screen size
  useEffect(() => {
    if (screenSize === "mobile") {
      setItemsPerPage(5);
    } else if (screenSize === "tablet") {
      setItemsPerPage(8);
    } else {
      setItemsPerPage(10);
    }
  }, [screenSize]);

  // Filter items
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

  // Pagination
  const totalItems = sortedItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedItems.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, statusFilter, sortBy, sortOrder]);

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

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    filteredItems,
    sortedItems,
    currentItems,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    clearAllFilters,
    handleSort,
  };
}
