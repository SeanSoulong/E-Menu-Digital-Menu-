"use client";

import { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

interface FiltersProps {
  categories: { en: string; kh: string }[];
  activeCategory: string;
  onSearch: (query: string) => void;
  onFilter: (category: string) => void;
}

export default function Filters({
  categories,
  activeCategory,
  onSearch,
  onFilter,
}: FiltersProps) {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <div className="w-full lg:w-1/4 p-4 lg:p-6  from-white to-gray-50 border-b lg:border-r lg:border-b-0 border-gray-200 font-[Kantumruy_Pro]">
      <div className="flex items-center mb-4 lg:mb-8 w-full justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#3F3F3F] to-[#2F2F2F] rounded-xl flex items-center justify-center text-white font-bold text-lg">
            E
          </div>
          <div>
            <p className="text-[16px]  font-bold text-gray-900">Emoji-Menu</p>
            <p className="text-xs text-gray-500 font-[15px]">
              {language === "en" ? "Premium Products" : "ផលិតផលគុណភាពខ្ពស់"}
            </p>
          </div>
        </div>
        <div className="flex items-end justify-end">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 ">
        <div className="relative flex items-center ">
          <FaSearch className="absolute left-4 text-gray-400 z-10" />
          <input
            type="text"
            placeholder={
              language === "en" ? "Search products..." : "ស្វែងរកផលិតផល..."
            }
            value={searchQuery}
            onChange={handleInputChange}
            style={{ fontSize: "16px" }}
            className="w-full pl-12 pr-10 py-1.5 border-2 text-[14px] font-normal border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3F3F3F] focus:border-transparent bg-white transition-all duration-200 placeholder-gray-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <FaTimes size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="hidden lg:block">
        <h3 className="text-[18px] font-bold mb-4 text-gray-900 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-[#3F3F3F]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
                  ? "bg-gradient-to-r from-[#3F3F3F] to-[#2F2F2F] text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
              }`}
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
                    ? "bg-gradient-to-r from-[#3F3F3F] to-[#2F2F2F] text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
                }`}
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

      {/* Mobile Pills */}
      <div className="lg:hidden">
        <h3 className="text-[18px] font-bold mb-3 text-gray-900">
          {language === "en" ? "Categories" : "ប្រភេទ"}
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide text-[12px]">
          <button
            onClick={() => onFilter("All")}
            className={`px-3 py-2 border-2 rounded-xl whitespace-nowrap transition-all duration-200 font-semibold ${
              activeCategory === "All"
                ? "bg-gradient-to-r from-[#3F3F3F] to-[#2F2F2F] text-white border-transparent shadow-lg"
                : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            {language === "en" ? "All" : "ទាំងអស់"}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.en}
              onClick={() => onFilter(cat.en)}
              className={`px-4 py-2 border-2 rounded-xl whitespace-nowrap transition-all duration-200 font-semibold ${
                activeCategory === cat.en
                  ? "bg-gradient-to-r from-[#3F3F3F] to-[#2F2F2F] text-white border-transparent shadow-lg"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              {language === "en" ? cat.en : cat.kh}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
