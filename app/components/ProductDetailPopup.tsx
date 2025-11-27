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
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900 p-2 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-lg"
        >
          <FaTimes size={20} />
        </button>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Product Image Carousel */}
          <div className="lg:w-1/2 flex justify-center relative">
            <Swiper
              modules={[Pagination, A11y]}
              spaceBetween={50}
              slidesPerView={1}
              pagination={{ clickable: true }}
              className="w-full h-full"
            >
              {product.images?.map((image, index) => (
                <SwiperSlide key={index}>
                  <Image
                    src={image}
                    alt={product.name[language]}
                    width={400}
                    height={400}
                    unoptimized
                    className="rounded-lg object-contain max-h-96 border"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 flex flex-col justify-start">
            <div className="mb-6">
              {/* <div className="bg-gradient-to-r from-[#3F3F3F] to-[#2F2F2F] text-white px-3 py-1 rounded-lg text-sm font-bold inline-block mb-3">
                ID: {product.id}
              </div> */}
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                {product.name[language]}
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-2 mb-4">
                {product.description[language]
                  .split("\n")
                  .map((line, index) => (
                    <p key={index} className="text-base">
                      {line}
                    </p>
                  ))}
              </div>
              <div className="flex items-end gap-3 mb-6">
                <span className="text-2xl lg:text-3xl font-bold text-[#F05656]">
                  {product.priceUsd}
                </span>
                <span className="text-lg text-gray-600 font-semibold">
                  {product.priceKhr}
                </span>
              </div>
            </div>

            {/* Contact / Social */}
            <div className="mt-auto pt-6 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-4">
                {language === "en" ? "Contact us:" : "ទំនាក់ទំនងពួកយើង៖"}
              </p>
              <div className="flex items-center gap-4">
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-110 shadow-lg"
                  aria-label="Facebook Page"
                >
                  <FaFacebookF size={18} />
                </a>
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-400 text-white p-3 rounded-xl hover:bg-blue-500 transition-all duration-200 transform hover:scale-110 shadow-lg"
                  aria-label="Telegram Account"
                >
                  <FaTelegramPlane size={18} />
                </a>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 transition-all duration-200 transform hover:scale-110 shadow-lg"
                  aria-label="Find on Map"
                >
                  <FaMapMarkerAlt size={18} />
                </a>
                <a
                  href={phoneUrl}
                  className="bg-red-600 text-white p-3 rounded-xl hover:bg-red-700 transition-all duration-200 transform hover:scale-110 shadow-lg flex items-center gap-2"
                  aria-label="Call Us"
                >
                  <FaPhoneAlt size={16} />
                  <span className="text-sm font-semibold">
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
