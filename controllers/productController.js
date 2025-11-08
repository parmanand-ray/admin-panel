import Product from "../models/Product.js";
import Category from "../models/Category.js";
import slugify from "slugify";

export const listProducts = async (req, res) => {
  const products = await Product.find().populate("product_cat").sort({ createdAt: -1 });
  res.render("products/list", { products });
};

export const addProductForm = async (req, res) => {
   try {
    const categories = await Category.find({ status: "Y" }).sort({ catName: 1 });
    res.render("products/add", { categories });
  } catch (err) {
    console.error("❌ Error loading categories:", err);
    res.status(500).send("Server error");
  }
};

export const editProductForm = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.send("Product not found");
  const categories = await Category.find().sort({ catName: 1 });
  res.render("products/edit", { product, categories });
};

export const createProduct = async (req, res) => {
  const {
    product_title,
    product_cat ,
    product_code,
    product_desc,
    product_specfi,
  } = req.body;

   // Ensure product_cat is always an array
    const productCategories = Array.isArray(product_cat)
      ? product_cat
      : [product_cat];

   // store all uploaded image paths
    const imagePaths = req.files.map(
      (file) => `/uploads/products/${file.filename}`
    );

  await Product.create({
    product_title,
    product_cat: productCategories,
    product_code,
    product_desc,
    product_specfi,
    images:imagePaths,
  });

  res.redirect("/products");
};
export const updateProduct = async (req, res) => {
  const {
    product_title,
    product_cat ,
    product_code,
    product_desc,
    product_specfi,
  } = req.body;

   // Ensure product_cat is always an array
    const productCategories = Array.isArray(product_cat)
      ? product_cat
      : [product_cat];

      // Find existing product first
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");

      // 1️⃣ Preserve existing images
    let updatedImages = product.images || [];

    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map(
        (file) => `/uploads/products/${file.filename}`
      );
      updatedImages = [...updatedImages, ...newImagePaths];
    }

  await Product.findByIdAndUpdate(req.params.id,{
    product_title,
    product_cat: productCategories,
    product_code,
    product_desc,
    product_specfi,
    images:updatedImages,
  });

  res.redirect("/products");
};

export const toggleProductStatus = async (req, res) => {
  try {
    const { product_status } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { product_status },
      { new: true }
    );

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true, status: product.product_status });
  } catch (err) {
    console.error("❌ Error toggling status:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

