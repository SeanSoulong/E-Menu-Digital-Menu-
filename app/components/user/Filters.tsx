"use client";
import { useState } from "react";
import { FaSearch, FaTimes, FaFilter } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import LanguageSwitcher from "../util/LanguageSwitcher";

interface FiltersProps {
  categories: { en: string; kh: string }[];
  activeCategory: string;
  activeStockStatus: string;
  onSearch: (query: string) => void;
  onFilter: (category: string) => void;
  onStockFilter: (status: string) => void;
}

export default function Filters({
  categories,
  activeCategory,
  activeStockStatus,
  onSearch,
  onFilter,
  onStockFilter,
}: FiltersProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [showStockDropdown, setShowStockDropdown] = useState(false);
  const [showMobileStockFilter, setShowMobileStockFilter] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  const stockOptions = [
    { value: "all", labelEn: "All Items", labelKh: "ទាំងអស់", icon: "📦" },
    { value: "instock", labelEn: "In Stock", labelKh: "មានស្តុក", icon: "✅" },
    {
      value: "outofstock",
      labelEn: "Out of Stock",
      labelKh: "អស់ស្តុក / Pre-order",
      icon: "⏰",
    },
  ];

  const getStockLabel = () => {
    const option = stockOptions.find((opt) => opt.value === activeStockStatus);
    if (!option) return language === "en" ? "All" : "ទាំងអស់";
    return language === "en" ? option.labelEn : option.labelKh;
  };

  const getStockIcon = () => {
    const option = stockOptions.find((opt) => opt.value === activeStockStatus);
    return option?.icon || "📦";
  };

  if (!theme.showSearchBar && categories.length === 0) {
    return null;
  }

  return (
    <div
      className="w-full lg:w-1/4 p-4 lg:p-6 from-white to-gray-50 border-b lg:border-r lg:border-b-0 border-gray-200 sticky top-0 z-40 bg-white/80 backdrop-blur-md lg:static"
      style={{ backgroundColor: `${theme.cardBackgroundColor}CC` }}
    >
      <div className="flex items-center mb-4 lg:mb-8 w-full justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: theme.primaryColor }}
          >
            E
          </div>
          <div>
            <p
              className="text-[16px] font-bold"
              style={{ color: theme.textColor }}
            >
              Emoji-Menu
            </p>
            <p className="text-xs" style={{ color: theme.textColorSecondary }}>
              {language === "en" ? "Premium Products" : "ផលិតផលគុណភាពខ្ពស់"}
            </p>
          </div>
        </div>
        <div className="flex items-end justify-end">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Search Bar + Stock Filter - Mobile inline */}
      {theme.showSearchBar && (
        <div className="mb-6">
          <div className="relative flex items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 text-gray-400 z-10 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder={language === "en" ? "Search..." : "ស្វែងរក..."}
                value={searchQuery}
                onChange={handleInputChange}
                style={{
                  fontSize: "16px",
                  borderColor: `${theme.primaryColor}40`,
                  borderRadius: `${theme.buttonBorderRadius}px`,
                  color: theme.textColor,
                }}
                className="w-full pl-10 pr-8 py-2 text-[14px] font-normal border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent bg-white transition-all duration-200 placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={14} />
                </button>
              )}
            </div>

            {/* Mobile Stock Filter Button - Small and on the right */}
            <div className="lg:hidden relative">
              <button
                onClick={() => setShowMobileStockFilter(!showMobileStockFilter)}
                className="flex items-center justify-center gap-1 px-3 py-2 border-2 rounded-xl whitespace-nowrap transition-all duration-200"
                style={{
                  backgroundColor:
                    activeStockStatus !== "all"
                      ? theme.primaryColor
                      : "transparent",
                  color:
                    activeStockStatus !== "all" ? "white" : theme.textColor,
                  borderColor:
                    activeStockStatus !== "all"
                      ? "transparent"
                      : `${theme.primaryColor}40`,
                  borderRadius: `${theme.buttonBorderRadius}px`,
                }}
              >
                <span className="text-sm">{getStockIcon()}</span>
                <span className="text-xs font-medium hidden xs:inline">
                  {getStockLabel()}
                </span>
                <FaFilter size={10} className="opacity-70" />
              </button>

              {/* Mobile Stock Dropdown */}
              {showMobileStockFilter && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMobileStockFilter(false)}
                  />
                  <div
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl shadow-lg overflow-hidden z-50"
                    style={{
                      backgroundColor: theme.cardBackgroundColor,
                      border: `1px solid ${theme.primaryColor}30`,
                      borderRadius: `${theme.buttonBorderRadius}px`,
                    }}
                  >
                    {stockOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onStockFilter(option.value);
                          setShowMobileStockFilter(false);
                        }}
                        className={`w-full px-4 py-3 text-left transition-colors duration-200 flex items-center gap-3 ${
                          activeStockStatus === option.value
                            ? "bg-opacity-20"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            activeStockStatus === option.value
                              ? `${theme.primaryColor}20`
                              : "transparent",
                          color: theme.textColor,
                        }}
                      >
                        <span className="text-lg">{option.icon}</span>
                        <span className="text-sm font-medium">
                          {language === "en" ? option.labelEn : option.labelKh}
                        </span>
                        {activeStockStatus === option.value && (
                          <svg
                            className="w-4 h-4 ml-auto"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            style={{ color: theme.primaryColor }}
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stock Status Filter - Desktop (Left sidebar) */}
      <div className="hidden lg:block mb-4">
        <h3
          className="text-[18px] font-bold mb-4 flex items-center gap-2"
          style={{ color: theme.textColor }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: theme.primaryColor }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          {language === "en" ? "Stock Status" : "ស្ថានភាពស្តុក"}
        </h3>
        <ul className="space-y-2 text-[12px]">
          {stockOptions.map((option) => (
            <li key={option.value}>
              <button
                onClick={() => onStockFilter(option.value)}
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-semibold ${
                  activeStockStatus === option.value
                    ? "text-white shadow-lg"
                    : "hover:shadow-md"
                }`}
                style={{
                  backgroundColor:
                    activeStockStatus === option.value
                      ? theme.primaryColor
                      : "transparent",
                  color:
                    activeStockStatus === option.value
                      ? "white"
                      : theme.textColor,
                  borderRadius: `${theme.buttonBorderRadius}px`,
                }}
              >
                <span className="text-base">{option.icon}</span>
                <span>
                  {language === "en" ? option.labelEn : option.labelKh}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Categories - Desktop */}
      <div className="hidden lg:block">
        <h3
          className="text-[18px] font-bold mb-4 flex items-center gap-2"
          style={{ color: theme.textColor }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: theme.primaryColor }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          {language === "en" ? "Categories" : "ប្រភេទ"}
        </h3>

        <ul className="space-y-2 text-[12px]">
          <li>
            <button
              onClick={() => onFilter("All")}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-semibold ${
                activeCategory === "All"
                  ? "text-white shadow-lg"
                  : "hover:shadow-md"
              }`}
              style={{
                backgroundColor:
                  activeCategory === "All" ? theme.primaryColor : "transparent",
                color: activeCategory === "All" ? "white" : theme.textColor,
                borderRadius: `${theme.buttonBorderRadius}px`,
              }}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  activeCategory === "All" ? "bg-white" : "bg-gray-400"
                }`}
              ></div>
              {language === "en" ? "All Products" : "ផលិតផលទាំងអស់"}
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.en}>
              <button
                onClick={() => onFilter(cat.en)}
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-semibold ${
                  activeCategory === cat.en
                    ? "text-white shadow-lg"
                    : "hover:shadow-md"
                }`}
                style={{
                  backgroundColor:
                    activeCategory === cat.en
                      ? theme.primaryColor
                      : "transparent",
                  color: activeCategory === cat.en ? "white" : theme.textColor,
                  borderRadius: `${theme.buttonBorderRadius}px`,
                }}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    activeCategory === cat.en ? "bg-white" : "bg-gray-400"
                  }`}
                ></div>
                {language === "en" ? cat.en : cat.kh}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Categories - Mobile Pills (Below search) */}
      <div className="lg:hidden mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide text-[12px]">
          <button
            onClick={() => onFilter("All")}
            className="px-3 py-1.5 border rounded-xl whitespace-nowrap transition-all duration-200 font-medium text-xs"
            style={{
              backgroundColor:
                activeCategory === "All" ? theme.primaryColor : "transparent",
              color: activeCategory === "All" ? "white" : theme.textColor,
              borderColor:
                activeCategory === "All"
                  ? "transparent"
                  : `${theme.primaryColor}40`,
              borderRadius: `${theme.buttonBorderRadius}px`,
            }}
          >
            {language === "en" ? "All" : "ទាំងអស់"}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.en}
              onClick={() => onFilter(cat.en)}
              className="px-3 py-1.5 border rounded-xl whitespace-nowrap transition-all duration-200 font-medium text-xs"
              style={{
                backgroundColor:
                  activeCategory === cat.en
                    ? theme.primaryColor
                    : "transparent",
                color: activeCategory === cat.en ? "white" : theme.textColor,
                borderColor:
                  activeCategory === cat.en
                    ? "transparent"
                    : `${theme.primaryColor}40`,
                borderRadius: `${theme.buttonBorderRadius}px`,
              }}
            >
              {language === "en" ? cat.en : cat.kh}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
