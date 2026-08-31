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

const buffer = Buffer.from("dummy image data");
form.append('image', new Blob([buffer], { type: 'image/png' }), 'apple.png');

fetch("http://localhost:4000/api/product/add", {
    method: "POST",
    headers: {
        Cookie: `sellerToken=${token}`
    },
    body: form
}).then(res => res.text()).then(text => console.log(text)).catch(err => {
    console.log(err);
});
