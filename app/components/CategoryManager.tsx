"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "../../lib/supabase-client";
import { Category } from "../data/types";
import { useLanguage } from "../context/LanguageContext";

interface CategoryManagerProps {
  categories: Category[];
  onUpdate: () => void;
}

export default function CategoryManager({
  categories,
  onUpdate,
}: CategoryManagerProps) {
  const { language } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name_en: "",
    name_kh: "",
  });
  const [loading, setLoading] = useState(false);
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );
  const [translating, setTranslating] = useState(false);

  // Ref for auto-scrolling to form
  const formRef = useRef<HTMLFormElement>(null);

  const supabase = createClient();

  // Custom debounce hook for translation
  const useDebounce = <T extends unknown[]>(
    callback: (...args: T) => void,
    delay: number
  ) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    return useCallback(
      (...args: T) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          callback(...args);
        }, delay);
      },
      [callback, delay]
    );
  };

  // Translation function using Google Translate API
  const translateText = async (
    text: string,
    sourceLang: string = "km",
    targetLang: string = "en"
  ): Promise<string> => {
    try {
      if (!text.trim()) return "";

      // Free method using Google Translate (no API key required)
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
          text
        )}`
      );

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.status}`);
      }

      const data = await response.json();

      // Extract translated text
      const translatedText = data[0].map((item: string[]) => item[0]).join("");

      return translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      return fallbackTranslation(text, sourceLang, targetLang);
    }
  };

  // Simple fallback translation for common Khmer food category terms
  const fallbackTranslation = (
    text: string,
    sourceLang: string,
    targetLang: string
  ): string => {
    if (sourceLang !== "km" || targetLang !== "en") return text;

    const commonTranslations: Record<string, string> = {
      អាហារពេលព្រឹក: "Breakfast",
      អាហារថ្ងៃត្រង់: "Lunch",
      អាហារពេលល្ងាច: "Dinner",
      បង្អែម: "Dessert",
      ភេសជ្ជៈ: "Drinks",
      កាហ្វេ: "Coffee",
      ប៊ឺ: "Beer",
      ស្រា: "Wine",
      សាឡាត: "Salads",
      ស៊ុប: "Soups",
      អាហារសមុទ្រ: "Seafood",
      អាហារបង្អែម: "Desserts",
      អាហាររហ័ស: "Fast Food",
      អាហារវៀតណាម: "Vietnamese Food",
      អាហារចិន: "Chinese Food",
      អាហារកូរ៉េ: "Korean Food",
      អាហារជប៉ុន: "Japanese Food",
      អាហារថៃ: "Thai Food",
      អាហារខ្មែរ: "Khmer Food",
      អាហារសុខភាព: "Healthy Food",
      អាហារបួស: "Vegetarian",
      អាហារសម្រាប់កូន: "Kids Menu",
    };

    // Check if any common terms exist in the text
    const words = text.split(" ");
    const translatedWords = words.map((word) => {
      const cleanedWord = word.replace(/[១២៣៤៥៦៧៨៩០.,!?]/g, "");
      return commonTranslations[cleanedWord] || word;
    });

    return translatedWords.join(" ");
  };

  // Auto-translate Khmer to English when Khmer input changes
  const handleKhmerInputChange = useDebounce(async (khmerText: string) => {
    if (!khmerText.trim() || translating) return;

    try {
      setTranslating(true);

      // Only translate if Khmer text has been entered
      const hasKhmerCharacters = /[\u1780-\u17FF]/.test(khmerText);
      if (!hasKhmerCharacters) {
        setTranslating(false);
        return;
      }

      const translatedText = await translateText(khmerText, "km", "en");

      if (translatedText && translatedText.trim()) {
        setFormData((prev) => ({
          ...prev,
          name_en: translatedText,
        }));

        // Show translation success notification
        if (language === "en") {
          console.log("Auto-translated category successfully!");
        } else {
          console.log("បកប្រែប្រភេទស្វ័យប្រវត្តិដោយជោគជ័យ!");
        }
      }
    } catch (error) {
      console.error("Auto-translation failed:", error);
    } finally {
      setTranslating(false);
    }
  }, 1000); // 1 second debounce

  // Handle Khmer name input
  const handleNameKhChange = (value: string) => {
    setFormData((prev) => ({ ...prev, name_kh: value }));
    handleKhmerInputChange(value);
  };

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize("mobile");
      } else if (width >= 768 && width < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Auto-scroll to form when editing a category on mobile/tablet
  useEffect(() => {
    if (
      editingCategory &&
      (screenSize === "mobile" ||
        screenSize === "tablet" ||
        screenSize === "desktop") &&
      formRef.current
    ) {
      // Small delay to ensure the form is rendered
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    }
  }, [editingCategory, screenSize]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from("categories")
          .update({
            name_en: formData.name_en,
            name_kh: formData.name_kh,
          })
          .eq("id", editingCategory.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert([
          {
            name_en: formData.name_en,
            name_kh: formData.name_kh,
          },
        ]);

        if (error) throw error;
      }

      onUpdate();
      setFormData({ name_en: "", name_kh: "" });
      setEditingCategory(null);
      setShowForm(false);

      alert(
        language === "en"
          ? "Category saved successfully!"
          : "រក្សាទុកប្រភេទដោយជោគជ័យ!"
      );
    } catch (error: unknown) {
      console.error("Error saving category:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      alert(
        language === "en" ? `Error: ${errorMessage}` : `កំហុស: ${errorMessage}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (
      !confirm(
        language === "en"
          ? `Are you sure you want to delete "${category.name_en}"?`
          : `តើអ្នកពិតជាចង់លុប "${category.name_kh}" មែនទេ?`
      )
    ) {
      return;
    }

    try {
      const { data: menuItems, error: checkError } = await supabase
        .from("menu_items")
        .select("id")
        .eq("category_id", category.id)
        .limit(1);

      if (checkError) throw checkError;

      if (menuItems && menuItems.length > 0) {
        alert(
          language === "en"
            ? "Cannot delete category that is being used by menu items"
            : "មិនអាចលុបប្រភេទដែលកំពុងត្រូវបានប្រើប្រាស់ដោយធាតុមីនុយ"
        );
        return;
      }

      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", category.id);

      if (error) throw error;

      onUpdate();
      alert(
        language === "en"
          ? "Category deleted successfully!"
          : "លុបប្រភេទដោយជោគជ័យ!"
      );
    } catch (error: unknown) {
      console.error("Error deleting category:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      alert(
        language === "en" ? `Error: ${errorMessage}` : `កំហុស: ${errorMessage}`
      );
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name_en: category.name_en,
      name_kh: category.name_kh,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name_en: "", name_kh: "" });
    setEditingCategory(null);
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100 font-[Kantumruy_Pro] hover-card">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <div className="w-10 h-10 bg-[#0E4123] rounded-xl flex items-center justify-center text-white font-bold">
            📁
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {language === "en" ? "Category Management" : "ការគ្រប់គ្រងប្រភេទ"}
            </h3>
            <p className="text-sm text-gray-600">
              {categories.length} {language === "en" ? "categories" : "ប្រភេទ"}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingCategory(null);
            setFormData({ name_en: "", name_kh: "" });
          }}
          className="flex items-center gap-2 bg-[#0E4123] text-white px-3 py-2 rounded-xl hover:from-[#2F2F2F] hover:to-[#1F1F1F] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl font-semibold"
        >
          {showForm ? (
            <>
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
              {language === "en" ? "Cancel" : "បោះបង់"}
            </>
          ) : (
            <>
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {language === "en" ? "Add Category" : "បន្ថែមប្រភេទ"}
            </>
          )}
        </button>
      </div>

      {/* Auto-translation hint */}
      {showForm && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-[14px] text-[#0E4123] font-bold text-center">
            {language === "en"
              ? "Type in Khmer, English will auto-fill"
              : "វាយជាភាសាខ្មែរ ភាសាអង់គ្លេសនឹងបំពេញដោយស្វ័យប្រវត្តិ"}
          </p>
        </div>
      )}

      {/* Category Form with ref */}
      {showForm && (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mb-6 p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gradient-to-br from-gray-50 to-white"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <div className="w-6 h-6 bg-[#0E4123] rounded-lg flex items-center justify-center text-white text-sm">
                {editingCategory ? "✏️" : "➕"}
              </div>
              {editingCategory
                ? language === "en"
                  ? "Edit Category"
                  : "កែសម្រួលប្រភេទ"
                : language === "en"
                ? "Add New Category"
                : "បន្ថែមប្រភេទថ្មី"}
            </h4>

            {/* Show editing indicator on mobile/tablet */}
            {(screenSize === "mobile" || screenSize === "tablet") &&
              editingCategory && (
                <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {language === "en" ? "Editing" : "កំពុងកែសម្រួល"}
                </div>
              )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
                {language === "en"
                  ? "Name Product (Khmer)"
                  : "ឈ្មោះ ផលិតផល (ខ្មែរ)"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.name_kh}
                  onChange={(e) => handleNameKhChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white placeholder-gray-400 pr-10"
                  placeholder="បញ្ចូលផលិតផល"
                  style={{ fontSize: "16px" }}
                />
                {translating && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
                {language === "en"
                  ? "Name Product (English)"
                  : "ឈ្មោះ ផលិតផល (អង់គ្លេស)"}
              </label>
              <input
                type="text"
                required
                value={formData.name_en}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name_en: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white placeholder-gray-400"
                placeholder={
                  language === "en"
                    ? "Auto-filled from Khmer or enter manually"
                    : "បំពេញដោយស្វ័យប្រវត្តិពីភាសាខ្មែរ ឬបញ្ចូលដោយដៃ"
                }
                style={{ fontSize: "16px" }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              type="submit"
              disabled={loading || translating}
              className="flex items-center justify-center gap-2 bg-[#0E4123] text-white px-3 py-2 rounded-xl hover:from-[#2F2F2F] hover:to-[#1F1F1F] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 font-semibold flex-1"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {language === "en" ? "Saving..." : "កំពុងរក្សាទុក..."}
                </>
              ) : editingCategory ? (
                <>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {language === "en"
                    ? "Update Category"
                    : "ធ្វើបច្ចុប្បន្នភាពប្រភេទ"}
                </>
              ) : (
                <>
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  {language === "en" ? "Add Category" : "បន្ថែមប្រភេទ"}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={resetForm}
              disabled={translating}
              className="flex items-center justify-center gap-2 bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700 px-3 py-2 rounded-xl hover:from-gray-400 hover:to-gray-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl font-semibold flex-1 disabled:opacity-50"
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
              {language === "en" ? "Cancel" : "បោះបង់"}
            </button>
          </div>

          {/* Scroll hint for mobile/tablet when editing */}
          {(screenSize === "mobile" || screenSize === "tablet") &&
            editingCategory && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 animate-pulse">
                  {language === "en"
                    ? "↑ Scroll up to see the form"
                    : "↑ រំកិលឡើងលើដើម្បីមើលទម្រង់"}
                </p>
              </div>
            )}
        </form>
      )}

      {/* Categories List */}
      <div>
        <h4 className="font-bold text-lg mb-4 text-gray-900">
          {language === "en" ? "Existing Categories" : "ប្រភេទដែលមាន"}
        </h4>

        {categories.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
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
            </div>
            <p className="text-gray-500 font-medium">
              {language === "en" ? "No categories found" : "មិនមានប្រភេទ"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {language === "en"
                ? "Add your first category to get started"
                : "បន្ថែមប្រភេទដំបូងរបស់អ្នកដើម្បីចាប់ផ្តើម"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`border-2 rounded-2xl p-4 flex justify-between items-center bg-white hover:shadow-md transition-all duration-200 ${
                  editingCategory?.id === category.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-100 hover:border-blue-200"
                }`}
              >
                <div className="flex-1">
                  <div className="font-bold text-gray-900 text-sm">
                    {category.name_en}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {category.name_kh}
                  </div>
                </div>

                <div className="flex space-x-2 ml-3">
                  <button
                    onClick={() => startEdit(category)}
                    className={`text-sm font-semibold transition-colors duration-200 flex items-center gap-1 px-3 py-2 rounded-lg ${
                      editingCategory?.id === category.id
                        ? "bg-blue-100 text-blue-700"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-800"
                    }`}
                  >
                    <svg
                      className="w-3 h-3"
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
                    onClick={() => handleDelete(category)}
                    className="text-red-600 hover:text-red-800 text-sm font-semibold transition-colors duration-200 flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg"
                  >
                    <svg
                      className="w-3 h-3"
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
