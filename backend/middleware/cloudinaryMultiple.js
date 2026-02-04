import { Buffer } from "node:buffer";
import cloudinary from "../middleware/cloudinary.js";
import ErrorResponse from "../utils/ErrorResponse.js";

const cloudUploader = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(new ErrorResponse("Please upload at least one image.", 400));
    }

    const uploadedURLs = [];

    for (const file of req.files) {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = `data:${file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "products",
        resource_type: "auto",
      });

      uploadedURLs.push(result.secure_url);
    }

    req.cloudinaryURLs = uploadedURLs;
    next();
  } catch (error) {
    next(error);
  }
};

export default cloudUploader;
