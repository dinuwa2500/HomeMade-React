import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists with absolute path
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Sanitize filename and add timestamp
    const ext = path.extname(file.originalname);
    const filename = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, '_'); // Replace non-alphanumeric with underscore
    cb(null, `${filename}_${Date.now()}${ext}`);
  },
});

// Add file filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export default upload;
