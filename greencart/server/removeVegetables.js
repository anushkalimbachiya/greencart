import mongoose from "mongoose";
import connectDB from "./configs/db.js";
import "dotenv/config";
import productModel from "./models/product.js";

const removeVegetables = async () => {
    try {
        await connectDB();
        console.log("Connected to DB. Removing vegetables...");
        
        const result = await productModel.deleteMany({ category: "Vegetables" });
        console.log(`Deleted ${result.deletedCount} vegetable product(s).`);
        process.exit(0);
    } catch (error) {
        console.error("Error removing products:", error);
        process.exit(1);
    }
};

removeVegetables();
