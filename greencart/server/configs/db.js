import mongoose from "mongoose";

// Increase the buffering timeout to 30 seconds globally
mongoose.set('bufferTimeoutMS', 30000); 
mongoose.set('bufferCommands', true); 

const connectDB = async () => {
    try {

        mongoose.connection.on("connected", () => {
            console.log("DATABASE Connected");
        });
        
        mongoose.connection.on("error", (err) => {
            console.error("Mongoose connection error:", err);
        });

        // Increase timeouts as requested
        await mongoose.connect(process.env.MONGODB_URL, {
            serverSelectionTimeoutMS: 30000, 
            connectTimeoutMS: 30000,
            // Increase buffering timeout for operations (like login)
            bufferCommands: true,
            autoIndex: true,
        });
        
    } catch (error) {
        console.error("Database Connection Failed:", error.message);
    }
}

export default connectDB;