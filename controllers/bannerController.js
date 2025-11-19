 import Banner from "../models/Banner.js"

 import path from "path";
 import fs from 'fs';

 export const listBanner = async (req, res) =>{
    const banners = (await Banner.find());
    res.render("banners/list",{banners});
 }

 export const addBannerForm = (req, res)=>{
    res.render('banners/add'); 
 }