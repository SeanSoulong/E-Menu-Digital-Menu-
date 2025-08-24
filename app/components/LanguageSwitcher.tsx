"use client";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="flex gap-2 p-2">
      <button
        onClick={() => setLanguage("en")}
        className={`p-2 h-10 rounded ${
          language === "en" ? "ring-2 text-white  bg-[#3F3F3F]" : ""
        }`}
      >
        🇺🇸
      </button>
      <button
        onClick={() => setLanguage("kh")}
        className={`p-2 h-10 rounded ${
          language === "kh" ? "ring-2 text-white bg-[#3F3F3F]" : ""
        }`}
      >
        🇰🇭
      </button>
    </div>
  );
}
