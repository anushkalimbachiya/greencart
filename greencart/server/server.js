import express from "express";
import mongoose from "mongoose";
// SET BUFFERING TIMEOUT GLOBALLY AT THE VERY START
mongoose.set('bufferTimeoutMS', 40000); 
mongoose.set('bufferCommands', true); 

import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./configs/db.js";
import "dotenv/config";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectcloudinary from "./configs/Cloudinary.js";
import cartRouter from "./routes/cartRouter.js";
import orderRouter from "./routes/orderRouter.js"; 
import addressRouter from "./routes/addressRouter.js"; 

const app = express();
const port = process.env.PORT || 4000;

const startServer = async () => {
    try {
        console.log("Starting server initialization...");
        
        // Connect to Database (with timeout handled in db.js)
        await connectDB();
        
        // Configure Cloudinary
        connectcloudinary(); 

        // Middleware
        app.use(express.json());
        app.use(cookieParser());
        // Configure CORS for local development and live deployment
        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:3000"
        ];
        if (process.env.CLIENT_URL) {
            process.env.CLIENT_URL.split(",").forEach(url => allowedOrigins.push(url.trim()));
        }

        app.use(cors({
            origin: function (origin, callback) {
                if (!origin) return callback(null, true);
                if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
                    return callback(null, true);
                }
                return callback(null, true); // Allow during initial deployment setup
            },
            credentials: true
        }));

        // Routes
        app.get('/', (req, res) => res.send("API is working"));
        app.use("/api/user", userRouter);
        app.use("/api/product", productRouter);
        app.use("/api/seller", sellerRouter);
        app.use("/api/cart", cartRouter);
        app.use("/api/address", addressRouter);
        app.use("/api/order", orderRouter);

        // Error Handler
        app.use((err, req, res, next) => {
            console.error("SERVER ERROR:", err);
            res.status(500).json({ success: false, message: err.message });
        });

        // Check connection state
        console.log("Mongoose Connection State:", mongoose.connection.readyState); 
        // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

        // Listen
        app.listen(port, '0.0.0.0', () => {
            console.log(`Server is running on http://localhost:${port}`);
        });

        // Keep process alive if something weird is happening with the event loop
        setInterval(() => {
            // This just keeps the event loop active
        }, 60000);

    } catch (error) {
        console.error("FATAL ERROR DURING STARTUP:", error);
        process.exit(1);
    }
};

startServer();

