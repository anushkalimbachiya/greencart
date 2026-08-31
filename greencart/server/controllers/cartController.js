import User from "../models/user.js";

//Update User Cart : /api/cart/update

export const updateCart = async (req, res) => {
    try {
        const {userId, cartItems} = req.body;
        await User.findByIdAndUpdate(userId, {cartData:cartItems});
        res.json({success: true, message: "Cart Updated"});
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}