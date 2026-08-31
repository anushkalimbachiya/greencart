import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'user' },
    items: [{
        product: { type: String, required: true, ref: 'product' },
        quantity: { type: Number, required: true }
    }],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "order placed" },
    ispaid: { type: Boolean, required: true, default: false },
    paymenttype: { type: String, required: true }
}, { timestamps: true })

const Order = mongoose.models.order || mongoose.model("order", orderSchema);

export default Order;
