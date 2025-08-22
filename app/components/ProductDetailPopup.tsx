import { Product } from "../data/products";
import Image from "next/image";
import {
  FaTimes,
  FaFacebookF,
  FaTelegramPlane,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";

interface ProductDetailPopupProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetailPopup({
  product,
  onClose,
}: ProductDetailPopupProps) {
  if (!product) return null;

  // Define URLs for the contact links
  const facebookUrl = "https://www.facebook.com/your-page-url";
  const telegramUrl = "https://t.me/your-username";
  const mapUrl = "https://maps.google.com/?q=your-location";
  const phoneUrl = `tel:${product.contact || "012554489"}`; // 'tel:' prefix makes it a clickable phone number

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <FaTimes size={24} />
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <div className="md:w-1/2 flex justify-center relative">
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={400}
              className="rounded-lg object-contain max-h-96 border"
            />
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 flex flex-col justify-start">
            <div className="mb-4">
              <div className="flex items-end mb-2">
                <span className="text-xl md:text-2xl font-bold">
                  {product.priceUsd}
                </span>
                <span className="text-base text-gray-500 ml-2">
                  {product.priceKhr}
                </span>
              </div>
              <p className="text-gray-500 mb-2">ID: {product.id}</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {product.name}
              </h2>
              <ul className="text-gray-700 list-none p-0 space-y-1">
                {product.description.split("\n").map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
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
                  <span className="ml-2 text-gray-700">
                    {product.contact || "012 554 489"}
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
