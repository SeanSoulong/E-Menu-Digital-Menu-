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
  FaCopy,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, A11y } from "swiper/modules";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";

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
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [showFullMessage, setShowFullMessage] = useState(false);

  if (!product) return null;

  // Use theme settings for social links
  const facebookUrl =
    theme.socialFacebookUrl ||
    "https://www.facebook.com/profile.php?id=100004264842600";
  const telegramUrl = theme.socialTelegramUrl || "https://t.me/sothimaktey";
  const instagramUrl = theme.socialInstagramUrl || "https://instagram.com";
  const tiktokUrl = theme.socialTiktokUrl || "https://tiktok.com";

  const mapUrl = "https://maps.app.goo.gl/9xi5jv778zCMV5gs8";
  const phoneUrl = `tel:${product.contact || "098253453"}`;
  const productImageUrl = product.images?.[0] || product.image;

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

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  // Generate the order message
  const getOrderMessage = () => {
    const productName = product.name[language];
    const productPrice = `${product.priceUsd} / ${product.priceKhr}`;
    const productDescription = product.description[language];
    const totalPriceFormatted = `$${totalPrice.usd} / ៛${totalPrice.khr}`;
    const divider = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
    const isPreOrder = !product.is_available;

    const header = isPreOrder
      ? "⏰ PRE-ORDER REQUEST ⏰"
      : "🛍️ NEW ORDER REQUEST 🛍️";

    const statusText = isPreOrder
      ? "⚠️ Status: OUT OF STOCK - Pre-order"
      : "✅ Status: IN STOCK";

    return `${header}
${divider}

📦 PRODUCT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━
• Product Name: ${productName}
• Price per item: ${productPrice}
• Quantity: ${quantity}
• Total Price: ${totalPriceFormatted}

${statusText}

📝 DESCRIPTION:
${productDescription.substring(0, 300)}${
      productDescription.length > 300 ? "..." : ""
    }

${divider}

🔗 LINKS:
• Product Link: ${window.location.href}
• Product Image: ${productImageUrl}

📅 ORDER DETAILS:
• Date: ${new Date().toLocaleDateString()}
• Time: ${new Date().toLocaleTimeString()}
• Platform: Emoji Menu Web App

${divider}

💬 Please reply to this message to confirm my order.

Thank you! 🙏`;
  };

  // Extract username from telegram URL
  const getTelegramUsername = (url: string) => {
    if (url.includes("t.me/")) {
      let username = url.split("t.me/")[1];
      username = username.split("/")[0].split("?")[0];
      if (username.startsWith("@")) username = username.substring(1);
      return username;
    }
    return "sothimaktey";
  };

  const telegramUsername = getTelegramUsername(telegramUrl);
  const orderMessage = getOrderMessage();

  // Method 1: Copy message to clipboard (most reliable)
  const copyMessageToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(orderMessage);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 3000);

      // Also open Telegram
      openTelegram();
    } catch (err) {
      console.error("Failed to copy:", err);
      alert(
        language === "en"
          ? "Failed to copy message. Please copy manually."
          : "មិនអាចចម្លងសារបានទេ។ សូមចម្លងដោយដៃ។"
      );
    }
  };

  // Method 2: Open Telegram without message (user pastes manually)
  const openTelegram = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const telegramUrl = `https://t.me/${telegramUsername}`;
    const telegramAppUrl = `tg://resolve?domain=${telegramUsername}`;

    if (isMobile) {
      window.location.href = telegramAppUrl;
      setTimeout(() => {
        window.open(telegramUrl, "_blank");
      }, 500);
    } else {
      window.open(telegramUrl, "_blank");
    }
  };

  // Method 3: Try to send with message (might not always work)
  const sendWithMessage = () => {
    const encodedMessage = encodeURIComponent(orderMessage);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const telegramWithMessage = `https://t.me/${telegramUsername}?text=${encodedMessage}`;
    const telegramAppWithMessage = `tg://resolve?domain=${telegramUsername}&text=${encodedMessage}`;

    if (isMobile) {
      window.location.href = telegramAppWithMessage;
      setTimeout(() => {
        window.open(telegramWithMessage, "_blank");
      }, 500);
    } else {
      window.open(telegramWithMessage, "_blank");
    }
  };

  const handleOrder = () => {
    // Best approach: Copy message and open Telegram
    copyMessageToClipboard();
  };

  const copyImageUrl = async () => {
    try {
      await navigator.clipboard.writeText(productImageUrl);
      alert(
        language === "en" ? "Image URL copied!" : "ចម្លង URL រូបភាពរួចរាល់!"
      );
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const copyFullMessage = async () => {
    try {
      await navigator.clipboard.writeText(orderMessage);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 3000);
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
                    ? "This item is currently out of stock. You can pre-order now!"
                    : "ផលិតផលនេះអស់ស្តុកបណ្តោះអាសន្ន។ អ្នកអាចបញ្ជាទិញទុកជាមុនបាន!"}
                </p>
              </div>
            )}

            <div className="mb-4 md:mb-6">
              <h2
                className="text-[16px] md:text-[18px] lg:text-[20px] font-bold mb-2 md:mb-3 leading-tight"
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
                  className="text-base md:text-lg font-bold"
                  style={{
                    color: !product.is_available
                      ? theme.textColorSecondary
                      : theme.primaryColor,
                  }}
                >
                  {product.priceKhr}
                </span>
                <span
                  className="text-xs md:text-sm"
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

            {/* Order Section */}
            <div className="space-y-3 mb-4">
              {/* Main Order Button */}
              <button
                onClick={handleOrder}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
                style={{
                  backgroundColor: product.is_available
                    ? theme.primaryColor
                    : theme.secondaryColor,
                }}
              >
                <FaTelegramPlane size={18} />
                {product.is_available
                  ? language === "en"
                    ? `Order on Telegram`
                    : `បញ្ជាទិញតាម Telegram`
                  : language === "en"
                  ? `Pre-order on Telegram`
                  : `បញ្ជាទិញទុកជាមុនតាម Telegram`}
              </button>

              {/* Success Message */}
              {showCopySuccess && (
                <div className="text-center text-sm py-2 px-3 rounded-lg bg-green-100 text-green-700">
                  {language === "en"
                    ? "✓ Order details copied! Opening Telegram..."
                    : "✓ ចម្លងព័ត៌មានបញ្ជាទិញរួចរាល់! កំពុងបើក Telegram..."}
                </div>
              )}

              {/* Copy Message Button */}
              <button
                onClick={copyFullMessage}
                className="w-full py-2 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 border"
                style={{
                  backgroundColor: `${theme.primaryColor}10`,
                  color: theme.textColorSecondary,
                  borderColor: `${theme.primaryColor}30`,
                }}
              >
                <FaCopy size={14} />
                {language === "en" ? "Copy Order Message" : "ចម្លងសារបញ្ជាទិញ"}
              </button>

              {/* Copy Image Button */}
              <button
                onClick={copyImageUrl}
                className="w-full py-2 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 border"
                style={{
                  backgroundColor: `${theme.primaryColor}10`,
                  color: theme.textColorSecondary,
                  borderColor: `${theme.primaryColor}30`,
                }}
              >
                <FaCopy size={14} />
                {language === "en" ? "Copy Image URL" : "ចម្លង URL រូបភាព"}
              </button>

              {/* Open Telegram Button (without message) */}
              <button
                onClick={openTelegram}
                className="w-full py-2 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: `${theme.primaryColor}5`,
                  color: theme.textColorSecondary,
                }}
              >
                <FaTelegramPlane size={14} />
                {language === "en" ? "Open Telegram Chat" : "បើក Telegram Chat"}
              </button>

              {/* Preview Message Toggle */}
              <button
                onClick={() => setShowFullMessage(!showFullMessage)}
                className="w-full py-2 rounded-xl text-xs transition-all duration-200"
                style={{ color: theme.textColorSecondary }}
              >
                {showFullMessage
                  ? language === "en"
                    ? "Hide message preview ▲"
                    : "លាក់ការបង្ហាញសារ ▲"
                  : language === "en"
                  ? "Show message preview ▼"
                  : "បង្ហាញសារ ▼"}
              </button>

              {/* Message Preview */}
              {showFullMessage && (
                <div
                  className="mt-2 p-3 rounded-lg text-xs font-mono whitespace-pre-wrap max-h-60 overflow-y-auto border"
                  style={{
                    backgroundColor: `${theme.backgroundColor}`,
                    borderColor: `${theme.primaryColor}30`,
                    color: theme.textColorSecondary,
                  }}
                >
                  {orderMessage}
                </div>
              )}
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
