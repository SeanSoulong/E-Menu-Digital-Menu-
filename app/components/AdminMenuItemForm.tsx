"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "../../lib/supabase-client";
import { MenuItem, Category } from "../data/types";
import { useLanguage } from "../context/LanguageContext";
import { uploadMultipleImages } from "../../lib/imageUpload";

interface AdminMenuItemFormProps {
  categories: Category[];
  editingItem: MenuItem | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function AdminMenuItemForm({
  categories,
  editingItem,
  onSave,
  onCancel,
}: AdminMenuItemFormProps) {
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name_en: "",
    name_kh: "",
    description_en: "",
    description_kh: "",
    price: "",
    category_id: "",
    image_url: "",
    images: [] as string[],
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeKebabIndex, setActiveKebabIndex] = useState<number | null>(null);
  const kebabMenuRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  // Close kebab menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        kebabMenuRef.current &&
        !kebabMenuRef.current.contains(event.target as Node)
      ) {
        setActiveKebabIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name_en: editingItem.name_en,
        name_kh: editingItem.name_kh,
        description_en: editingItem.description_en,
        description_kh: editingItem.description_kh,
        price: editingItem.price.toString(),
        category_id: editingItem.category_id,
        image_url: editingItem.image_url || "",
        images: editingItem.images || [],
      });
    } else {
      setFormData({
        name_en: "",
        name_kh: "",
        description_en: "",
        description_kh: "",
        price: "",
        category_id: categories[0]?.id || "",
        image_url: "",
        images: [],
      });
    }
  }, [editingItem, categories]);

  const handleMultipleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      setUploading(true);
      setUploadProgress(0);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error(
          language === "en" ? "Please select images" : "សូមជ្រើសរើសរូបភាព"
        );
      }

      const files = Array.from(event.target.files);

      // Check total number of images
      const totalAfterUpload = formData.images.length + files.length;
      if (totalAfterUpload > 3) {
        throw new Error(
          language === "en"
            ? `Maximum 3 images allowed. You have ${formData.images.length} and trying to add ${files.length} more.`
            : `អនុញ្ញាតអោយមានរូបភាពអតិបរមា ៣។ អ្នកមាន ${formData.images.length} និងកំពុងព្យាយាមបន្ថែម ${files.length} ទៀត។`
        );
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const imageUrls = await uploadMultipleImages(files);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Add to images array
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...imageUrls],
        image_url: prev.image_url || imageUrls[0],
      }));

      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    } catch (error: unknown) {
      console.error("Multiple upload error:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      alert(
        language === "en"
          ? `Upload failed: ${errorMessage}`
          : `ការផ្ទុកបរាជ័យ: ${errorMessage}`
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    const removedImage = newImages.splice(index, 1)[0];

    setFormData((prev) => ({
      ...prev,
      images: newImages,
      image_url:
        prev.image_url === removedImage ? newImages[0] || "" : prev.image_url,
    }));
    setActiveKebabIndex(null);
  };

  const setAsMainImage = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, image_url: imageUrl }));
    setActiveKebabIndex(null);
  };

  const toggleKebabMenu = (index: number, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setActiveKebabIndex(activeKebabIndex === index ? null : index);
  };

  const canAddMoreImages = formData.images.length < 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name_en.trim() || !formData.name_kh.trim()) {
      alert(
        language === "en"
          ? "Please enter item names in both languages"
          : "សូមបញ្ចូលឈ្មោះធាតុជាភាសាទាំងពីរ"
      );
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert(
        language === "en"
          ? "Please enter a valid price"
          : "សូមបញ្ចូលតម្លៃដែលត្រឹមត្រូវ"
      );
      return;
    }

    if (!formData.category_id) {
      alert(
        language === "en" ? "Please select a category" : "សូមជ្រើសរើសប្រភេទ"
      );
      return;
    }

    setLoading(true);

    try {
      const itemData = {
        name_en: formData.name_en.trim(),
        name_kh: formData.name_kh.trim(),
        description_en: formData.description_en.trim(),
        description_kh: formData.description_kh.trim(),
        price: parseFloat(formData.price),
        category_id: formData.category_id,
        image_url: formData.image_url || null,
        images: formData.images,
        is_available: true,
      };

      if (editingItem) {
        const { error } = await supabase
          .from("menu_items")
          .update(itemData)
          .eq("id", editingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("menu_items").insert([itemData]);

        if (error) throw error;
      }

      onSave();
      setFormData({
        name_en: "",
        name_kh: "",
        description_en: "",
        description_kh: "",
        price: "",
        category_id: categories[0]?.id || "",
        image_url: "",
        images: [],
      });
      setActiveKebabIndex(null);

      alert(
        language === "en"
          ? "Item saved successfully!"
          : "រក្សាទុកធាតុដោយជោគជ័យ!"
      );
    } catch (error: unknown) {
      console.error("Error saving menu item:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      alert(
        language === "en"
          ? `Error saving item: ${errorMessage}`
          : `កំហុសក្នុងការរក្សាទុកធាតុ: ${errorMessage}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Upload icon component
  const UploadIcon = ({ className }: { className?: string }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 border border-gray-100 font-[Kantumruy_Pro]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#3F3F3F] to-[#2F2F2F] rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base">
          {editingItem ? "✏️" : "➕"}
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          {editingItem
            ? language === "en"
              ? "Edit Menu Item"
              : "កែសម្រួលមីនុយ"
            : language === "en"
            ? "Add New Menu Item"
            : "បន្ថែមមីនុយថ្មី"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Enhanced Image Upload Section */}
        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-0">
              {language === "en" ? "Item Images" : "រូបភាពធាតុ"}
              <span className="text-gray-500 ml-2">
                ({formData.images.length}/3{" "}
                {language === "en" ? "images" : "រូបភាព"})
              </span>
            </label>
          </div>

          {/* File Input */}
          <div className="space-y-3 mb-4">
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultipleImageUpload}
                disabled={uploading || formData.images.length >= 3}
                className="hidden"
                style={{ fontSize: "16px" }}
              />
            </div>
          </div>

          {uploading && (
            <div className="mt-3 sm:mt-4 mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300 shadow-lg"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-600 font-medium">
                  {language === "en" ? "Uploading..." : "កំពុងផ្ទុក..."}
                </p>
                <p className="text-xs font-bold text-gray-700">
                  {uploadProgress}%
                </p>
              </div>
            </div>
          )}

          {/* Image Grid with Kebab Menu */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Preview ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                />

                {/* Main Image Badge */}
                {formData.image_url === image && (
                  <div className="absolute top-1 left-1 bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs px-2 py-1 rounded-lg font-semibold shadow-lg z-10">
                    {language === "en" ? "Main" : "ចម្បង"}
                  </div>
                )}

                {/* Kebab Menu Button */}
                <div className="absolute top-1 right-1 z-20">
                  <button
                    type="button"
                    onClick={(e) => toggleKebabMenu(index, e)}
                    className="w-6 h-6 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-lg flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="6" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="12" cy="18" r="1.5" />
                    </svg>
                  </button>

                  {/* Kebab Menu Dropdown */}
                  {activeKebabIndex === index && (
                    <div
                      ref={kebabMenuRef}
                      className="absolute right-0 top-7 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[140px] z-30 animate-in fade-in-0 zoom-in-95"
                    >
                      {/* Set as Main Option */}
                      <button
                        type="button"
                        onClick={() => setAsMainImage(image)}
                        disabled={formData.image_url === image}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <svg
                          className="w-3 h-3 text-blue-500"
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
                        {language === "en" ? "Set as Main" : "ដាក់ជាចម្បង"}
                      </button>

                      {/* Remove Option */}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors duration-200"
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
                        {language === "en" ? "Remove" : "លុប"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Add Image Button */}
            {canAddMoreImages && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 transition"
                disabled={loading || uploading}
              >
                <UploadIcon className="w-8 h-8 mb-2" />
                <span className="text-sm">
                  {language === "en" ? "Add Images" : "បន្ថែមរូបភាព"}
                </span>
              </button>
            )}
          </div>

          {/* Mobile Touch Instructions */}
          {isMobile && formData.images.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-blue-600 text-center font-medium">
                {language === "en"
                  ? "Tap the ••• menu on each image to manage"
                  : "ចុចលើម៉ឺនុយ ••• លើរូបភាពនីមួយៗដើម្បីគ្រប់គ្រង"}
              </p>
            </div>
          )}

          <p className="text-xs text-gray-500 text-center">
            {language === "en"
              ? "Supported formats: JPG, PNG, WebP. Max size: 2MB per image. Maximum 3 images."
              : "ទម្រង់ដែលគាំទ្រ៖ JPG, PNG, WebP. ទំហំអតិបរមា៖ ២MB ក្នុងមួយរូបភាព។ អតិបរមា ៣ រូបភាព។"}
          </p>
        </div>

        {/* Rest of the form remains the same */}
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2 pl-1">
              {language === "en" ? "Name (English)" : "ផលិតផល (អង់គ្លេស)"}
            </label>
            <input
              type="text"
              required
              style={{ fontSize: "16px" }}
              value={formData.name_en}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name_en: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400 text-sm sm:text-base"
              placeholder={
                language === "en"
                  ? "Enter Product English"
                  : "បញ្ចូលផលិតផលជាភាសាអង់គ្លេស"
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2 pl-1">
              {language === "en" ? "Product (Khmer)" : "ផលិតផល (ខ្មែរ)"}
            </label>
            <input
              type="text"
              required
              style={{ fontSize: "16px" }}
              value={formData.name_kh}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name_kh: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400 text-sm sm:text-base"
              placeholder={
                language === "en"
                  ? "Enter Product Khmer"
                  : "បញ្ចូលផលិតផលជាភាសាខ្មែរ"
              }
            />
          </div>
        </div>

        {/* Description Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2 pl-1">
              {language === "en"
                ? "Description (English)"
                : "ពិពណ៌នា (អង់គ្លេស)"}
            </label>
            <textarea
              value={formData.description_en}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description_en: e.target.value,
                }))
              }
              rows={isMobile ? 2 : 3}
              style={{ fontSize: "16px" }}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400 resize-none text-sm sm:text-base"
              placeholder={
                language === "en"
                  ? "Enter English description"
                  : "បញ្ចូលការពិពណ៌នាជាភាសាអង់គ្លេស"
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2 pl-1">
              {language === "en" ? "Description (Khmer)" : "ពិពណ៌នា (ខ្មែរ)"}
            </label>
            <textarea
              value={formData.description_kh}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description_kh: e.target.value,
                }))
              }
              rows={isMobile ? 2 : 3}
              style={{ fontSize: "16px" }}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400 resize-none text-sm sm:text-base"
              placeholder={
                language === "en"
                  ? "Enter Khmer description"
                  : "បញ្ចូលការពិពណ៌នាជាភាសាខ្មែរ"
              }
            />
          </div>
        </div>

        {/* Price and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2 pl-1">
              {language === "en" ? "Price ($)" : "តម្លៃ ($)"}
            </label>
            <div className="relative">
              <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold text-sm sm:text-base">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                style={{ fontSize: "16px" }}
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4  py-2  border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400 text-sm sm:text-base"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2 pl-1">
              {language === "en" ? "Category" : "ប្រភេទ"}
            </label>
            <select
              required
              value={formData.category_id}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  category_id: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white appearance-none text-sm sm:text-base"
            >
              <option value="">
                {language === "en" ? "Select Category" : "ជ្រើសរើសប្រភេទ"}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {language === "en" ? category.name_en : category.name_kh}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-3 sm:pt-4">
          <button
            type="submit"
            disabled={loading || uploading}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-br from-[#3F3F3F] to-[#2F2F2F] text-white px-3 py-2 rounded-xl hover:from-[#2F2F2F] hover:to-[#1F1F1F] focus:outline-none focus:ring-2 focus:ring-[#3F3F3F] focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base"
          >
            {loading ? (
              <>
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {language === "en" ? "Saving..." : "កំពុងរក្សាទុក..."}
              </>
            ) : editingItem ? (
              <>
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4"
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
                {language === "en" ? "Update Item" : "ធ្វើបច្ចុប្បន្នភាពធាតុ"}
              </>
            ) : (
              <>
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4"
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
                {language === "en" ? "Add Item" : "បន្ថែមមីនុយ"}
              </>
            )}
          </button>

          {editingItem && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading || uploading}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700 py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl hover:from-gray-400 hover:to-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base"
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
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
          )}
        </div>
      </form>
    </div>
  );
}
