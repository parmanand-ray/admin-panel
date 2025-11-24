import Category from "../models/Category.js";
import slugify from "slugify";
import path from "path";
import fs from "fs";
export const listCategories = async (req, res) => {
  let { id } = req.params;

  // if no id passed → root level
  if (!id) {
    id = null;
  }

  // if id is literally "0" (string) → treat as root
  if (id === "0") {
    id = null;
  }

  const categories = await Category.find({ parentId: id })
    .sort({ createdAt: -1 })
    .lean();

  if (id === null) {
    id = 0;
  }

  res.render("categories/list", { categories, id });
};

export const addCategoryForm = (req, res) => {
  let id = 0;
  if (req.params.id) {
    id = req.params.id;
  }
  res.render("categories/add", { id });
};

export const createCategory = async (req, res) => {
  try {
    let {
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

    // Only convert "0" (root) → null
    if (parentId === "0") {
      parentId = null;
    }

    // Images
    let images = {};
    if (req.files?.catImage?.[0]) {
      images.catImage = `/uploads/category/${req.files.catImage[0].filename}`;
    }
    if (req.files?.cat_home_image?.[0]) {
      images.cat_home_image = `/uploads/category/${req.files.cat_home_image[0].filename}`;
    }
    if (req.files?.catBanner?.[0]) {
      images.catBanner = `/uploads/category/${req.files.catBanner[0].filename}`;
    }

    const nextOrder = (await Category.countDocuments()) + 1;

    const categoryData = {
      catName,
      displayName,
      slug,
      parentId, // correct value now
      order: nextOrder,
      description: { catDesc, catDesc1, catDesc2 },
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

    await Category.create(categoryData);

    // Redirect correctly
    res.redirect(`/categories/${parentId === null ? 0 : parentId}`);
  } catch (error) {
    console.error(error);
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

