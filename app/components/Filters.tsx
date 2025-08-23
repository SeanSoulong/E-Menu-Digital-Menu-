"use client";
import Image from "next/image";
import { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

interface FiltersProps {
  categories: string[];
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
    <div className="w-full lg:w-1/4 p-2 lg:p-6 border-b lg:border-r lg:border-b-0 border-[#3F3F3F]">
      <div className="flex items-center mb-2 lg:mb-6">
        <Image
          src="/images/logo_emoji.png"
          alt="Logo"
          width={60}
          height={70}
          className="cursor-pointer"
        />
        <p className="text-[20px] font-bold text-[#212121]">
          Emoji Online Shop
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative flex items-center">
          <FaSearch className="absolute left-4 text-[#3F3F3F]" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleInputChange}
            className="w-full pl-10 pr-10 py-2 border rounded-full focus:outline-none focus:ring-1 focus:ring-[#3F3F3F]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <h3 className="text-xl font-semibold mb-4 text-[#3F3F3F] hidden lg:block">
        Categories
      </h3>

      {/* Desktop List */}
      <ul className="space-y-2 hidden lg:block">
        <li>
          <button
            onClick={() => onFilter("All")}
            className={`block w-full text-left px-4 py-2 rounded-md transition-colors ${
              activeCategory === "All"
                ? "bg-[#3F3F3F] text-white font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            All Products
          </button>
        </li>
        {categories.map((category) => (
          <li key={category}>
            <button
              onClick={() => onFilter(category)}
              className={`block w-full text-left px-4 py-2 rounded-md transition-colors ${
                activeCategory === category
                  ? "bg-[#3F3F3F] text-white font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>

      {/* Mobile Pills */}
      <div className="flex gap-3 overflow-x-auto pb-2 lg:hidden scrollbar-hide">
        <button
          onClick={() => onFilter("All")}
          className={`px-4 py-2 border rounded-full whitespace-nowrap transition-colors ${
            activeCategory === "All"
              ? "bg-[#3F3F3F] text-white font-semibold"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onFilter(category)}
            className={`px-4 py-2 border rounded-full whitespace-nowrap transition-colors ${
              activeCategory === category
                ? "bg-[#3F3F3F] text-white font-semibold"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
