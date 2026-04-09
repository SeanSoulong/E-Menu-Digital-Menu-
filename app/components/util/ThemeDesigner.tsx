"use client";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import {
  ChevronDownIcon,
  PaintBrushIcon,
  Squares2X2Icon,
  PhotoIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/solid";

type TabType = "colors" | "layout" | "header" | "custom";

export default function ThemeDesigner() {
  const { theme, updateTheme, resetTheme, loading } = useTheme();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>("colors");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleColorChange = (key: keyof typeof theme, value: string) => {
    updateTheme({ [key]: value });
  };

  const handleNumberChange = (key: keyof typeof theme, value: number) => {
    updateTheme({ [key]: value });
  };

  const handleSelectChange = (key: keyof typeof theme, value: string) => {
    updateTheme({ [key]: value });
  };

  const handleCSSChange = (value: string) => {
    updateTheme({ customCSS: value });
  };

  const handleReset = async () => {
    await resetTheme();
    setShowResetConfirm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-[#0E4123] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
            <PaintBrushIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {language === "en" ? "Theme Designer" : "អ្នករចនាប្រធានបទ"}
            </h3>
            <p className="text-xs text-gray-500">
              {language === "en"
                ? "Customize your menu page appearance"
                : "កែប្រែរូបរាងទំព័រមីនុយរបស់អ្នក"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
        {[
          {
            id: "colors",
            label: language === "en" ? "Colors" : "ពណ៌",
            icon: <PaintBrushIcon className="w-4 h-4" />,
          },
          {
            id: "layout",
            label: language === "en" ? "Layout" : "ប្លង់",
            icon: <Squares2X2Icon className="w-4 h-4" />,
          },
          {
            id: "header",
            label: language === "en" ? "Header/Footer" : "ក្បាល/បាត",
            icon: <PhotoIcon className="w-4 h-4" />,
          },
          {
            id: "custom",
            label: language === "en" ? "Custom CSS" : "CSS ផ្ទាល់ខ្លួន",
            icon: <CodeBracketIcon className="w-4 h-4" />,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "border-[#0E4123] text-[#0E4123] bg-white"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 max-h-[500px] overflow-y-auto">
        {/* Colors Tab */}
        {activeTab === "colors" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === "en" ? "Primary Color" : "ពណ៌ចម្បង"}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) =>
                    handleColorChange("primaryColor", e.target.value)
                  }
                  className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                />
                <input
                  type="text"
                  value={theme.primaryColor}
                  onChange={(e) =>
                    handleColorChange("primaryColor", e.target.value)
                  }
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === "en" ? "Secondary Color" : "ពណ៌បន្ទាប់បន្សំ"}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) =>
                    handleColorChange("secondaryColor", e.target.value)
                  }
                  className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                />
                <input
                  type="text"
                  value={theme.secondaryColor}
                  onChange={(e) =>
                    handleColorChange("secondaryColor", e.target.value)
                  }
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === "en" ? "Accent Color" : "ពណ៌សង្កត់សំឡេង"}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={theme.accentColor}
                  onChange={(e) =>
                    handleColorChange("accentColor", e.target.value)
                  }
                  className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                />
                <input
                  type="text"
                  value={theme.accentColor}
                  onChange={(e) =>
                    handleColorChange("accentColor", e.target.value)
                  }
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {language === "en" ? "Background Color" : "ពណ៌ផ្ទៃខាងក្រោយ"}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.backgroundColor}
                    onChange={(e) =>
                      handleColorChange("backgroundColor", e.target.value)
                    }
                    className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={theme.backgroundColor}
                    onChange={(e) =>
                      handleColorChange("backgroundColor", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {language === "en" ? "Card Background" : "ពណ៌ផ្ទៃខាងក្រោយកាត"}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.cardBackgroundColor}
                    onChange={(e) =>
                      handleColorChange("cardBackgroundColor", e.target.value)
                    }
                    className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={theme.cardBackgroundColor}
                    onChange={(e) =>
                      handleColorChange("cardBackgroundColor", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {language === "en" ? "Text Color" : "ពណ៌អក្សរ"}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.textColor}
                    onChange={(e) =>
                      handleColorChange("textColor", e.target.value)
                    }
                    className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={theme.textColor}
                    onChange={(e) =>
                      handleColorChange("textColor", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {language === "en"
                    ? "Secondary Text"
                    : "ពណ៌អក្សរបន្ទាប់បន្សំ"}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.textColorSecondary}
                    onChange={(e) =>
                      handleColorChange("textColorSecondary", e.target.value)
                    }
                    className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={theme.textColorSecondary}
                    onChange={(e) =>
                      handleColorChange("textColorSecondary", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === "en" ? "Font Family" : "ប្រភេទពុម្ពអក្សរ"}
              </label>
              <select
                value={theme.fontFamily}
                onChange={(e) =>
                  handleSelectChange("fontFamily", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Kantumruy Pro, sans-serif">Kantumruy Pro</option>
                <option value="Inter, sans-serif">Inter</option>
                <option value="Roboto, sans-serif">Roboto</option>
                <option value="Poppins, sans-serif">Poppins</option>
                <option value="system-ui, sans-serif">System Default</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === "en" ? "Heading Font" : "ពុម្ពអក្សរចំណងជើង"}
              </label>
              <select
                value={theme.headingFontFamily}
                onChange={(e) =>
                  handleSelectChange("headingFontFamily", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Kantumruy Pro, sans-serif">Kantumruy Pro</option>
                <option value="Inter, sans-serif">Inter</option>
                <option value="Roboto, sans-serif">Roboto</option>
                <option value="Poppins, sans-serif">Poppins</option>
              </select>
            </div>
          </div>
        )}

        {/* Layout Tab */}
        {activeTab === "layout" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {language === "en" ? "Card Border Radius" : "កម្រិតមូលកាត"}{" "}
                  (px)
                </label>
                <input
                  type="range"
                  min="0"
                  max="32"
                  value={theme.cardBorderRadius}
                  onChange={(e) =>
                    handleNumberChange(
                      "cardBorderRadius",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600 mt-1">
                  {theme.cardBorderRadius}px
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {language === "en"
                    ? "Button Border Radius"
                    : "កម្រិតមូលប៊ូតុង"}{" "}
                  (px)
                </label>
                <input
                  type="range"
                  min="0"
                  max="32"
                  value={theme.buttonBorderRadius}
                  onChange={(e) =>
                    handleNumberChange(
                      "buttonBorderRadius",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600 mt-1">
                  {theme.buttonBorderRadius}px
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === "en" ? "Products Per Row" : "ផលិតផលក្នុងមួយជួរ"}
              </label>
              <div className="flex gap-3">
                {(["2", "3", "4"] as const).map((value) => (
                  <button
                    key={value}
                    onClick={() => handleSelectChange("productsPerRow", value)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      theme.productsPerRow === value
                        ? "bg-[#0E4123] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  {language === "en"
                    ? "Show Category Icons"
                    : "បង្ហាញរូបតំណាងប្រភេទ"}
                </span>
                <button
                  onClick={() =>
                    updateTheme({ showCategoryIcons: !theme.showCategoryIcons })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    theme.showCategoryIcons ? "bg-[#0E4123]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      theme.showCategoryIcons
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </label>

              <label className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  {language === "en" ? "Show Search Bar" : "បង្ហាញរបារស្វែងរក"}
                </span>
                <button
                  onClick={() =>
                    updateTheme({ showSearchBar: !theme.showSearchBar })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    theme.showSearchBar ? "bg-[#0E4123]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      theme.showSearchBar ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>
        )}

        {/* Header/Footer Tab */}
        {activeTab === "header" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === "en"
                  ? "Header Image URL"
                  : "URL រូបភាពក្បាលទំព័រ"}
              </label>
              <input
                type="url"
                value={theme.headerImageUrl || ""}
                onChange={(e) =>
                  handleSelectChange("headerImageUrl", e.target.value)
                }
                placeholder="https://example.com/header.jpg"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
              {theme.headerImageUrl && (
                <div className="mt-2">
                  <img
                    src={theme.headerImageUrl}
                    alt="Header preview"
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === "en" ? "Footer Text" : "អត្ថបទបាតទំព័រ"}
              </label>
              <textarea
                value={theme.footerText}
                onChange={(e) =>
                  handleSelectChange("footerText", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === "en" ? "Facebook URL" : "តំណ Facebook"}
              </label>
              <input
                type="url"
                value={theme.socialFacebookUrl || ""}
                onChange={(e) =>
                  handleSelectChange("socialFacebookUrl", e.target.value)
                }
                placeholder="https://facebook.com/yourpage"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === "en" ? "Telegram URL" : "តំណ Telegram"}
              </label>
              <input
                type="url"
                value={theme.socialTelegramUrl || ""}
                onChange={(e) =>
                  handleSelectChange("socialTelegramUrl", e.target.value)
                }
                placeholder="https://t.me/yourusername"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === "en" ? "Instagram URL" : "តំណ Instagram"}
              </label>
              <input
                type="url"
                value={theme.socialInstagramUrl || ""}
                onChange={(e) =>
                  handleSelectChange("socialInstagramUrl", e.target.value)
                }
                placeholder="https://instagram.com/yourpage"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === "en" ? "TikTok URL" : "តំណ TikTok"}
              </label>
              <input
                type="url"
                value={theme.socialTiktokUrl || ""}
                onChange={(e) =>
                  handleSelectChange("socialTiktokUrl", e.target.value)
                }
                placeholder="https://tiktok.com/@yourpage"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>

            <label className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                {language === "en"
                  ? "Show Social Links"
                  : "បង្ហាញតំណភ្ជាប់សង្គម"}
              </span>
              <button
                onClick={() =>
                  updateTheme({ showSocialLinks: !theme.showSocialLinks })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  theme.showSocialLinks ? "bg-[#0E4123]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    theme.showSocialLinks ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
          </div>
        )}

        {/* Custom CSS Tab */}
        {activeTab === "custom" && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === "en" ? "Custom CSS" : "CSS ផ្ទាល់ខ្លួន"}
            </label>
            <textarea
              value={theme.customCSS}
              onChange={(e) => handleCSSChange(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono resize-none"
              placeholder={`/* Add your custom CSS here */
.example-class {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

#product-card:hover {
  transform: translateY(-4px);
  transition: transform 0.3s ease;
}`}
            />
            <p className="text-xs text-gray-500 mt-2">
              {language === "en"
                ? "Add custom CSS to override any styles. Use classes like .product-card, .category-button, etc."
                : "បន្ថែម CSS ផ្ទាល់ខ្លួនដើម្បីកែប្រែរចនាប័ទ្ម។ ប្រើក្លាសដូចជា .product-card, .category-button ។ល។"}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3">
        <button
          onClick={() => setShowResetConfirm(true)}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
        >
          {language === "en" ? "Reset to Default" : "កំណត់ឡើងវិញ"}
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4">
            <h4 className="text-lg font-bold text-gray-900 mb-2">
              {language === "en" ? "Reset Theme?" : "កំណត់ប្រធានបទឡើងវិញ?"}
            </h4>
            <p className="text-gray-600 text-sm mb-6">
              {language === "en"
                ? "This will reset all theme settings to default. This action cannot be undone."
                : "សកម្មភាពនេះនឹងកំណត់ការកំណត់ប្រធានបទទាំងអស់ឡើងវិញ។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។"}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700"
              >
                {language === "en" ? "Reset" : "កំណត់ឡើងវិញ"}
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300"
              >
                {language === "en" ? "Cancel" : "បោះបង់"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
