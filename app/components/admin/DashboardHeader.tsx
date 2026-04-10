import { useLanguage } from "../../context/LanguageContext";
import LanguageSwitcher from "../util/LanguageSwitcher";
import Link from "next/link";
import { PaintBrushIcon } from "@heroicons/react/24/solid";

interface DashboardHeaderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  onSignOut: () => void;
  onToggleThemeDesigner: () => void;
  showThemeDesigner: boolean;
}

export default function DashboardHeader({
  user,
  onSignOut,
  onToggleThemeDesigner,
}: DashboardHeaderProps) {
  const { language } = useLanguage();

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-8 p-4 md:p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="mb-4 lg:mb-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#0E4123] rounded-xl flex items-center justify-center text-white font-bold text-sm md:text-lg">
              E
            </div>
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                {language === "en" ? "Admin Panel" : "ផ្ទាំងគ្រប់គ្រង"}
              </h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2 text-sm md:text-base">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                {language === "en" ? "Logged in as:" : "ចូលជា:"} {user?.email}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 bg-white text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:shadow-md font-medium text-sm md:text-base"
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            {language === "en" ? "View Menu" : "មើលមីនុយ"}
          </Link>
          <button
            onClick={onToggleThemeDesigner}
            className="flex items-center justify-center gap-2 bg-gradient-to-br from-purple-500 to-pink-500 text-white px-3 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium text-sm md:text-base"
          >
            <PaintBrushIcon className="w-4 h-4" />
            {language === "en" ? "Customize Theme" : "កែប្រែប្រធានបទ"}
          </button>
          <button
            onClick={onSignOut}
            className="flex items-center justify-center gap-2 border border-red-500 bg-red-50 text-gray-700 px-3 py-2 rounded-xl font-medium text-sm md:text-base"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {language === "en" ? "Sign Out" : "ចាកចេញ"}
          </button>
        </div>
      </div>
    </>
  );
}
