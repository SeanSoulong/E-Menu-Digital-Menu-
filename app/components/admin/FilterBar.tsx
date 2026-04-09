import { useState } from "react";
import { Category } from "../../data/types";
import { useLanguage } from "../../context/LanguageContext";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  statusFilter: "all" | "available" | "unavailable";
  setStatusFilter: (value: "all" | "available" | "unavailable") => void;
  sortBy: "name" | "price" | "date";
  sortOrder: "asc" | "desc";
  onSort: (field: "name" | "price" | "date") => void;
  onClearFilters: () => void;
  categories: Category[];
  totalItems: number;
  menuItemsCount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editingItem: any;
  onCancelEdit: () => void;
}

export default function FilterBar({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  statusFilter,
  setStatusFilter,
  sortBy,
  sortOrder,
  onSort,
  onClearFilters,
  categories,
  totalItems,
  menuItemsCount,
  editingItem,
  onCancelEdit,
}: FilterBarProps) {
  const { language } = useLanguage();
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

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
    <>
      <div className="px-4 md:px-6 py-4 md:py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-0">
            {language === "en" ? "Menu Items" : "ធាតុមីនុយ"}
          </h2>
          <div className="flex items-center gap-3">
            <span className="bg-[#0E4123] text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
              {totalItems}/{menuItemsCount}{" "}
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
                  onClick={onCancelEdit}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors bg-gray-100 px-2 py-1 rounded-lg"
                >
                  {language === "en" ? "Cancel" : "បោះបង់"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
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
                  language === "en" ? "Search items..." : "ស្វែងរកធាតុ..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400 text-sm sm:text-base"
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

          <div className="relative category-dropdown-container">
            <button
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
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
                    {language === "en" ? "All Categories" : "ប្រភេទទាំងអស់"}
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
                      {language === "en" ? category.name_en : category.name_kh}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

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
                    {language === "en" ? "All Status" : "ស្ថានភាពទាំងអស់"}
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

          {(searchTerm ||
            selectedCategory !== "all" ||
            statusFilter !== "all") && (
            <button
              onClick={onClearFilters}
              className="px-3 py-2 text-sm text-gray-600 bg-gray-200 rounded-lg transition-colors"
            >
              {language === "en" ? "Clear" : "លុបចោល"}
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">
            {language === "en" ? "Sort by:" : "តម្រៀបតាម:"}
          </span>
          <button
            onClick={() => onSort("name")}
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
            onClick={() => onSort("price")}
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
            onClick={() => onSort("date")}
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
    </>
  );
}
