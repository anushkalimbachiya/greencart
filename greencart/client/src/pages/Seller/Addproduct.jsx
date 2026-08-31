import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Addproduct = () => {

    const [files, setFiles] = useState([null, null, null, null]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Fruits");
    const [price, setPrice] = useState("");
    const [offerPrice, setOfferPrice] = useState("");

    const { axios } = useAppContext();

    const categories = [
        { name: "Fruits" },
        { name: "Vegetables" },
        { name: "Dairy" },
        { name: "Bakery" },
    ];

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();

            const formData = new FormData();

            // Prepare product data object
            const productData = {
                name,
                description,
                category: category, 
                price: Number(price),
                offerPrice: Number(offerPrice),
                instock: true
            }

            formData.append('productData', JSON.stringify(productData));

            // Append images
            files.forEach((file) => {
                if (file) {
                    formData.append('image', file);
                }
            });

            const { data } = await axios.post("/api/product/add", formData);

            if (data.success) {
                toast.success(data.message);
                setName("");
                setDescription("");
                setCategory("Fruits");
                setPrice("");
                setOfferPrice("");
                setFiles([null, null, null, null]);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        }
    }

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
            <form onSubmit={onSubmitHandler} className="p-4 md:p-6 space-y-5 max-w-lg">
                <div>
                    <p className="text-base font-medium">Product Image</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {files.map((file, index) => (
                            <label key={index} htmlFor={`image${index}`}>
                                <input onChange={(e) => {
                                    const updateFiles = [...files];
                                    updateFiles[index] = e.target.files[0];
                                    setFiles(updateFiles);
                                }} type="file" id={`image${index}`} hidden />
                                <img
                                    className="w-24 h-24 cursor-pointer object-cover border border-gray-300 rounded"
                                    src={file ? URL.createObjectURL(file) : assets.upload_area}
                                    alt="uploadArea"
                                />
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
                    <input onChange={(e) => setName(e.target.value)} value={name} id="product-name" type="text" placeholder="Type here" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 focus:border-primary" required />
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
                    <textarea
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        id="product-description" rows={4} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none focus:border-primary" placeholder="Type here"></textarea>
                </div>
                <div className="w-full flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="category">Category</label>
                    <select
                        onChange={(e) => setCategory(e.target.value)} value={category} id="category" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 focus:border-primary">
                        {categories.map((item, index) => (
                            <option key={index} value={item.name}>{item.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
                        <input
                            onChange={(e) => setPrice(e.target.value)} value={price}
                            id="product-price" type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 focus:border-primary" required />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
                        <input
                            onChange={(e) => setOfferPrice(e.target.value)} value={offerPrice}
                            id="offer-price" type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 focus:border-primary" required />
                    </div>
                </div>
                <button className="px-10 py-3 bg-primary text-white font-medium rounded hover:bg-primary/90 transition-colors">ADD PRODUCT</button>
            </form>
        </div>
    );
};

export default Addproduct;