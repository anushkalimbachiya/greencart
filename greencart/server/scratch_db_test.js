import mongoose from "mongoose";
import "dotenv/config";

const testDB = async () => {
    console.log("Testing DB connection...");
    console.log("URL:", process.env.MONGODB_URL);
    try {
        await mongoose.connect(process.env.MONGODB_URL, { serverSelectionTimeoutMS: 5000 });
        console.log("SUCCESS: Connected to DB");
        process.exit(0);
    } catch (error) {
        console.error("FAILURE: Could not connect to DB");
        console.error(error.message);
        process.exit(1);
    }
};

testDB();
