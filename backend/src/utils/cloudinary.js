import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const ensureConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

export const uploadVideo = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    ensureConfig();

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "video",
      folder: "pitch-vault/pitches",
    });

    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null;
  ensureConfig();

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
    console.log(`Deleted from Cloudinary: ${publicId}`);
    return result;
  } catch (error) {
    console.error(`Failed to delete from Cloudinary: ${publicId}`, error);
    return null;
  }
};

export const deleteTempFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error(`Failed to delete temp file: ${filePath}`, error);
    }
  }
};
