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
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, A11y } from "swiper/modules";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { useState, useRef } from "react";

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
  const [quantity, setQuantity] = useState(1);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (!product) return null;

  // Use theme settings for social links
  const facebookUrl =
    theme.socialFacebookUrl ||
    "https://www.facebook.com/profile.php?id=100004264842600";
  const telegramUrl = theme.socialTelegramUrl || "https://t.me/sothimaktey";

  // Static links
  const mapUrl = "https://maps.app.goo.gl/9xi5jv778zCMV5gs8";
  const phoneUrl = `tel:${product.contact || "098253453"}`;

  // Calculate total price
  const calculateTotalPrice = () => {
    const priceUSD = parseFloat(product.priceUsd.replace("$", ""));
    const priceKHR = parseFloat(
      product.priceKhr.replace("៛", "").replace(/,/g, "")
    );
    return {
      usd: (priceUSD * quantity).toFixed(2),
      khr: (priceKHR * quantity).toLocaleString(),
    };
  };

  const totalPrice = calculateTotalPrice();

  // Handle quantity change
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  // Extract username from telegram URL
  const getTelegramUsername = (url: string) => {
    if (url.includes("t.me/")) {
      return url.split("t.me/")[1];
    }
    return "sothimaktey";
  };

  const telegramUsername = getTelegramUsername(telegramUrl);

  // Create the order message (plain text, no special encoding issues)
  const getOrderMessage = () => {
    const productName = product.name[language];
    const totalPriceFormatted = `$${totalPrice.usd} / ៛${totalPrice.khr}`;
    const statusLabel = !product.is_available ? " [PRE-ORDER]" : "";
    const header =
      language === "en" ? "🛒 ORDER DETAILS" : "🛒 ព័ត៌មានការកុម្ម៉ង់";

    return `
${header}${statusLabel}
---------------------------
📦 ${language === "en" ? "Product" : "ផលិតផល"}: ${productName}
🔢 ${language === "en" ? "Quantity" : "បរិមាណ"}: ${quantity}
💵 ${language === "en" ? "Total" : "តម្លៃសរុប"}: ${totalPriceFormatted}

📍 ${language === "en" ? "Link" : "តំណភ្ជាប់"}: ${window.location.href}
⏰ ${new Date().toLocaleString()}
---------------------------
${
  language === "en"
    ? "Please confirm my order. Thanks!"
    : "សូមជួយបញ្ជាក់ការបញ្ជាទិញរបស់ខ្ញុំ។ អរគុណ!"
}
`.trim();
  };
  // Method 2: Using anchor click (most reliable)
  const openTelegramWithAnchor = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Method 3: Direct navigation
  const openTelegramDirect = (url: string) => {
    window.location.href = url;
  };

  // Main function to handle Telegram order
  const handleOrder = () => {
    const message = getOrderMessage();
    const encodedMessage = encodeURIComponent(message);

    // Create both intent URL and web URL
    const intentUrl = `tg://resolve?domain=${telegramUsername}&text=${encodedMessage}`;
    const webUrl = `https://t.me/${telegramUsername}?text=${encodedMessage}`;

    // Detect if on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Try to open Telegram app
      if (isIOS) {
        // iOS: Use window.location (works better)
        openTelegramDirect(intentUrl);
      } else {
        // Android: Try anchor click first
        openTelegramWithAnchor(intentUrl);
      }
    } else {
      // Desktop: Open web version
      window.open(webUrl, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/50 backdrop-blur-sm">
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
          <FaTimes size={18} />
        </button>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Product Image Carousel */}
          <div className="lg:w-1/2 flex justify-center relative">
            <Swiper
              modules={[Pagination, A11y]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{ clickable: true, dynamicBullets: true }}
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
                    ? "This item is currently out of stock. You can pre-order now and we will notify you when it's available."
                    : "ផលិតផលនេះអស់ស្តុកបណ្តោះអាសន្ន។ អ្នកអាចបញ្ជាទិញទុកជាមុនបាន ហើយយើងនឹងជូនដំណឹងដល់អ្នកនៅពេលដែលវាមានវត្តមាន។"}
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

              {/* Price Display */}
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

              {/* Quantity Selector */}
              <div
                className="mt-4 p-3 rounded-lg border"
                style={{ borderColor: `${theme.primaryColor}30` }}
              >
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: theme.textColor }}
                >
                  {language === "en" ? "Quantity:" : "បរិមាណ:"}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decreaseQuantity}
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: `${theme.primaryColor}20`,
                      color: theme.primaryColor,
                    }}
                    disabled={quantity <= 1}
                  >
                    <FaMinus size={14} />
                  </button>
                  <span
                    className="text-xl font-bold min-w-[50px] text-center"
                    style={{ color: theme.textColor }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: `${theme.primaryColor}20`,
                      color: theme.primaryColor,
                    }}
                  >
                    <FaPlus size={14} />
                  </button>
                </div>
              </div>

              {/* Total Price Display */}
              {quantity > 0 && (
                <div
                  className="mt-3 p-3 rounded-lg"
                  style={{
                    backgroundColor: `${theme.primaryColor}15`,
                    borderLeft: `4px solid ${
                      product.is_available
                        ? theme.primaryColor
                        : theme.secondaryColor
                    }`,
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: theme.textColor }}
                    >
                      {language === "en" ? "Total Price:" : "តម្លៃសរុប:"}
                    </span>
                    <div className="text-right">
                      <span
                        className="text-lg font-bold"
                        style={{
                          color: product.is_available
                            ? theme.primaryColor
                            : theme.secondaryColor,
                        }}
                      >
                        ៛{totalPrice.khr}
                      </span>
                      <span
                        className="text-sm ml-2"
                        style={{ color: theme.textColorSecondary }}
                      >
                        (${totalPrice.usd})
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Button */}
            <div className="space-y-2 mb-4">
              <p className="text-xs text-center mt-1 text-red-500">
                {language === "en"
                  ? "📱 Click to open your Telegram app first to order smoothly!"
                  : "📱 ចុចបើកកម្មវិធី Telegram របស់អ្នកជាមុនសិន​ដើម្បីបញ្ជាទិញបានយ៉ាងរលូន!"}
              </p>
              <button
                onClick={handleOrder}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  backgroundColor: product.is_available
                    ? theme.primaryColor
                    : theme.secondaryColor,
                  opacity: product.is_available ? 1 : 0.9,
                }}
              >
                <FaTelegramPlane size={18} />
                {product.is_available
                  ? language === "en"
                    ? `Order ${quantity} item${
                        quantity > 1 ? "s" : ""
                      } on Telegram`
                    : `បញ្ជាទិញ ${quantity} មុខតាម Telegram`
                  : language === "en"
                  ? `Pre-order ${quantity} item${
                      quantity > 1 ? "s" : ""
                    } on Telegram`
                  : `បញ្ជាទិញទុកជាមុន ${quantity} មុខតាម Telegram`}
              </button>

              {/* Copy message button */}
              {/* <button
                onClick={copyMessageToClipboard}
                className="w-full py-2 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: `${theme.primaryColor}10`,
                  color: theme.textColorSecondary,
                }}
              >
                <FaCopy size={14} />
                {language === "en" ? "Copy Order Message" : "ចម្លងសារបញ្ជាទិញ"}
              </button> */}
              {/* //sdfjnsfnsnfjnjnfk */}
            </div>

            {/* Contact / Social */}
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
                {theme.showSocialLinks && facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white p-2 md:p-3 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-lg flex items-center justify-center"
                    style={{ backgroundColor: "#1877F2" }}
                  >
                    <FaFacebookF size={16} />
                  </a>
                )}
                {theme.showSocialLinks && telegramUrl && (
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white p-2 md:p-3 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-lg flex items-center justify-center"
                    style={{ backgroundColor: "#26A5E4" }}
                  >
                    <FaTelegramPlane size={16} />
                  </a>
                )}
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white p-2 md:p-3 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: "#34A853" }}
                >
                  <FaMapMarkerAlt size={16} />
                </a>
                <a
                  href={phoneUrl}
                  className="text-white p-2 md:p-3 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-lg flex items-center gap-1 md:gap-2"
                  style={{ backgroundColor: "#EA4335" }}
                >
                  <FaPhoneAlt size={14} />
                  <span className="text-xs md:text-sm font-semibold truncate max-w-[80px] md:max-w-[100px]">
                    {product.contact}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
