"use client";
import { Product } from "../../data/types";
import Image from "next/image";
import {
  FaTimes,
  FaFacebookF,
  FaTelegramPlane,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, A11y } from "swiper/modules";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

interface ProductDetailPopupProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetailPopup({
  product,
  onClose,
}: ProductDetailPopupProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();

  if (!product) return null;

  // Use theme settings for social links (same as footer)
  const facebookUrl =
    theme.socialFacebookUrl ||
    "https://www.facebook.com/profile.php?id=100004264842600";
  const telegramUrl = theme.socialTelegramUrl || "https://t.me/sothimaktey";
  const instagramUrl = theme.socialInstagramUrl || "https://instagram.com";
  const tiktokUrl = theme.socialTiktokUrl || "https://tiktok.com";

  // Static links (can be moved to theme settings later)
  const mapUrl = "https://maps.app.goo.gl/9xi5jv778zCMV5gs8";
  const phoneUrl = `tel:${product.contact || "098253453"}`;

  // Get the main product image (first image or main image)
  const productImageUrl = product.images?.[0] || product.image;

  // Create Telegram message with product details AND image
  const getTelegramMessage = () => {
    const productName = product.name[language];
    const productPrice = `${product.priceUsd} / ${product.priceKhr}`;
    const productDescription = product.description[language];

    // Create a beautiful formatted message
    const message =
      language === "en"
        ? `🛍️ *NEW ORDER REQUEST* 🛍️\n\n` +
          `📦 *Product:* ${productName}\n` +
          `💰 *Price:* ${productPrice}\n` +
          `📝 *Description:* ${productDescription.substring(0, 100)}${
            productDescription.length > 100 ? "..." : ""
          }\n\n` +
          `🔗 *Product Link:* ${window.location.href}\n\n` +
          `👤 *Customer:* Waiting for customer info...\n` +
          `📅 *Date:* ${new Date().toLocaleString()}\n\n` +
          `_Please reply to this message to confirm the order._`
        : `🛍️ *សំណើបញ្ជាទិញថ្មី* 🛍️\n\n` +
          `📦 *ផលិតផល:* ${productName}\n` +
          `💰 *តម្លៃ:* ${productPrice}\n` +
          `📝 *ការពិពណ៌នា:* ${productDescription.substring(0, 100)}${
            productDescription.length > 100 ? "..." : ""
          }\n\n` +
          `🔗 *តំណភ្ជាប់ផលិតផល:* ${window.location.href}\n\n` +
          `👤 *អតិថិជន:* កំពុងរង់ចាំព័ត៌មាន...\n` +
          `📅 *កាលបរិច្ឆេទ:* ${new Date().toLocaleString()}\n\n` +
          `_សូមឆ្លើយតបទៅកាន់សារនេះដើម្បីបញ្ជាក់ការបញ្ជាទិញ._`;

    return encodeURIComponent(message);
  };

  // Extract username from telegram URL
  const getTelegramUsername = (url: string) => {
    if (url.includes("t.me/")) {
      return url.split("t.me/")[1];
    }
    return "sothimaktey";
  };

  const telegramUsername = getTelegramUsername(telegramUrl);

  // Create Telegram URL with message
  const telegramOrderUrl = `https://t.me/${telegramUsername}?text=${getTelegramMessage()}`;

  // Alternative: Create a share URL that includes image (works with Telegram Web)
  const shareToTelegram = () => {
    if (product.is_available) {
      // For mobile devices, open Telegram app directly
      const mobileTelegramUrl = `tg://msg?text=${getTelegramMessage()}`;

      // Check if on mobile
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        // Try to open Telegram app first
        window.open(mobileTelegramUrl, "_blank");

        // Fallback to web version after short delay
        setTimeout(() => {
          window.open(telegramOrderUrl, "_blank");
        }, 500);
      } else {
        // Desktop - open web version
        window.open(telegramOrderUrl, "_blank");
      }
    }
  };

  const handleOrder = () => {
    shareToTelegram();
  };

  // Function to copy image URL to clipboard
  const copyImageUrl = async () => {
    try {
      await navigator.clipboard.writeText(productImageUrl);
      alert(
        language === "en"
          ? "Image URL copied! You can paste it in Telegram."
          : "ចម្លង URL រូបភាពរួចរាល់! អ្នកអាចបិទភ្ជាប់ក្នុង Telegram ។"
      );
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/50 backdrop-blur-sm font-[Kantumruy_Pro]">
      <div
        className="rounded-2xl shadow-2xl p-4 md:p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
        style={{
          backgroundColor: theme.cardBackgroundColor,
          color: theme.textColor,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 z-10 hover:bg-gray-100 p-2 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-lg"
          style={{
            backgroundColor: theme.cardBackgroundColor,
            color: theme.textColorSecondary,
          }}
        >
          <FaTimes size={18} className="md:w-5 md:h-5" />
        </button>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Product Image Carousel */}
          <div className="lg:w-1/2 flex justify-center relative">
            <Swiper
              modules={[Pagination, A11y]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              className="w-full h-full"
            >
              {product.images?.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="flex items-center justify-center h-full relative">
                    <Image
                      src={image}
                      alt={product.name[language]}
                      width={500}
                      height={400}
                      unoptimized
                      className={`rounded-lg object-cover w-full h-auto max-h-80 md:max-h-96 lg:max-h-[400px] border ${
                        !product.is_available ? "opacity-90" : ""
                      }`}
                      style={{ borderColor: `${theme.primaryColor}30` }}
                    />
                    {/* Out of Stock Overlay on Image */}
                    {!product.is_available && (
                      <div
                        className="absolute top-4 right-4 text-white px-3 py-1 rounded-lg text-sm font-bold"
                        style={{ backgroundColor: theme.secondaryColor }}
                      >
                        {language === "en" ? "Out of Stock" : "អស់ស្តុក"}
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 flex flex-col justify-start">
            {/* Out of Stock Warning */}
            {!product.is_available && (
              <div
                className="border rounded-xl p-4 mb-4"
                style={{
                  backgroundColor: `${theme.secondaryColor}10`,
                  borderColor: `${theme.secondaryColor}30`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FaExclamationTriangle
                    style={{ color: theme.secondaryColor }}
                  />
                  <span
                    className="font-semibold"
                    style={{ color: theme.secondaryColor }}
                  >
                    {language === "en" ? "Out of Stock" : "អស់ស្តុក"}
                  </span>
                </div>
                <p
                  className="text-sm"
                  style={{ color: theme.textColorSecondary }}
                >
                  {language === "en"
                    ? "This item is currently unavailable for ordering. You can contact us to pre-order."
                    : "ផលិតផលនេះមិនអាចបញ្ជាទិញបាននាពេលនេះទេ។ អ្នកអាចទាក់ទងមកពួកយើងដើម្បីធ្វើការ​ pre-order បាន។"}
                </p>
              </div>
            )}

            <div className="mb-4 md:mb-6">
              <h2
                className={`text-[16px] md:text-[18px] lg:text-[20px] font-bold mb-2 md:mb-3 leading-tight truncate max-w-full ${
                  !product.is_available ? "opacity-70" : ""
                }`}
                style={{
                  color: !product.is_available
                    ? theme.textColorSecondary
                    : theme.textColor,
                  fontFamily: theme.headingFontFamily,
                }}
              >
                {product.name[language]}
              </h2>

              <div
                className="leading-relaxed space-y-1 md:space-y-2 mb-3 md:mb-4"
                style={{ color: theme.textColorSecondary }}
              >
                {product.description[language]
                  .split("\n")
                  .map((line, index) => (
                    <p key={index} className="text-[13px] md:text-[14px]">
                      {line}
                    </p>
                  ))}
              </div>

              <div
                className="flex items-center justify-between mt-2 p-3 rounded-lg"
                style={{ backgroundColor: `${theme.primaryColor}10` }}
              >
                <span
                  className="text-base md:text-lg font-bold truncate max-w-[150px] md:max-w-[200px]"
                  style={{
                    color: !product.is_available
                      ? theme.textColorSecondary
                      : theme.primaryColor,
                  }}
                >
                  {product.priceKhr}
                </span>

                <span
                  className="text-xs md:text-sm truncate max-w-[80px] md:max-w-[100px]"
                  style={{ color: theme.textColorSecondary }}
                >
                  {product.priceUsd}
                </span>
              </div>
            </div>

            {/* Order Button - Opens Telegram with product info */}
            {product.is_available && (
              <div className="space-y-2 mb-4">
                <button
                  onClick={handleOrder}
                  className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <FaTelegramPlane size={18} />
                  {language === "en"
                    ? "Order on Telegram"
                    : "បញ្ជាទិញតាម Telegram"}
                </button>

                {/* Optional: Button to copy image URL */}
                <button
                  onClick={copyImageUrl}
                  className="w-full py-2 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: `${theme.primaryColor}10`,
                    color: theme.textColorSecondary,
                  }}
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
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                  {language === "en" ? "Copy Image URL" : "ចម្លង URL រូបភាព"}
                </button>
              </div>
            )}

            {/* Contact / Social - Using theme settings (same as footer) */}
            <div
              className="mt-auto pt-4 md:pt-6 border-t"
              style={{ borderColor: `${theme.primaryColor}20` }}
            >
              <p
                className="text-sm font-semibold mb-3 md:mb-4"
                style={{ color: theme.textColor }}
              >
                {language === "en"
                  ? "Contact us:"
                  : "បញ្ជាទិញដោយទំនាក់ទំនងពួកយើង៖"}
              </p>
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                {/* Facebook - from theme */}
                {theme.showSocialLinks && facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white p-2 md:p-3 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-lg flex items-center justify-center"
                    style={{ backgroundColor: "#1877F2" }}
                    aria-label="Facebook Page"
                  >
                    <FaFacebookF size={16} className="md:w-4 md:h-4" />
                  </a>
                )}

                {/* Telegram - from theme */}
                {theme.showSocialLinks && telegramUrl && (
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white p-2 md:p-3 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-lg flex items-center justify-center"
                    style={{ backgroundColor: "#26A5E4" }}
                    aria-label="Telegram Account"
                  >
                    <FaTelegramPlane size={16} className="md:w-4 md:h-4" />
                  </a>
                )}

                {/* Instagram - from theme */}
                {theme.showSocialLinks && instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white p-2 md:p-3 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-lg flex items-center justify-center"
                    style={{ backgroundColor: "#E4405F" }}
                    aria-label="Instagram"
                  >
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                )}

                {/* TikTok - from theme */}
                {theme.showSocialLinks && tiktokUrl && (
                  <a
                    href={tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white p-2 md:p-3 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-lg flex items-center justify-center"
                    style={{ backgroundColor: "#000000" }}
                    aria-label="TikTok"
                  >
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 008.88-5.13v-7a10.46 10.46 0 004.5.94z" />
                    </svg>
                  </a>
                )}

                {/* Map Location - Static */}
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white p-2 md:p-3 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: "#34A853" }}
                  aria-label="Find on Map"
                >
                  <FaMapMarkerAlt size={16} className="md:w-4 md:h-4" />
                </a>

                {/* Phone - Static */}
                <a
                  href={phoneUrl}
                  className="text-white p-2 md:p-3 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-lg flex items-center gap-1 md:gap-2"
                  style={{ backgroundColor: "#EA4335" }}
                  aria-label="Call Us"
                >
                  <FaPhoneAlt size={14} className="md:w-4 md:h-4" />
                  <span className="text-xs md:text-sm font-semibold truncate max-w-[80px] md:max-w-[100px]">
                    {product.contact}
                  </span>
                </a>
              </div>
              <p
                className="text-xs mt-3"
                style={{ color: theme.textColorSecondary }}
              >
                {language === "en"
                  ? "Contact us for more information about this product"
                  : "ទាក់ទងមកយើងខ្ញុំសម្រាប់ព័ត៌មានបន្ថែមអំពីផលិតផលនេះ"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
