import { Buffer } from 'node:buffer';
import { v2 as cloudinary } from 'cloudinary';
import ErrorResponse from '../utils/ErrorResponse.js';

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure_url: true,
});

// 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='

// Upload an image
const cloudUploader = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new ErrorResponse("Please upload at least one image.", 400);
    }

    const uploadedURLs = [];

    for (const file of req.files) {
      // Convert buffer to base64
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = `data:${file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "products",
        resource_type: "auto",
      });

      uploadedURLs.push(result.secure_url);
    }

    // Store uploaded URLs in req for controller
    req.cloudinaryURLs = uploadedURLs;

    next();
  } catch (error) {
    next(error);
  }
};

export default cloudUploader;