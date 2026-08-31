import mongoose from "mongoose";
import "dotenv/config";
import user from "./models/user.js";

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to DB");
        const found = await user.findOne({ email: "aaa@gmail.com" });
        if (found) {
            console.log("User 'aaa@gmail.com' EXISTS in the database.");
        } else {
            console.log("User 'aaa@gmail.com' does NOT exist. You may need to REGISTER first.");
        }
        process.exit(0);
    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
};

checkUser();
