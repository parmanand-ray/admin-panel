import Category from "../models/Category.js";
import slugify from "slugify";
import path from "path";
import fs from "fs";
export const listCategories = async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.render("categories/list", { categories });
};

export const addCategoryForm = (req, res) => {
  res.render("categories/add");
};

export const createCategory = async (req, res) => {
  try {
    const {
      catName,
      displayName,
      slug,
      pageTitle,
      pageKeywords,
      pageDescription,
      parentId,
      keyone,
      keytwo,
      keythree,
      catDesc,
      catDesc1,
      catDesc2,
    } = req.body;

    // Handle uploaded images (via multer)
    let images = {};
    if (req.files) {
      if (req.files.catImage && req.files.catImage[0]) {
        images.catImage = `/uploads/category/${req.files.catImage[0].filename}`;
      }
      if (req.files.cat_home_image && req.files.cat_home_image[0]) {
        images.cat_home_image = `/uploads/category/${req.files.cat_home_image[0].filename}`;
      }
      if (req.files.catBanner && req.files.catBanner[0]) {
        images.catBanner = `/uploads/category/${req.files.catBanner[0].filename}`;
      }
    }
    const totalDocs = await Category.countDocuments();
    const nextOrder = totalDocs + 1;

    // Construct category document
    const categoryData = {
      catName,
      displayName,
      description: {
        catDesc,
        catDesc1,
        catDesc2,
      },
      slug,
      parentId: parentId || null,
      order: nextOrder,
      images,
      meta: {
        pageTitle,
        pageKeywords,
        pageDescription,
        keyone,
        keytwo,
        keythree,
      },
    };

    // Save to MongoDB
    await Category.create(categoryData);

    console.log("✅ Category created successfully:", catName);
    res.redirect("/categories");
  } catch (error) {
    console.error("❌ Error creating category:", error);
    res.status(500).send("Server Error");
  }
};

export const editCategoryForm = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.send("Category not found");
  res.render("categories/edit", { category });
};

export const updateCategory = async (req, res) => {
  const {
    catName,
    displayName,
    slug,
    pageTitle,
    pageKeywords,
    pageDescription,
    keyone,
    keytwo,
    keythree,
    catDesc,
    catDesc1,
    catDesc2,
  } = req.body;

  let images = {};
  if (req.files) {
    if (req.files.catImage && req.files.catImage[0]) {
      images.catImage = `/uploads/category/${req.files.catImage[0].filename}`;
    }
    if (req.files.cat_home_image && req.files.cat_home_image[0]) {
      images.cat_home_image = `/uploads/category/${req.files.cat_home_image[0].filename}`;
    }
    if (req.files.catBanner && req.files.catBanner[0]) {
      images.catBanner = `/uploads/category/${req.files.catBanner[0].filename}`;
    }
  }

  await Category.findByIdAndUpdate(req.params.id, {
    catName,
    displayName,
    description: {
      catDesc,
      catDesc1,
      catDesc2,
    },
    slug,
    images,
    meta: {
      pageTitle,
      pageKeywords,
      pageDescription,
      keyone,
      keytwo,
      keythree,
    },
  });

  res.redirect("/categories");
};

export const deleteCategory = async (req, res) => {
  let category = Category.findById(req.params.id);

  await Category.findByIdAndDelete(req.params.id);
  res.redirect("/categories");
};

export const listSubCategories = async (req, res) => {
  const { id } = req.params;

  const categories = await Category.find({ parentId: id })
    .sort({ createdAt: -1 })
    .lean();

  res.render("categories/list", { categories });
};
