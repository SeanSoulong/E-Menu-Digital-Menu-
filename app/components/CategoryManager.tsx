"use client";
import { useState } from "react";
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
  const supabase = createClient();

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
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
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
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-gradient-to-br from-[#3F3F3F] to-[#2F2F2F] text-white px-3 py-2 rounded-xl hover:from-[#2F2F2F] hover:to-[#1F1F1F] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl font-semibold"
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

      {/* Category Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gradient-to-br from-gray-50 to-white"
        >
          <h4 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
                {language === "en"
                  ? "Name Product  (English)"
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
                placeholder="Enter Product"
                style={{ fontSize: "16px" }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
                {language === "en"
                  ? "Name Product (Khmer)"
                  : "ឈ្មោះ ផលិតផល (ខ្មែរ)"}
              </label>
              <input
                type="text"
                required
                value={formData.name_kh}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name_kh: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white placeholder-gray-400"
                placeholder="បញ្ចូលផលិតផល"
                style={{ fontSize: "16px" }}
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-br from-[#3F3F3F] to-[#2F2F2F] text-white px-3 py-2 rounded-xl hover:from-[#2F2F2F] hover:to-[#1F1F1F] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 font-semibold"
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
              className="flex items-center gap-2 bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700 px-6 py-3 rounded-xl hover:from-gray-400 hover:to-gray-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl font-semibold"
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
                className="border-2 border-gray-100 rounded-2xl p-4 flex justify-between items-center bg-white hover:border-blue-200 hover:shadow-md transition-all duration-200"
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
                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors duration-200 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg"
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
