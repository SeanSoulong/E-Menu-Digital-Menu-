"use client";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/LoginForm";
import AdminDashboard from "../components/AdminDashboard";
import { useLanguage } from "../context/LanguageContext";

// Add these exports to disable static generation and force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminPage() {
  const { user, loading } = useAuth();
  const { language } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center font-[Kantumruy_Pro]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3F3F3F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
