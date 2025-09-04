import multer from "multer";

// 10MB file size limit
const fileSize = 10 * 1024 * 1024;
const allowedMimeTypes = ["image/png", "image/jpeg"];

// Filter files by type
const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG or PNG images are allowed."));
    }
};

// Use memory storage for file uploads
const storage = multer.memoryStorage();
const fileUploader = multer({
    storage,
    limits: { fileSize },
    fileFilter,
});

export default fileUploader;
