import express from "express";
import multer  from "multer";
import fs from 'fs';
import path from "path";

import { listBanner, addBannerForm, createBanner, editBannerForm,updateBanner, deleteBanner } from "../controllers/bannerController.js";

import getMulterUpload from "../middlewares/upload.js";

const router = express.Router();

const upload = getMulterUpload("banners");

router.get('/',listBanner);
router.get('/add',addBannerForm); 
router.post('/add',upload.fields([{name : "desktop_banner", maxCount:1},{name:"mobile_banner", maxCount:1}]),createBanner);

router.get('/edit/:id',editBannerForm);

router.put('/edit/:id',upload.fields([{name : "desktop_banner", maxCount:1},{name:"mobile_banner", maxCount:1}]), updateBanner);

router.delete('/delete/:id', deleteBanner)

export default router;