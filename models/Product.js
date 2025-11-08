import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  product_title: { type: String, required: true },
  product_code: String,
  product_desc: String,
  product_specfi:String,
  product_cat: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Category" }
  ],
  product_video: String,
  images: [String],
  product_status: {
  type: String,
  enum: ["Y", "N"], // Y = Active, N = Inactive
  default: "Y"
},
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
