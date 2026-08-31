import mongoose from "mongoose";
import connectDB from "./configs/db.js";
import "dotenv/config";
import productModel from "./models/product.js";

const vegetables = [
  {
    name: "Potato 500g",
    category: "Vegetables",
    price: 40,
    offerPrice: 35,
    image: [
      "/src/assets/potato_image_1.png",
      "/src/assets/potato_image_2.png",
      "/src/assets/potato_image_3.png",
      "/src/assets/potato_image_4.png"
    ],
    description: "Fresh and organic\nRich in carbohydrates\nIdeal for curries and fries",
    instock: true,
  },
  {
    name: "Tomato 1 kg",
    category: "Vegetables",
    price: 30,
    offerPrice: 28,
    image: ["/src/assets/tomato_image.png"],
    description: "Juicy and ripe\nRich in Vitamin C\nPerfect for salads and sauces\nFarm fresh quality",
    instock: true,
  },
  {
    name: "Carrot 500g",
    category: "Vegetables",
    price: 50,
    offerPrice: 44,
    image: ["/src/assets/carrot_image.png"],
    description: "Sweet and crunchy\nGood for eyesight\nIdeal for juices and salads",
    instock: true,
  },
  {
    name: "Spinach 500g",
    category: "Vegetables",
    price: 18,
    offerPrice: 15,
    image: ["/src/assets/spinach_image_1.png"],
    description: "Rich in iron\nHigh in vitamins\nPerfect for soups and salads",
    instock: true,
  },
  {
    name: "Onion 500g",
    category: "Vegetables",
    price: 50,
    offerPrice: 45,
    image: ["/src/assets/onion_image_1.png"],
    description: "Fresh and pungent\nPerfect for cooking\nA kitchen staple",
    instock: true,
  }
];

const seedVegetables = async () => {
    try {
        await connectDB();
        console.log("Connected to DB. Seeding vegetables...");
        
        // Delete existing carrots test or any existing vegetables to avoid duplicates (optional, but let's just insert)
        // Actually let's just insert them directly
        await productModel.insertMany(vegetables);
        console.log("Successfully seeded vegetable products!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding vegetables:", error);
        process.exit(1);
    }
};

seedVegetables();
