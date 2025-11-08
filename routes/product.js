import express from "express";
import {listProducts,addProductForm,createProduct,editProductForm,updateProduct,toggleProductStatus, } from "../controllers/productController.js";

import getMulterUpload from "../middlewares/upload.js";

const router = express.Router();
const upload = getMulterUpload("products");

router.get("/", listProducts);
router.get("/add", addProductForm);
router.get("/edit/:id", editProductForm);
router.post("/add", upload.array("productImages", 10), createProduct);
router.put("/edit/:id", upload.array("productImages", 10), updateProduct);
router.put("/toggle-status/:id", toggleProductStatus);

export default router;
