import mongoose from "mongoose";
import { type } from "os";

const categorySchema = new mongoose.Schema(
  {
    catName: { type: String, required: true },
    slug: { type: String, index: true },
    parentId: { type: mongoose.ObjectId, ref: "Category", default: null },
    displayName: String,
    images: {
      catImage: String,
      cat_home_image: String,
      catBanner: String,
    },
    description: {
      catDesc: String,
      catDesc1: String,
      catDesc2: String,
    },
    meta: {
      pageTitle: String,
      pageKeywords: String,
      pageDescription: String,
      keyone: String,
      keytwo: String,
      keythree: String,
    },
    order: Number,
    status: { type: String, enum: ["Y", "N"], default: "Y" },
    header_menu: { type: Boolean, default: true },
    _oldId: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
