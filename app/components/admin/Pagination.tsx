import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) {
  const { language } = useLanguage();
  const [itemsPerPageDropdownOpen, setItemsPerPageDropdownOpen] =
    useState(false);

  const goToPage = (page: number) => {
    onPageChange(page);
    const itemsContainer = document.getElementById("items-container");
    if (itemsContainer) {
      itemsContainer.scrollIntoView({ behavior: "smooth" });
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="px-4 md:px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          {language === "en" ? "Page" : "ទំព័រ"} {currentPage}{" "}
          {language === "en" ? "of" : "នៃ"} {totalPages}
        </div>

        <div className="flex items-center gap-2">
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

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">
            {language === "en" ? "Show:" : "បង្ហាញ:"}
          </span>
          <div className="relative items-per-page-dropdown-container">
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
                        onItemsPerPageChange(num);
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
  );
}
