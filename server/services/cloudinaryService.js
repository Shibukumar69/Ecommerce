import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const isConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('Cloudinary service configured.');
} else {
  console.warn('Cloudinary environment variables missing. Falling back to local/URL assets.');
}

/**
 * Uploads a base64 string or file buffer to Cloudinary (fallback to returning local URI if Cloudinary is not configured)
 * @param {string} fileStr - base64 string or file path
 * @returns {Promise<string>} - url of uploaded image
 */
export const uploadImage = async (fileStr) => {
  if (!isConfigured) {
    // If not configured, we just return the passed string or a default premium placeholder if it's not a path/URL.
    if (fileStr.startsWith('data:image') || fileStr.length > 500) {
      return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800';
    }
    return fileStr;
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: 'ecommerce_catalog',
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Cloudinary upload failure:', error);
    throw new Error('Image upload failed');
  }
};
