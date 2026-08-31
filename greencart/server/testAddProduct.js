import jwt from "jsonwebtoken";
import FormData from "form-data";
import fs from "fs";
import axios from "axios";

const token = jwt.sign({ email: "admin@example.com", id: "adminId" }, "secr#text");

const form = new FormData();
form.append('productData', JSON.stringify({
    name: "Apple",
    description: "Fresh apple",
    category: ["Fruits"],
    price: 10,
    offerPrice: 8,
    instock: true
}));

const buffer = Buffer.from("dummy image data");
form.append('image', buffer, { filename: 'apple.png', contentType: 'image/png' });

axios.post("http://localhost:4000/api/product/add", form, {
    headers: {
        ...form.getHeaders(),
        Cookie: `sellerToken=${token}`
    }
}).then(res => console.log(res.data)).catch(err => {
    console.log(err.response ? err.response.data : err.message);
});
