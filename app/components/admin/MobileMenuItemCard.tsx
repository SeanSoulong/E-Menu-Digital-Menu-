import { MenuItem } from "../../data/types";
import { useLanguage } from "../../context/LanguageContext";

interface MobileMenuItemCardProps {
  menuItems: MenuItem[];
  editingItem: MenuItem | null;
  screenSize: "mobile" | "tablet" | "desktop";
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (item: MenuItem) => void;
  onOpenImagePreview: (
    imageUrl: string,
    allImages: string[],
    index: number
  ) => void;
}

export default function MobileMenuItemCard({
  menuItems,
  editingItem,
  screenSize,
  onEdit,
  onDelete,
  onToggleAvailability,
  onOpenImagePreview,
}: MobileMenuItemCardProps) {
  const { language } = useLanguage();

  return (
    <div className="divide-y divide-gray-200">
      {menuItems.map((item) => (
        <div
          key={item.id}
          className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
            editingItem?.id === item.id
              ? "bg-blue-50 border-l-4 border-l-blue-500"
              : ""
          }`}
        >
          <div className="flex items-start gap-3 mb-3">
            {item.image_url && (
              <img
                src={item.image_url}
                alt={language === "en" ? item.name_en : item.name_kh}
                width={64}
                height={64}
                className="h-16 w-16 rounded-xl object-cover border border-gray-200 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => {
                  const allImages =
                    item.images && item.images.length > 0
                      ? item.images
                      : [item.image_url];
                  onOpenImagePreview(
                    item.image_url!,
                    allImages.filter((img): img is string => img !== null),
                    0
                  );
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {language === "en" ? item.name_en : item.name_kh}
                </h3>
                <div className="text-sm font-bold text-gray-900 ml-2 flex-shrink-0">
                  ${item.price.toFixed(2)}
                </div>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                {language === "en" ? item.description_en : item.description_kh}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {language === "en"
                    ? item.categories?.name_en
                    : item.categories?.name_kh}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                    item.stock_quantity === 0
                      ? "bg-red-100 text-red-800"
                      : item.stock_quantity <= 5
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  📦 {item.stock_quantity}
                </span>
                <button
                  onClick={() => onToggleAvailability(item)}
                  className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    item.is_available && item.stock_quantity > 0
                      ? "bg-gradient-to-br from-green-500 to-green-600 text-white"
                      : "bg-gradient-to-br from-red-500 to-red-600 text-white"
                  }`}
                >
                  {item.is_available && item.stock_quantity > 0
                    ? language === "en"
                      ? "InStock"
                      : "មានក្នុងស្តុក"
                    : language === "en"
                    ? "OutStock"
                    : "អស់ស្តុក"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex -space-x-2">
              {item.images &&
                item.images
                  .slice(0, screenSize === "mobile" ? 2 : 3)
                  .map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${
                        language === "en" ? item.name_en : item.name_kh
                      } ${index + 1}`}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-lg border-2 border-white object-cover shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        const allImages =
                          item.images || [item.image_url].filter(Boolean);
                        onOpenImagePreview(image, allImages, index);
                      }}
                    />
                  ))}
              {item.images &&
                item.images.length > (screenSize === "mobile" ? 2 : 3) && (
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 border-2 border-white flex items-center justify-center text-xs font-medium text-white shadow-sm">
                    +{item.images.length - (screenSize === "mobile" ? 2 : 3)}
                  </div>
                )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(item)}
                className={`text-blue-600 hover:text-blue-800 transition-colors duration-200 p-2 rounded-lg ${
                  editingItem?.id === item.id ? "bg-blue-100" : "bg-blue-50"
                }`}
                title={language === "en" ? "Edit" : "កែសម្រួល"}
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="text-red-600 hover:text-red-800 transition-colors duration-200 p-2 bg-red-50 rounded-lg"
                title={language === "en" ? "Delete" : "លុប"}
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
