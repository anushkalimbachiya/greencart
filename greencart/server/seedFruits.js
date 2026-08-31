import mongoose from "mongoose";
import connectDB from "./configs/db.js";
import "dotenv/config";
import productModel from "./models/product.js";

const fruits = [
  {
    name: "Apple 1 kg",
    category: "Fruits",
    price: 100,
    offerPrice: 90,
    image: ["/src/assets/apple_image.png"],
    description: "Crisp and juicy\nRich in fiber\nBoosts immunity\nPerfect for snacking and desserts\nOrganic and farm fresh",
    instock: true,
  },
  {
    name: "Orange 1 kg",
    category: "Fruits",
    price: 80,
    offerPrice: 75,
    image: ["/src/assets/orange_image.png"],
    description: "Juicy and sweet\nRich in Vitamin C\nPerfect for juices and salads",
    instock: true,
  },
  {
    name: "Banana 1 kg",
    category: "Fruits",
    price: 50,
    offerPrice: 45,
    image: ["/src/assets/banana_image_1.png"],
    description: "Sweet and ripe\nHigh in potassium\nGreat for smoothies and snacking",
    instock: true,
  },
  {
    name: "Mango 1 kg",
    category: "Fruits",
    price: 150,
    offerPrice: 140,
    image: ["/src/assets/mango_image_1.png"],
    description: "Sweet and flavorful\nPerfect for smoothies and desserts\nRich in Vitamin A",
    instock: true,
  },
  {
    name: "Grapes 500g",
    category: "Fruits",
    price: 70,
    offerPrice: 65,
    image: ["/src/assets/grapes_image_1.png"],
    description: "Fresh and juicy\nRich in antioxidants\nPerfect for snacking and fruit salads",
    instock: true,
  }
];

const seedFruits = async () => {
    try {
        await connectDB();
        console.log("Connected to DB. Seeding fruits...");
        
        await productModel.insertMany(fruits);
        console.log("Successfully seeded fruit products!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding fruits:", error);
        process.exit(1);
    }
};

seedFruits();
