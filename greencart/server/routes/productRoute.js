import express from "express";
import { addProduct, listProducts, productById, removeProduct, singleProduct, changeInstock } from "../controllers/productController.js";
import { upload } from "../configs/multer.js";
import authSeller from "../middlewares/authSeller.js";

const productRouter = express.Router();
import productModel from "../models/product.js";


productRouter.post("/add", upload.array('image', 4), authSeller, addProduct);
productRouter.post("/stock", authSeller, changeInstock);
productRouter.post("/id", productById);
productRouter.get("/list", listProducts);

export default productRouter;
