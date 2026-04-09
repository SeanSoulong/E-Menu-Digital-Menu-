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
import { useState, useRef, useEffect } from "react";

interface ProductDetailPopupProps {
  product: Product | null;
  onClose: () => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        sendData: (data: string) => void;
        showAlert: (message: string, callback?: () => void) => void;
        showConfirm: (
          message: string,
          callback?: (confirmed: boolean) => void
        ) => void;
        HapticFeedback: {
          impactOccurred: (style: string) => void;
        };
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
      };
    };
  }
}

export default function ProductDetailPopup({
  product,
  onClose,
}: ProductDetailPopupProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [quantity, setQuantity] = useState(1);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isInTelegramApp, setIsInTelegramApp] = useState(false);
  const [telegramUser, setTelegramUser] = useState<{
    name: string;
    username: string;
  } | null>(null);

  useEffect(() => {
    // Check if running inside Telegram Mini App
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      setIsInTelegramApp(true);
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();

      // Get user info if available
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setTelegramUser({
          name: `${user.first_name} ${user.last_name || ""}`.trim(),
          username: user.username ? `@${user.username}` : "",
        });
      }
    }
  }, []);

  if (!product) return null;

  // Use theme settings for social links
  const facebookUrl =
    theme.socialFacebookUrl ||
    "https://www.facebook.com/profile.php?id=100004264842600";
  const telegramUrl = theme.socialTelegramUrl || "https://t.me/sothimaktey";

  // Static links
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

  // Create the order message
  const getOrderMessage = () => {
    const productName = product.name[language];
    const productPrice = `${product.priceUsd} / ${product.priceKhr}`;
    const productDescription = product.description[language];
    const totalPriceFormatted = `$${totalPrice.usd} / ៛${totalPrice.khr}`;
    const divider = "━━━━━━━━━━━━━━━";
    const orderType = !product.is_available ? "PRE-ORDER" : "NEW ORDER";
    const emoji = !product.is_available ? "⏰" : "🛍️";
    const statusText = !product.is_available
      ? "\n⚠️ Status: Out of Stock - Pre-order"
      : "";

    // Add customer info if from Telegram
    const customerInfo = telegramUser
      ? `\n👤 Customer: ${telegramUser.name} ${telegramUser.username}`
      : "";

    return language === "en"
      ? `${emoji} ${orderType} REQUEST ${emoji}\n${divider}\n\n📦 Product: ${productName}\n💰 Price per item: ${productPrice}\n🔢 Quantity: ${quantity}\n💵 Total Price: ${totalPriceFormatted}${statusText}${customerInfo}\n\n📝 Details:\n${productDescription.substring(
          0,
          150
        )}${
          productDescription.length > 150 ? "..." : ""
        }\n\n${divider}\n🔗 Product Link: ${
          window.location.href
        }\n📅 Date: ${new Date().toLocaleDateString()}\n⏰ Time: ${new Date().toLocaleTimeString()}\n\n🖼️ Product Image: ${productImageUrl}\n\n✅ Please confirm my ${
          !product.is_available ? "pre-" : ""
        }order request`
      : `${emoji} ${orderType} REQUEST ${emoji}\n${divider}\n\n📦 ផលិតផល: ${productName}\n💰 តម្លៃក្នុងមួយ: ${productPrice}\n🔢 បរិមាណ: ${quantity}\n💵 តម្លៃសរុប: ${totalPriceFormatted}${statusText}${customerInfo}\n\n📝 ព័ត៌មានលម្អិត:\n${productDescription.substring(
          0,
          150
        )}${
          productDescription.length > 150 ? "..." : ""
        }\n\n${divider}\n🔗 តំណភ្ជាប់ផលិតផល: ${
          window.location.href
        }\n📅 កាលបរិច្ឆេទ: ${new Date().toLocaleDateString()}\n⏰ ម៉ោង: ${new Date().toLocaleTimeString()}\n\n🖼️ រូបភាពផលិតផល: ${productImageUrl}\n\n✅ សូមជួយបញ្ជាក់ការ${
          !product.is_available ? "បញ្ជាទិញទុកជាមុន" : "បញ្ជាទិញ"
        }របស់ខ្ញុំ`;
  };

  // FOR REGULAR BROWSER (Chrome, Safari, etc.) - Opens Telegram app
  const handleOrderRegularBrowser = () => {
    const message = getOrderMessage();
    const encodedMessage = encodeURIComponent(message);
    const intentUrl = `tg://resolve?domain=${telegramUsername}&text=${encodedMessage}`;
    const webUrl = `https://t.me/${telegramUsername}?text=${encodedMessage}`;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      if (isIOS) {
        window.location.href = intentUrl;
      } else {
        const link = document.createElement("a");
        link.href = intentUrl;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        setTimeout(() => document.body.removeChild(link), 100);
      }

      timeoutRef.current = setTimeout(() => {
        if (document.visibilityState === "visible") {
          const shouldOpenWeb = confirm(
            language === "en"
              ? "Telegram app didn't open. Open Telegram Web instead?"
              : "កម្មវិធី Telegram មិនបើកទេ។ តើចង់បើក Telegram Web ជំនួសទេ?"
          );
          if (shouldOpenWeb) window.open(webUrl, "_blank");
        }
      }, 2000);
    } else {
      window.open(webUrl, "_blank");
    }
  };

  // FOR TELEGRAM MINI APP - Sends order directly to bot
  const handleOrderTelegramApp = () => {
    if (!window.Telegram?.WebApp) return;

    const message = getOrderMessage();

    // Send data to bot
    window.Telegram.WebApp.sendData(
      JSON.stringify({
        action: "order",
        message: message,
        product: {
          id: product.id,
          name: product.name,
          price: product.priceUsd,
          quantity: quantity,
          total: totalPrice,
        },
      })
    );

    // Show confirmation
    window.Telegram.WebApp.showAlert(
      language === "en"
        ? "✓ Order sent successfully! The shop will contact you soon."
        : "✓ បានផ្ញើការបញ្ជាទិញដោយជោគជ័យ! ហាងនឹងទាក់ទងអ្នកឆាប់ៗនេះ។"
    );

    // Trigger haptic feedback
    window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");

    // Close popup after 1.5 seconds
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  // Main order handler - detects environment automatically
  const handleOrder = () => {
    if (isInTelegramApp) {
      handleOrderTelegramApp();
    } else {
      handleOrderRegularBrowser();
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

            {/* Order Button - Works for both environments */}
            <div className="space-y-2 mb-4">
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
                {isInTelegramApp
                  ? product.is_available
                    ? language === "en"
                      ? `Order ${quantity} item${quantity > 1 ? "s" : ""}`
                      : `បញ្ជាទិញ ${quantity} មុខ`
                    : language === "en"
                    ? `Pre-order ${quantity} item${quantity > 1 ? "s" : ""}`
                    : `បញ្ជាទិញទុកជាមុន ${quantity} មុខ`
                  : product.is_available
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

              {/* Environment-specific message */}
              <p
                className="text-xs text-center mt-2"
                style={{ color: theme.textColorSecondary }}
              >
                {isInTelegramApp
                  ? language === "en"
                    ? "✓ Your order will be sent directly to the shop"
                    : "✓ ការបញ្ជាទិញរបស់អ្នកនឹងត្រូវបានផ្ញើដោយផ្ទាល់ទៅកាន់ហាង"
                  : language === "en"
                  ? "📱 Click to open Telegram app with your order details pre-filled"
                  : "📱 ចុចដើម្បីបើកកម្មវិធី Telegram ជាមួយព័ត៌មានលម្អិតនៃការបញ្ជាទិញរបស់អ្នក"}
              </p>
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
