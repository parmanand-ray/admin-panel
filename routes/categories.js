import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  listCategories,
  addCategoryForm,
  createCategory,
  editCategoryForm,
  updateCategory,
  deleteCategory,
  listSubCategories,
} from "../controllers/categoryController.js";

const router = express.Router();

// ✅ Ensure upload directory exists
const uploadDir = path.resolve("public/uploads/category");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage });

// ✅ Routes

// Render Add Category Form
router.get("/add", addCategoryForm);

// Create New Category (with file uploads)
router.post(
  "/add",
  upload.fields([
    { name: "catImage", maxCount: 1 },
    { name: "cat_home_image", maxCount: 1 },
    { name: "catBanner", maxCount: 1 },
  ]),
  createCategory
);

// List Categories
router.get("/", listCategories);

// Edit Category Form
router.get("/edit/:id", editCategoryForm);

// Update Category (PUT with file upload)
router.put(
  "/edit/:id",
  upload.fields([
    { name: "catImage", maxCount: 1 },
    { name: "cat_home_image", maxCount: 1 },
    { name: "catBanner", maxCount: 1 },
  ]),
  updateCategory
);

// Delete Category
router.delete("/delete/:id", deleteCategory);
router.get("/:id", listSubCategories);

export default router;
