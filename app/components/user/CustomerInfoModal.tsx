"use client";
import { useState, useEffect } from "react";
import { FaTimes, FaUser, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

interface CustomerInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (info: { name: string; phone: string; address: string }) => void;
  loading: boolean;
}

export default function CustomerInfoModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
}: CustomerInfoModalProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    address: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);

  // Check form validity whenever customer info changes
  useEffect(() => {
    const isNameValid = customerInfo.name.trim().length >= 2;
    const isPhoneValid = /^[0-9+\-\s()]{8,20}$/.test(customerInfo.phone.trim());
    setIsFormValid(isNameValid && isPhoneValid);
  }, [customerInfo]);

  if (!isOpen) return null;

  const validateName = (name: string) => {
    if (!name.trim()) {
      return language === "en" ? "Name is required" : "តម្រូវឱ្យមានឈ្មោះ";
    }
    if (name.length < 2) {
      return language === "en"
        ? "Name must be at least 2 characters"
        : "ឈ្មោះត្រូវតែមានយ៉ាងហោចណាស់ 2 តួអក្សរ";
    }
    return "";
  };

  const validatePhone = (phone: string) => {
    if (!phone.trim()) {
      return language === "en"
        ? "Phone number is required"
        : "តម្រូវឱ្យមានលេខទូរស័ព្ទ";
    }
    const phoneRegex = /^[0-9+\-\s()]{8,20}$/;
    if (!phoneRegex.test(phone)) {
      return language === "en"
        ? "Please enter a valid phone number"
        : "សូមបញ្ចូលលេខទូរស័ព្ទដែលត្រឹមត្រូវ";
    }
    return "";
  };

  const validateAddress = (address: string) => {
    if (address && address.length < 5) {
      return language === "en"
        ? "Address must be at least 5 characters if provided"
        : "អាសយដ្ឋានត្រូវតែមានយ៉ាងហោចណាស់ 5 តួអក្សរ ប្រសិនបើបានផ្តល់";
    }
    return "";
  };

  const validateForm = () => {
    const nameError = validateName(customerInfo.name);
    const phoneError = validatePhone(customerInfo.phone);
    const addressError = validateAddress(customerInfo.address);

    setErrors({
      name: nameError,
      phone: phoneError,
      address: addressError,
    });

    return !nameError && !phoneError && !addressError;
  };

  const handleFieldChange = (field: string, value: string) => {
    setCustomerInfo({ ...customerInfo, [field]: value });
    setTouched({ ...touched, [field]: true });

    // Real-time validation
    if (field === "name") {
      setErrors({ ...errors, name: validateName(value) });
    } else if (field === "phone") {
      setErrors({ ...errors, phone: validatePhone(value) });
    } else if (field === "address") {
      setErrors({ ...errors, address: validateAddress(value) });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, address: true });

    if (validateForm()) {
      onSubmit(customerInfo);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/50 backdrop-blur-sm">
      <div
        className="rounded-2xl shadow-2xl p-6 max-w-md w-full relative"
        style={{
          backgroundColor: theme.cardBackgroundColor,
          color: theme.textColor,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          style={{ color: theme.textColorSecondary }}
        >
          <FaTimes size={18} />
        </button>

        <h2
          className="text-xl font-bold mb-4"
          style={{ color: theme.textColor }}
        >
          {language === "en" ? "Customer Information" : "ព័ត៌មានអតិថិជន"}
        </h2>

        <p className="text-sm mb-4" style={{ color: theme.textColorSecondary }}>
          {language === "en"
            ? "Please provide your contact information to complete the order."
            : "សូមផ្តល់ព័ត៌មានទំនាក់ទំនងរបស់អ្នកដើម្បីបញ្ចប់ការបញ្ជាទិញ។"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: theme.textColor }}
            >
              {language === "en" ? "Full Name" : "ឈ្មោះពេញ"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaUser
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={14}
              />
              <input
                type="text"
                required
                value={customerInfo.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                onBlur={() => {
                  setTouched({ ...touched, name: true });
                  setErrors({
                    ...errors,
                    name: validateName(customerInfo.name),
                  });
                }}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{
                  fontSize: "16px",
                  borderColor:
                    touched.name && errors.name
                      ? "#EF4444"
                      : customerInfo.name.length >= 2 && touched.name
                      ? "#10B981"
                      : `${theme.primaryColor}40`,
                  backgroundColor: theme.backgroundColor,
                  color: theme.textColor,
                }}
                placeholder={
                  language === "en"
                    ? "Enter your full name"
                    : "បញ្ចូលឈ្មោះពេញរបស់អ្នក"
                }
              />
              {touched.name &&
                !errors.name &&
                customerInfo.name.length >= 2 && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
            </div>
            {touched.name && errors.name && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠️</span> {errors.name}
              </p>
            )}
            {touched.name && !errors.name && customerInfo.name.length >= 2 && (
              <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                <span>✓</span>{" "}
                {language === "en" ? "Valid name" : "ឈ្មោះត្រឹមត្រូវ"}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: theme.textColor }}
            >
              {language === "en" ? "Phone Number" : "លេខទូរស័ព្ទ"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaPhone
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={14}
              />
              <input
                type="tel"
                required
                value={customerInfo.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                onBlur={() => {
                  setTouched({ ...touched, phone: true });
                  setErrors({
                    ...errors,
                    phone: validatePhone(customerInfo.phone),
                  });
                }}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{
                  fontSize: "16px",
                  borderColor:
                    touched.phone && errors.phone
                      ? "#EF4444"
                      : /^[0-9+\-\s()]{8,20}$/.test(customerInfo.phone) &&
                        touched.phone &&
                        customerInfo.phone
                      ? "#10B981"
                      : `${theme.primaryColor}40`,
                  backgroundColor: theme.backgroundColor,
                  color: theme.textColor,
                }}
                placeholder={
                  language === "en"
                    ? "Enter your phone number"
                    : "បញ្ចូលលេខទូរស័ព្ទរបស់អ្នក"
                }
              />
              {touched.phone &&
                !errors.phone &&
                /^[0-9+\-\s()]{8,20}$/.test(customerInfo.phone) &&
                customerInfo.phone && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
            </div>
            {touched.phone && errors.phone && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠️</span> {errors.phone}
              </p>
            )}
            {touched.phone &&
              !errors.phone &&
              /^[0-9+\-\s()]{8,20}$/.test(customerInfo.phone) &&
              customerInfo.phone && (
                <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                  <span>✓</span>{" "}
                  {language === "en"
                    ? "Valid phone number"
                    : "លេខទូរស័ព្ទត្រឹមត្រូវ"}
                </p>
              )}
          </div>

          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: theme.textColor }}
            >
              {language === "en"
                ? "Delivery Address"
                : "អាសយដ្ឋានសម្រាប់ដឹកជញ្ជូន"}
              <span className="text-gray-400 text-xs ml-2">
                {language === "en" ? "(Optional)" : "(ស្រេចចិត្ត)"}
              </span>
            </label>
            <div className="relative">
              <FaMapMarkerAlt
                className="absolute left-3 top-3 text-gray-400"
                size={14}
              />
              <textarea
                value={customerInfo.address}
                onChange={(e) => handleFieldChange("address", e.target.value)}
                onBlur={() => {
                  setTouched({ ...touched, address: true });
                  setErrors({
                    ...errors,
                    address: validateAddress(customerInfo.address),
                  });
                }}
                rows={3}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none"
                style={{
                  fontSize: "16px",
                  borderColor:
                    touched.address && errors.address
                      ? "#EF4444"
                      : customerInfo.address.length >= 5 && touched.address
                      ? "#10B981"
                      : `${theme.primaryColor}40`,
                  backgroundColor: theme.backgroundColor,
                  color: theme.textColor,
                }}
                placeholder={
                  language === "en"
                    ? "Enter your delivery address (optional)"
                    : "បញ្ចូលអាសយដ្ឋានសម្រាប់ដឹកជញ្ជូន (ស្រេចចិត្ត)"
                }
              />
              {touched.address &&
                !errors.address &&
                customerInfo.address.length >= 5 && (
                  <div className="absolute right-3 top-3">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
            </div>
            {touched.address && errors.address && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠️</span> {errors.address}
              </p>
            )}
            {touched.address &&
              !errors.address &&
              customerInfo.address.length >= 5 && (
                <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                  <span>✓</span>{" "}
                  {language === "en" ? "Valid address" : "អាសយដ្ឋានត្រឹមត្រូវ"}
                </p>
              )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
              style={{
                backgroundColor: `${theme.textColorSecondary}20`,
                color: theme.textColor,
                fontSize: "16px",
              }}
            >
              {language === "en" ? "Cancel" : "បោះបង់"}
            </button>
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 ${
                isFormValid && !loading
                  ? "hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              }`}
              style={{
                backgroundColor:
                  isFormValid && !loading
                    ? theme.primaryColor
                    : theme.textColorSecondary,
                fontSize: "16px",
              }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : language === "en" ? (
                "Place Order"
              ) : (
                "បញ្ជាក់ការបញ្ជាទិញ"
              )}
            </button>
          </div>

          {/* Form validity indicator */}
          {!isFormValid && (touched.name || touched.phone) && (
            <div
              className="text-center text-xs mt-2 p-2 rounded-lg"
              style={{
                backgroundColor: `${theme.secondaryColor}10`,
                color: theme.secondaryColor,
              }}
            >
              <span>⚠️</span>{" "}
              {language === "en"
                ? "Please fill in all required fields correctly"
                : "សូមបំពេញគ្រប់វាលដែលត្រូវការឱ្យបានត្រឹមត្រូវ"}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
