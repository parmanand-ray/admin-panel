import express from "express";
import multer  from "multer";
import fs from 'fs';
import path from "path";

import { listBanner, addBannerForm } from "../controllers/bannerController.js";

import getMulterUpload from "../middlewares/upload.js";

const router = express.Router();

const upload = getMulterUpload("banners");

router.get('/',listBanner);
router.get('/add',addBannerForm); 

export default router;