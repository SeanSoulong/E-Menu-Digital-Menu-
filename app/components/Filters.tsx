"use client";

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
    onSearch(query); // Live search happens here
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <div className="w-full lg:w-1/4 p-6 border-b lg:border-r lg:border-b-0 border-[#3F3F3F]">
      <h2 className="text-2xl font-bold mb-6 text-[#212121]">
        Emoji Online Shop
      </h2>

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
      <h3 className="text-xl font-semibold mb-4 text-[#3F3F3F]">Categories</h3>
      <ul className="space-y-2">
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
    </div>
  );
}
