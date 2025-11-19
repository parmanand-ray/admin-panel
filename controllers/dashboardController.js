import Category from "../models/Category.js";
import Product from "../models/Product.js";

export const getDashboard = async (req, res) => {
  try {
    // CATEGORY STATS
    const totalCategories = await Category.countDocuments();
    const activeCategories = await Category.countDocuments({ status: "Y" });
    const inactiveCategories = await Category.countDocuments({ status: "N" });

    // PRODUCT STATS
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ product_status: "Y" });
    const inactiveProducts = await Product.countDocuments({ product_status: "N" });

    // IMAGE STATS (if you store multiple images per product)
    const totalImages = await Product.aggregate([
      { $unwind: "$images" },
      { $count: "total" }
    ]);
    const imageCount = totalImages.length > 0 ? totalImages[0].total : 0;

    // Render Dashboard
    res.render("dashboard/dashboard", {
      layout: "layout",
      totalCategories,
      activeCategories,
      inactiveCategories,
      totalProducts,
      activeProducts,
      inactiveProducts,
      imageCount
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).send("Internal Server Error");
  }
};
