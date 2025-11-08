import multer from "multer";
import path from "path";
import fs from "fs";

const getMulterUpload = (folder = "general") => {
  const uploadPath = `public/uploads/${folder}`;

  // ensure folder exists
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  });

  return multer({ storage });
};

export default getMulterUpload;

