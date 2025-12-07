"use client";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/LoginForm";
import AdminDashboard from "../components/AdminDashboard";
import { useLanguage } from "../context/LanguageContext";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const { language } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E5E7EB] flex items-center justify-center font-[Kantumruy_Pro]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#70A2EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">
            {language === "en" ? "Loading..." : "កំពុងផ្ទុក..."}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return <AdminDashboard />;
}
