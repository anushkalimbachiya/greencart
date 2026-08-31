import mongoose from "mongoose";
import connectDB from "./configs/db.js";
import "dotenv/config";
import productModel from "./models/product.js";

const checkDb = async () => {
    try {
        await connectDB();
        const products = await productModel.find({});
        console.log(`Found ${products.length} products`);
        console.log(products.slice(0, 1));
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkDb();
