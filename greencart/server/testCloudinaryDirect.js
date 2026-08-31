import { v2 as cloudinary } from "cloudinary";

const base64Pixel = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
const dataURI = `data:image/png;base64,${base64Pixel}`;

async function testCloudinary(secret) {
    cloudinary.config({
        cloud_name: 'dz0mlat9u',
        api_key: '949387262492734',
        api_secret: secret,
        secure: true
    });
    try {
        const res = await cloudinary.uploader.upload(dataURI);
        console.log(`SUCCESS with secret: ${secret}`);
        console.log(res.secure_url);
        return true;
    } catch (err) {
        console.log(`FAILED with secret: ${secret}`);
        console.log(err.message);
        return false;
    }
}

async function run() {
    await testCloudinary('aXDcG9RhEKUq2-T6eVZs75HZc5E');
}
run();
