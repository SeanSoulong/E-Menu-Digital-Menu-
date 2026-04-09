import {
  XMarkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";

interface ImagePreviewModalProps {
  isOpen: boolean;
  imageUrl: string;
  imagesList: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function ImagePreviewModal({
  isOpen,
  imageUrl,
  imagesList,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: ImagePreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors p-2"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {imagesList.length > 1 && (
          <div className="absolute -top-10 left-0 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            {currentIndex + 1} / {imagesList.length}
          </div>
        )}

        <img
          src={imageUrl}
          alt="Preview"
          className="w-full h-auto max-h-[75vh] object-contain rounded-lg"
        />

        {imagesList.length > 1 && (
          <>
            {currentIndex > 0 && (
              <button
                onClick={onPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
            )}
            {currentIndex < imagesList.length - 1 && (
              <button
                onClick={onNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
              >
                <ArrowRightIcon className="w-6 h-6" />
              </button>
            )}
          </>
        )}

        {imagesList.length > 1 && (
          <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-2">
            {imagesList.map((img, idx) => (
              <div
                key={idx}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                  currentIndex === idx
                    ? "ring-2 ring-white ring-offset-2 ring-offset-black"
                    : "opacity-60 hover:opacity-100"
                }`}
                onClick={() => {
                  // This will be handled by the parent component
                  // We'll need to pass a function to change the image
                }}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
