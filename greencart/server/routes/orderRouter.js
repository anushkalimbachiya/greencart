import express from "express";
import authUser from "../middlewares/authUser.js";
import authSeller from "../middlewares/authSeller.js";
import { placeOrderCOD, placeOrderStripe, verifyStripe, getUserOrders, getAllOrders, updateStatus } from "../controllers/orderController.js"; 

const router = express.Router();

router.post('/cod', authUser, placeOrderCOD);
router.post('/user', authUser, getUserOrders);
router.post('/seller', authSeller, getAllOrders);
router.post('/status', authSeller, updateStatus);
router.post('/stripe', authUser, placeOrderStripe);
router.post('/verifyStripe', authUser, verifyStripe);

export default router;
