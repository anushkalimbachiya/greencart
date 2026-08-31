import { v2 as cloudinary } from "cloudinary";
import product from "../models/product.js";

// Add Product : /api/product/add
export const addProduct = async (req, res) => {
    try {
        console.log("Adding Product...");

        if (!req.body.productData) {
            return res.json({ success: false, message: "Product data is missing" });
        }

        let productData = JSON.parse(req.body.productData);
        const images = req.files || [];

        if (images.length === 0) {
            return res.json({ success: false, message: "Please upload at least one image" });
        }

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                // Convert buffer to base64 data URI
                const b64 = Buffer.from(item.buffer).toString("base64");
                const dataURI = `data:${item.mimetype};base64,${b64}`;
                const result = await cloudinary.uploader.upload(dataURI);
                return result.secure_url;
            })
        );
        
        await product.create({ ...productData, image: imagesUrl });

        res.json({ success: true, message: "Product Added" });

    } catch (error) {
        console.log("Error in addProduct:", error);
        res.json({ success: false, message: error.message });
    }
}

// Get product list : /api/product/list
export const listProducts = async (req, res) => {
    try {
        const products = await product.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Remove product : /api/product/remove
export const removeProduct = async (req, res) => {
    try {
        await product.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Removed" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Get Single product : /api/product/id
export const productById = async (req, res) => {
    try {
        const { id } = req.body;
        const foundProduct = await product.findById(id); 
        res.json({ success: true, product: foundProduct });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Single product info (Legacy name for routes)
export const singleProduct = productById;

// Change product instock /api/product/instock
export const changeInstock = async (req, res) => {
    try {
        const { id, instock } = req.body;
        await product.findByIdAndUpdate(id, { instock });
        res.json({ success: true, message: "Product Instock Status Updated" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}