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
import { useState, useEffect } from "react";
import CustomerInfoModal from "./CustomerInfoModal";

interface ProductDetailPopupProps {
  product: Product | null;
  onClose: () => void;
  onOrderPlaced?: () => void;
}

export default function ProductDetailPopup({
  product,
  onClose,
  onOrderPlaced,
}: ProductDetailPopupProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStock, setCurrentStock] = useState<number | undefined>(
    product?.stock_quantity
  );

  // Update stock when product changes
  useEffect(() => {
    setCurrentStock(product?.stock_quantity);
  }, [product]);

  if (!product) return null;

  const facebookUrl =
    theme.socialFacebookUrl ||
    "https://www.facebook.com/profile.php?id=100004264842600";
  const telegramUrl = theme.socialTelegramUrl || "https://t.me/sothimaktey";
  const mapUrl = "https://maps.app.goo.gl/9xi5jv778zCMV5gs8";
  const phoneUrl = `tel:${product.contact || "098253453"}`;

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

  const getTelegramUsername = (url: string) => {
    if (url.includes("t.me/")) {
      return url.split("t.me/")[1];
    }
    return "sothimaktey";
  };

  const telegramUsername = getTelegramUsername(telegramUrl);

  // Message for IN-STOCK products
  const getInStockOrderMessage = (customerInfo: {
    name: string;
    phone: string;
    address: string;
  }) => {
    const productName = product.name[language];
    const totalPriceFormatted = `$${totalPrice.usd} / ៛${totalPrice.khr}`;
    const divider = "";

    // Grab the first image from your product array
    const productImage =
      product.images && product.images.length > 0 ? product.images[0] : "";

    return `
🖼️ PRODUCT IMAGE:
${productImage}

🛍️🛍️ NEW ORDER - IN STOCK 🛍️🛍️
${divider}

📦 PRODUCT: ${productName}
🔢 QUANTITY: ${quantity}
💵 TOTAL: ${totalPriceFormatted}

👤 CUSTOMER: ${customerInfo.name}
📞 PHONE: ${customerInfo.phone}
📍 ADDR: ${customerInfo.address || "Not provided"}

${divider}
📍 LINK: ${window.location.href}
⏰ TIME: ${new Date().toLocaleString()}
`.trim();
  };

  // Message for PRE-ORDER products
  const getPreOrderMessage = (customerInfo: {
    name: string;
    phone: string;
    address: string;
  }) => {
    const productName = product.name[language];
    const totalPriceFormatted = `$${totalPrice.usd} / ៛${totalPrice.khr}`;
    const divider = "";
    const productImage =
      product.images && product.images.length > 0 ? product.images[0] : "";

    return `
🖼️ PRODUCT IMAGE:
${productImage}

⏰⏰ PRE-ORDER REQUEST ⏰⏰
${divider}

📦 PRODUCT: ${productName}
🔢 QUANTITY: ${quantity}
💵 TOTAL: ${totalPriceFormatted}

👤 CUSTOMER: ${customerInfo.name}
📞 PHONE: ${customerInfo.phone}
📍 ADDR: ${customerInfo.address || "Not provided"}

${divider}
🔴 STATUS: PRE-ORDER
⏰ TIME: ${new Date().toLocaleString()}
`.trim();
  };

  // Get current stock status by checking the actual product stock_quantity
  const getCurrentStockStatus = async (): Promise<boolean> => {
    try {
      const response = await fetch(`/api/check-stock?itemId=${product.id}`);
      const data = await response.json();
      return data.hasStock;
    } catch (error) {
      console.error("Error checking stock:", error);
      // Fallback to current stock value
      return currentStock !== undefined && currentStock > 0;
    }
  };

  const placeOrder = async (customerInfo: {
    name: string;
    phone: string;
    address: string;
  }) => {
    setLoading(true);

    try {
      // First, check current stock status from API
      const stockResponse = await fetch(
        `/api/check-stock?itemId=${product.id}`
      );
      const stockData = await stockResponse.json();
      const hasStock = stockData.hasStock;

      // Create order
      const response = await fetch("/api/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: product.id,
          quantity: quantity,
          productName: product.name[language],
          customerName: customerInfo.name,
          customerPhone: customerInfo.phone,
          customerAddress: customerInfo.address,
          totalPrice: `${totalPrice.usd} USD / ${totalPrice.khr} KHR`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Choose message based on ACTUAL stock status
        const message =
          !hasStock || currentStock === 0
            ? getPreOrderMessage(customerInfo)
            : getInStockOrderMessage(customerInfo);

        const encodedMessage = encodeURIComponent(message);
        const intentUrl = `tg://resolve?domain=${telegramUsername}&text=${encodedMessage}`;
        const webUrl = `https://t.me/${telegramUsername}?text=${encodedMessage}`;

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
          window.location.href = intentUrl;
        } else {
          window.open(webUrl, "_blank");
        }

        // Success message to user
        alert(
          language === "en"
            ? "✓ Order placed successfully! Awaiting admin confirmation."
            : "✓ ការបញ្ជាទិញបានបញ្ចប់ដោយជោគជ័យ! កំពុងរង់ចាំការបញ្ជាក់ពីអ្នកគ្រប់គ្រង។"
        );

        setShowCustomerModal(false);
        if (onOrderPlaced) onOrderPlaced();

        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        alert(
          language === "en" ? `Error: ${data.error}` : `កំហុស: ${data.error}`
        );
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert(
        language === "en"
          ? "Failed to place order. Please try again."
          : "មិនអាចបញ្ជាទិញបានទេ។ សូមព្យាយាមម្តងទៀត។"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = () => {
    setShowCustomerModal(true);
  };

  const isOutOfStock = currentStock !== undefined && currentStock <= 0;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/50 backdrop-blur-sm">
        <div
          className="rounded-2xl shadow-2xl p-4 md:p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
          style={{
            backgroundColor: theme.cardBackgroundColor,
            color: theme.textColor,
          }}
        >
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
                          isOutOfStock ? "opacity-90" : ""
                        }`}
                        style={{ borderColor: `${theme.primaryColor}30` }}
                      />
                      {isOutOfStock && (
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

            <div className="lg:w-1/2 flex flex-col justify-start">
              {isOutOfStock && (
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
                      ? "This item is currently out of stock. You can still pre-order and we will notify you when available."
                      : "ផលិតផលនេះអស់ស្តុកបណ្តោះអាសន្ន។ អ្នកនៅតែអាចបញ្ជាទិញទុកជាមុនបាន ហើយយើងនឹងជូនដំណឹងដល់អ្នកនៅពេលមានវត្តមាន។"}
                  </p>
                </div>
              )}

              <div className="mb-4 md:mb-6">
                <h2
                  className={`text-[16px] md:text-[18px] lg:text-[20px] font-bold mb-2 md:mb-3 leading-tight truncate max-w-full ${
                    isOutOfStock ? "opacity-70" : ""
                  }`}
                  style={{
                    color: isOutOfStock
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
                      color: isOutOfStock
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

                {!isOutOfStock && (
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
                )}

                {quantity > 0 && (
                  <div
                    className="mt-3 p-3 rounded-lg"
                    style={{
                      backgroundColor: `${theme.primaryColor}15`,
                      borderLeft: `4px solid ${
                        isOutOfStock ? theme.secondaryColor : theme.primaryColor
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
                            color: isOutOfStock
                              ? theme.secondaryColor
                              : theme.primaryColor,
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

              <div className="space-y-2 mb-4">
                <p className="text-xs text-center mt-1 text-red-500 ">
                  {language === "en"
                    ? "📱 If you click order or you do not see anything, do not worry, just go back to this page and click order again!"
                    : "📱 ប្រសិនបើអ្នកចុចការបញ្ជាទិញឫកម្មង់ ហើយលោកអ្នកមិនឃើញអ្វីនោះទេ កុំបារម្មណ៍អ្នកគ្រាន់ត្រឡប់មកទំព័រនេះវិញហើយធ្វើការចុចបញ្ជាទិញឫកម្មង់ម្តងទៀត!"}
                </p>
                <button
                  onClick={handleOrder}
                  className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                    isOutOfStock ? "opacity-90" : ""
                  }`}
                  style={{
                    backgroundColor: isOutOfStock
                      ? theme.secondaryColor
                      : theme.primaryColor,
                  }}
                >
                  <FaTelegramPlane size={18} />
                  {isOutOfStock
                    ? language === "en"
                      ? "Pre-order Now"
                      : "បញ្ជាទិញទុកជាមុន"
                    : language === "en"
                    ? `Place Order ${quantity} item${quantity > 1 ? "s" : ""}`
                    : `បញ្ជាទិញ ${quantity}`}
                </button>
              </div>

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

      <CustomerInfoModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onSubmit={placeOrder}
        loading={loading}
      />
    </>
  );
}
