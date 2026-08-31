import mongoose from "mongoose";
import connectDB from "./configs/db.js";
import "dotenv/config";
import productModel from "./models/product.js";
import orderModel from "./models/order.js";

const dummyAddress = {
    _id: "67b5b9e54ea97f71bbc196a0",
    userId: "67b5880e4d09769c5ca61644",
    firstName: "Great",
    lastName: "Stack",
    email: "user.greatstack@gmail.com",
    street: "Street 123",
    city: "Main City",
    state: "New State",
    zipcode: 123456,
    country: "IN",
    phone: "1234567890",
};

const seedOrders = async () => {
    try {
        await connectDB();
        console.log("Connected to DB. Finding products...");

        const spinach = await productModel.findOne({ name: "Spinach 500g" });
        const potato = await productModel.findOne({ name: "Potato 500g" });
        const tomato = await productModel.findOne({ name: "Tomato 1 kg" });

        if (!spinach || !potato || !tomato) {
            console.error("Missing products. Make sure DB is seeded.");
            process.exit(1);
        }

        // Clear existing orders
        await orderModel.deleteMany({});
        
        const orders = [
            {
                userId: "67b5880e4d09769c5ca61644",
                items: [
                    {
                        product: spinach._id,
                        quantity: 2
                    }
                ],
                amount: 89,
                address: dummyAddress,
                status: "Order Placed",
                paymenttype: "Online",
                ispaid: true,
                createdAt: new Date("2025-03-25T07:17:46.018Z"),
                updatedAt: new Date("2025-03-25T07:18:13.103Z"),
            },
            {
                userId: "67b5880e4d09769c5ca61644",
                items: [
                    {
                        product: potato._id,
                        quantity: 1
                    },
                    {
                        product: tomato._id,
                        quantity: 1
                    }
                ],
                amount: 43,
                address: dummyAddress,
                status: "Order Placed",
                paymenttype: "COD",
                ispaid: false,
                createdAt: new Date("2025-03-25T07:17:13.068Z"),
                updatedAt: new Date("2025-03-25T07:17:13.068Z"),
            }
        ];

        await orderModel.insertMany(orders);
        console.log("Successfully seeded dummy orders!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding orders:", error);
        process.exit(1);
    }
};

seedOrders();
