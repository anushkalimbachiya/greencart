import order from '../models/order.js';
import product from '../models/product.js';
import Stripe from 'stripe';

// place order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address, paymentType } = req.body;

        if (!address || !items || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" });
        }

        // Calculate total amount
        let amount = 0;
        for (const item of items) {
            const productData = await product.findById(item.product);
            if (productData) {
                // Use offerPrice for calculation
                amount += productData.offerPrice * item.quantity;
            }
        }

        // Add Tax (2%)
        amount += Math.floor(amount * 0.02);

        const newOrder = await order.create({
            userId,
            items,
            amount,
            address,
            paymenttype: paymentType || "COD",
            ispaid: false
        });

        res.json({ success: true, message: "Order Placed Successfully", orderId: newOrder._id });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// place order Stripe : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        const { origin } = req.headers;

        if (!address || !items || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" });
        }

        let amount = 0;
        const line_items = [];

        for (const item of items) {
            const productData = await product.findById(item.product);
            if (productData) {
                amount += productData.offerPrice * item.quantity;
                line_items.push({
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: productData.name
                        },
                        unit_amount: Math.floor(productData.offerPrice * 1.02 * 100) // Price + 2% tax in paise
                    },
                    quantity: item.quantity
                });
            }
        }

        const newOrder = await order.create({
            userId,
            items,
            amount: amount + Math.floor(amount * 0.02),
            address,
            paymenttype: "Stripe",
            ispaid: false
        });

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/order-tracking/${newOrder._id}?success=true&type=stripe`,
            cancel_url: `${origin}/my-orders`,
            line_items,
            mode: 'payment',
            metadata: { orderId: newOrder._id.toString() }
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// verify Stripe payment : /api/order/verifyStripe
export const verifyStripe = async (req, res) => {
    try {
        const { orderId, success } = req.body;
        if (success === "true") {
            await order.findByIdAndUpdate(orderId, { ispaid: true });
            res.json({ success: true, message: "Order Placed Successfully" });
        } else {
            await order.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment Failed" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
} 
 

// Get Order by User ID : /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await order.find({ userId }).populate("items.product").sort({ createdAt: -1 })
        res.json({ success: true, orders: orders });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//get All Order (for seller /admin) : /api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await order.find({}).populate("items.product").sort({ createdAt: -1 })
        res.json({ success: true, orders: orders });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// update status : /api/order/status
export const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await order.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
