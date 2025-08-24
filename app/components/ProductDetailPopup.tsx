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

  // URLs for social/contact links
  const facebookUrl = "https://www.facebook.com/Limsakhna";
  const telegramUrl = "https://t.me/sothimaktey";
  const mapUrl = "https://maps.app.goo.gl/9xi5jv778zCMV5gs8";
  const phoneUrl = `tel:${product.contact || "098253453"}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/30">
      <div className="bg-white rounded-lg shadow-xl p-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <FaTimes size={24} />
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image Carousel */}
          <div className="md:w-1/2 flex justify-center relative">
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
                    className="rounded-lg object-contain max-h-96 border"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 flex flex-col justify-start">
            <div className="mb-4">
              <p className="text-gray-500 mb-2">
                {language === "en" ? "ID" : "លេខសម្គាល់"}: {product.id}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {product.name[language]}
              </h2>
              <ul className="text-gray-700 list-none p-0 space-y-1">
                {product.description[language]
                  .split("\n")
                  .map((line, index) => (
                    <li key={index}>{line}</li>
                  ))}
              </ul>
              <div className="flex items-end mb-2 text-[#F05656]">
                <span className="text-xl md:text-2xl font-bold">
                  {product.priceUsd}
                </span>
                <span className="text-base ml-2">{product.priceKhr}</span>
              </div>
            </div>

            {/* Contact / Social */}
            <div className="flex items-center gap-4 mt-auto pt-4">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Page"
              >
                <FaFacebookF className="text-blue-600 cursor-pointer hover:opacity-80" />
              </a>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram Account"
              >
                <FaTelegramPlane className="text-blue-400 cursor-pointer hover:opacity-80" />
              </a>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Find on Map"
              >
                <FaMapMarkerAlt className="text-green-600 cursor-pointer hover:opacity-80" />
              </a>
              <a href={phoneUrl} aria-label="Call Us">
                <div className="flex items-center">
                  <FaPhoneAlt className="text-red-600 cursor-pointer hover:opacity-80" />
                  <span className="ml-2 text-gray-700">{product.contact}</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
