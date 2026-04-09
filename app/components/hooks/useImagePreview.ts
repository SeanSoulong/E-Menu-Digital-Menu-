import { useState } from "react";

export function useImagePreview() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewImagesList, setPreviewImagesList] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openImagePreview = (
    imageUrl: string,
    allImages: string[] = [],
    startIndex: number = 0
  ) => {
    setPreviewImage(imageUrl);
    setPreviewImagesList(allImages);
    setCurrentImageIndex(startIndex);
    document.body.style.overflow = "hidden";
  };

  const closeImagePreview = () => {
    setPreviewImage(null);
    setPreviewImagesList([]);
    setCurrentImageIndex(0);
    document.body.style.overflow = "auto";
  };

  const nextImage = () => {
    if (
      previewImagesList.length > 0 &&
      currentImageIndex < previewImagesList.length - 1
    ) {
      const newIndex = currentImageIndex + 1;
      setCurrentImageIndex(newIndex);
      setPreviewImage(previewImagesList[newIndex]);
    }
  };

  const prevImage = () => {
    if (previewImagesList.length > 0 && currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1;
      setCurrentImageIndex(newIndex);
      setPreviewImage(previewImagesList[newIndex]);
    }
  };

  return {
    previewImage,
    previewImagesList,
    currentImageIndex,
    openImagePreview,
    closeImagePreview,
    nextImage,
    prevImage,
  };
}
