import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import connectcloudinary from "./configs/Cloudinary.js";

connectcloudinary();
console.log(cloudinary.config());
