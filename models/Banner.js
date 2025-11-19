import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
    banner_title : String,
    mobile_banner: String,
    desktop_banner:String,
    status : {
        type : String,
        enum : ['Y','N'],
        default: "Y"
    } 
})

export default mongoose.model("Banner", bannerSchema);