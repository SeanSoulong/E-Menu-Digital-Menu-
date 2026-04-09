import { MenuItem } from "../../data/types";
import { useLanguage } from "../../context/LanguageContext";

interface DesktopMenuItemTableProps {
  menuItems: MenuItem[];
  editingItem: MenuItem | null;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (item: MenuItem) => void;
  onOpenImagePreview: (
    imageUrl: string,
    allImages: string[],
    index: number
  ) => void;
}

export default function DesktopMenuItemTable({
  menuItems,
  editingItem,
  onEdit,
  onDelete,
  onToggleAvailability,
  onOpenImagePreview,
}: DesktopMenuItemTableProps) {
  const { language } = useLanguage();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              {language === "en" ? "Item" : "ធាតុ"}
            </th>
            <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              {language === "en" ? "Price" : "តម្លៃ"}
            </th>
            <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              {language === "en" ? "Category" : "ប្រភេទ"}
            </th>
            <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              {language === "en" ? "Images" : "រូបភាព"}
            </th>
            <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              {language === "en" ? "Status" : "ស្ថានភាព"}
            </th>
            <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              {language === "en" ? "Actions" : "សកម្មភាព"}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {menuItems.map((item) => (
            <tr
              key={item.id}
              className={`hover:bg-gray-50 transition-colors duration-200 ${
                editingItem?.id === item.id
                  ? "bg-blue-50 border-l-4 border-l-blue-500"
                  : ""
              }`}
            >
              <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={language === "en" ? item.name_en : item.name_kh}
                      width={48}
                      height={48}
                      className="h-10 md:h-12 w-10 md:w-12 rounded-xl object-cover mr-3 md:mr-4 border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        const allImages =
                          item.images && item.images.length > 0
                            ? item.images
                            : [item.image_url];
                        onOpenImagePreview(
                          item.image_url!,
                          allImages.filter(
                            (img): img is string => img !== null
                          ),
                          0
                        );
                      }}
                    />
                  )}
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                      {language === "en" ? item.name_en : item.name_kh}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-2 max-w-[200px]">
                      {language === "en"
                        ? item.description_en
                        : item.description_kh}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-gray-900">
                  ${item.price.toFixed(2)}
                </div>
              </td>
              <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {language === "en"
                    ? item.categories?.name_en
                    : item.categories?.name_kh}
                </span>
              </td>
              <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                <div className="flex -space-x-1 md:-space-x-2">
                  {item.images &&
                    item.images.slice(0, 3).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${
                          language === "en" ? item.name_en : item.name_kh
                        } ${index + 1}`}
                        width={32}
                        height={32}
                        className="h-8 w-8 md:h-10 md:w-10 rounded-xl border-2 border-white object-cover shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          const allImages =
                            item.images || [item.image_url].filter(Boolean);
                          onOpenImagePreview(image, allImages, index);
                        }}
                      />
                    ))}
                  {item.images && item.images.length > 3 && (
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 border-2 border-white flex items-center justify-center text-xs font-medium text-white shadow-sm">
                      +{item.images.length - 3}
                    </div>
                  )}
                  {(!item.images || item.images.length === 0) &&
                    item.image_url && (
                      <img
                        src={item.image_url}
                        alt={language === "en" ? item.name_en : item.name_kh}
                        width={32}
                        height={32}
                        className="h-8 w-8 md:h-10 md:w-10 rounded-xl border-2 border-white object-cover shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => {
                          onOpenImagePreview(
                            item.image_url!,
                            [item.image_url!],
                            0
                          );
                        }}
                      />
                    )}
                </div>
              </td>
              <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => onToggleAvailability(item)}
                  className={`inline-flex items-center px-3 md:px-4 py-1 md:py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
                    item.is_available
                      ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl"
                      : "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  {item.is_available
                    ? language === "en"
                      ? "InStock"
                      : "មានក្នុងស្តុក"
                    : language === "en"
                    ? "OutStock"
                    : "អស់ស្តុក"}
                </button>
              </td>
              <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 md:space-x-3">
                <button
                  onClick={() => onEdit(item)}
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 flex items-center gap-1 text-xs md:text-sm"
                >
                  <svg
                    className="w-3 h-3 md:w-4 md:h-4"
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
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 hover:text-red-800 font-semibold transition-colors duration-200 flex items-center gap-1 text-xs md:text-sm"
                >
                  <svg
                    className="w-3 h-3 md:w-4 md:h-4"
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
