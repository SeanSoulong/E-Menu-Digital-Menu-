import { useLanguage } from "../../context/LanguageContext";

interface EmptyStateProps {
  onClearFilters: () => void;
}

export default function EmptyState({ onClearFilters }: EmptyStateProps) {
  const { language } = useLanguage();

  return (
    <div className="text-center py-8 md:py-12">
      <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 md:w-12 md:h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <div className="text-gray-500 max-w-sm mx-auto px-4">
        <p className="text-base md:text-lg font-medium mb-2">
          {language === "en" ? "No menu items found" : "មិនមានធាតុមីនុយណាមួយទេ"}
        </p>
        <p className="text-xs md:text-sm">
          {language === "en"
            ? "Add your first item using the form to get started."
            : "បន្ថែមធាតុដំបូងរបស់អ្នកដោយប្រើទម្រង់ដើម្បីចាប់ផ្តើម។"}
        </p>
      </div>
    </div>
  );
}
