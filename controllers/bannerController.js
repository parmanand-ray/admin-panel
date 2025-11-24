 import Banner from "../models/Banner.js"
import upload from "../middlewares/upload.js";
 import path from "path";
 import fs from 'fs';

 export const listBanner = async (req, res) =>{
    const banners = (await Banner.find());
    res.render("banners/list",{banners});
 }

 export const addBannerForm = (req, res)=>{
    res.render('banners/add');  
 }

export const createBanner = async (req, res) => {
  try {
    let { banner_title } = req.body;
    let desktop_banner = null;
    let mobile_banner = null;

    

    if (req.files && req.files.desktop_banner?.length > 0) {
      desktop_banner = "/uploads/banners/" + req.files.desktop_banner[0].filename;
    }

    if (req.files && req.files.mobile_banner?.length > 0) {
      mobile_banner = "/uploads/banners/" + req.files.mobile_banner[0].filename;
    }

    const nextOrder = (await Banner.countDocuments()) + 1;

    await Banner.create({
      banner_title,
      desktop_banner,
      mobile_banner,
      order: nextOrder
    });

    res.redirect("/banners");

  } catch (error) {
    console.error("🔥 Banner Create Error:", error);
    res.status(500).send("Server Error — contact developer");
  }
};

export const editBannerForm = async (req, res) =>{
   const banner = await Banner.findById(req.params.id);

   if(!banner) return res.send ('Banner not found');

   res.render("banners/edit",{banner});
}

export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).send("Banner not found");

    const { banner_title } = req.body;

    // Keep old images by default
    let desktop_banner = banner.desktop_banner;
    let mobile_banner = banner.mobile_banner;

    // -----------------------------
    // UPDATE DESKTOP BANNER
    // -----------------------------
    if (req.files?.desktop_banner?.[0]) {
      const newFile = req.files.desktop_banner[0].filename;
      const newPath = `/uploads/banners/${newFile}`;

      // Delete old file if exists
      if (banner.desktop_banner) {
        const oldPath = path.join("public", banner.desktop_banner);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      desktop_banner = newPath;
    }

    // -----------------------------
    // UPDATE MOBILE BANNER
    // -----------------------------
    if (req.files?.mobile_banner?.[0]) {
      const newFile = req.files.mobile_banner[0].filename;
      const newPath = `/uploads/banners/${newFile}`;

      // Delete old file if exists
      if (banner.mobile_banner) {
        const oldPath = path.join("public", banner.mobile_banner);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      mobile_banner = newPath;
    }

    // -----------------------------
    // UPDATE DB
    // -----------------------------
    await Banner.findByIdAndUpdate(req.params.id, {
      banner_title,
      desktop_banner,
      mobile_banner,
    });

    res.redirect("/banners");

  } catch (error) {
    console.error("🔥 Update Banner Error:", error);
    res.status(500).send("Server Error");
  }
};

export const deleteBanner = async (req,res) => {
   let banner = await Banner.findById(req.params.id);

   if(banner.desktop_banner){
      let bannerPath = path.join('public',banner.desktop_banner);

      if(fs.existsSync(bannerPath)){
         fs.unlinkSync(bannerPath);
      }
   }
   if(banner.mobile_banner){
      let bannerPath = path.join('public',banner.mobile_banner);

      if(fs.existsSync(bannerPath)){
         fs.unlinkSync(bannerPath);
      }
   }

   await Banner.findByIdAndDelete(req.params.id);
   res.redirect('/banners')
}
