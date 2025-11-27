"use client";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="flex gap-2 p-2 bg-gray-100 rounded-2xl font-[Kantumruy_Pro]">
      <button
        onClick={() => setLanguage("en")}
        className={`p-3 rounded-xl transition-all duration-200 transform hover:scale-105 font-semibold ${
          language === "en"
            ? "bg-gradient-to-br from-[#3F3F3F] to-[#2F2F2F] text-white shadow-lg"
            : "bg-white text-gray-600 hover:bg-gray-50 shadow-md"
        }`}
      >
        🇺🇸
      </button>
      <button
        onClick={() => setLanguage("kh")}
        className={`p-3 rounded-xl transition-all duration-200 transform hover:scale-105 font-semibold ${
          language === "kh"
            ? "bg-gradient-to-br from-[#3F3F3F] to-[#2F2F2F] text-white shadow-lg"
            : "bg-white text-gray-600 hover:bg-gray-50 shadow-md"
        }`}
      >
        🇰🇭
      </button>
    </div>
  );
}
