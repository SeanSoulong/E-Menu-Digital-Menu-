import { createClient } from "./supabase-client";

export async function uploadImage(file: File): Promise<string> {
  try {
    console.log("Starting image upload...", file.name, file.size, file.type);

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("Please upload an image file (JPEG, PNG, WebP)");
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error("Image size must be less than 2MB");
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase();
    const validExtensions = ["jpg", "jpeg", "png", "webp", "gif"];

    if (!fileExt || !validExtensions.includes(fileExt)) {
      throw new Error("Invalid file type. Please use JPG, PNG, or WebP");
    }

    const fileName = `${Math.random()
      .toString(36)
      .substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `menu-items/${fileName}`;

    console.log("Uploading to path:", filePath);

    const supabase = createClient();

    // Upload the file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("menu-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    console.log("Upload successful:", uploadData);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("menu-images")
      .getPublicUrl(filePath);

    console.log("Public URL data:", urlData);

    if (!urlData.publicUrl) {
      throw new Error("Failed to get public URL for uploaded image");
    }

    return urlData.publicUrl;
  } catch (error) {
    console.error("Image upload error:", error);
    throw error;
  }
}

// New function to upload multiple images
export async function uploadMultipleImages(files: File[]): Promise<string[]> {
  try {
    const uploadPromises = files.map((file) => uploadImage(file));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("Multiple image upload error:", error);
    throw error;
  }
}
