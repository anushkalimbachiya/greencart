import jwt from "jsonwebtoken";
import fs from "fs";

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

const base64Pixel = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
const buffer = Buffer.from(base64Pixel, "base64");
form.append('image', new Blob([buffer], { type: 'image/png' }), 'pixel.png');

fetch("http://localhost:4000/api/product/add", {
    method: "POST",
    headers: {
        Cookie: `sellerToken=${token}`
    },
    body: form
}).then(res => res.text()).then(text => console.log(text)).catch(err => {
    console.log(err);
});
