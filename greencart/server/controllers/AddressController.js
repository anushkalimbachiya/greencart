import Address from "../models/Address.js";

// Add new address
export const addAddress = async (req, res) => {
    try {
        const { userId, firstName, lastName, email, street, city, state, zipcode, country, phone } = req.body;
        
        const addressData = {
            userId,
            firstName,
            lastName,
            email,
            street,
            city,
            state,
            zipcode,
            country,
            phone
        }

        const newAddress = new Address(addressData);
        await newAddress.save();

        res.json({ success: true, message: "Address Added" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get user addresses
export const getAddress = async (req, res) => {
    try {
        const { userId } = req.body;
        const address = await Address.find({ userId });
        res.json({ success: true, address });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
