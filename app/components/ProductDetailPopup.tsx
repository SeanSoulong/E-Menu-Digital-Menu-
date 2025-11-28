"use client";
import { Product } from "../data/types";
import Image from "next/image";
import {
  FaTimes,
  FaFacebookF,
  FaTelegramPlane,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, A11y } from "swiper/modules";
import { useLanguage } from "../context/LanguageContext";

interface ProductDetailPopupProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetailPopup({
  product,
  onClose,
}: ProductDetailPopupProps) {
  const { language } = useLanguage();

  if (!product) return null;

  const facebookUrl = "https://www.facebook.com/profile.php?id=100004264842600";
  const telegramUrl = "https://t.me/sothimaktey";
  const mapUrl = "https://maps.app.goo.gl/9xi5jv778zCMV5gs8";
  const phoneUrl = `tel:${product.contact || "098253453"}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/50 backdrop-blur-sm font-[Kantumruy_Pro]">
      <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 z-10 bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900 p-2 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-lg"
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
                  <div className="flex items-center justify-center h-full">
                    <Image
                      src={image}
                      alt={product.name[language]}
                      width={500}
                      height={400}
                      unoptimized
                      className="rounded-lg object-cover w-full h-auto max-h-80 md:max-h-96 lg:max-h-[400px] border"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 flex flex-col justify-start">
            <div className="mb-4 md:mb-6">
              {/* <div className="bg-gradient-to-r from-[#3F3F3F] to-[#2F2F2F] text-white px-3 py-1 rounded-lg text-sm font-bold inline-block mb-3">
                ID: {product.id}
              </div> */}
              <h2 className="text-[16px] md:text-[18px] lg:text-[20px] font-bold text-gray-900 mb-2 md:mb-3 leading-tight truncate max-w-full">
                {product.name[language]}
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-1 md:space-y-2 mb-3 md:mb-4">
                {product.description[language]
                  .split("\n")
                  .map((line, index) => (
                    <p key={index} className="text-[13px] md:text-[14px]">
                      {line}
                    </p>
                  ))}
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-green-700 text-base md:text-lg font-bold truncate max-w-[150px] md:max-w-[200px]">
                  {language === "en" ? "Price" : "តម្លៃ"}: {product.priceKhr}
                </span>

                <span className="text-gray-500 text-xs md:text-sm truncate max-w-[80px] md:max-w-[100px]">
                  {product.priceUsd}
                </span>
              </div>
            </div>

            {/* Contact / Social */}
            <div className="mt-auto pt-4 md:pt-6 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3 md:mb-4">
                {language === "en" ? "Contact us:" : "ទំនាក់ទំនងពួកយើង៖"}
              </p>
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white p-2 md:p-3 rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-110 shadow-lg flex items-center justify-center"
                  aria-label="Facebook Page"
                >
                  <FaFacebookF size={16} className="md:w-4 md:h-4" />
                </a>
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-400 text-white p-2 md:p-3 rounded-xl hover:bg-blue-500 transition-all duration-200 transform hover:scale-110 shadow-lg flex items-center justify-center"
                  aria-label="Telegram Account"
                >
                  <FaTelegramPlane size={16} className="md:w-4 md:h-4" />
                </a>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white p-2 md:p-3 rounded-xl hover:bg-green-700 transition-all duration-200 transform hover:scale-110 shadow-lg flex items-center justify-center"
                  aria-label="Find on Map"
                >
                  <FaMapMarkerAlt size={16} className="md:w-4 md:h-4" />
                </a>
                <a
                  href={phoneUrl}
                  className="bg-red-600 text-white p-2 md:p-3 rounded-xl hover:bg-red-700 transition-all duration-200 transform hover:scale-110 shadow-lg flex items-center gap-1 md:gap-2"
                  aria-label="Call Us"
                >
                  <FaPhoneAlt size={14} className="md:w-4 md:h-4" />
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
