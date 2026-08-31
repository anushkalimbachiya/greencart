import mongoose from "mongoose";
import connectDB from "./configs/db.js";
import "dotenv/config";
import productModel from "./models/product.js";

const removeTestProduct = async () => {
    try {
        await connectDB();
        console.log("Connected to DB. Removing 'Carrot Test'...");
        
        const result = await productModel.deleteOne({ name: "Carrot Test" });
        console.log(`Deleted ${result.deletedCount} product(s).`);
        process.exit(0);
    } catch (error) {
        console.error("Error removing product:", error);
        process.exit(1);
    }
};

removeTestProduct();
