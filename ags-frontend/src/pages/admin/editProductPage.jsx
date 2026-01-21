import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { mediaUpload } from "../../utils/mediaUpload";

export default function EditProductPage() {
    const location = useLocation();
    const { id } = useParams();
    const productData = location.state;

    const [productId, setProductId] = useState(productData?.productId || productData?.ProductId || id || "");
    const [name, setName] = useState(productData?.name || "");
    const [altNames, setAltNames] = useState(productData?.altNames?.join(",") || "");
    const [description, setDescription] = useState(productData?.description || "");
    const [images, setImages] = useState([]);
    const [labelledPrice, setLabelledPrice] = useState(productData?.labelledPrice || 0);
    const [price, setPrice] = useState(productData?.price || 0);
    const [stock, setStock] = useState(productData?.stock || 0);
    const navigate = useNavigate();

    async function UpdateProduct() {
        if (!productId) {
            toast.error("Product ID is required");
            return;
        }

        const token = sessionStorage.getItem("token");
        if (token == null) {
            toast.error("Please Login First");
            return;
        }

        let imageUrls = productData?.image || [];
        const promisesArray = [];

        for (let i = 0; i < images.length; i++) {
            promisesArray[i] = mediaUpload(images[i]);
        }

        try {
            if (images.length > 0) {
                imageUrls = await Promise.all(promisesArray);
            }

            console.log(imageUrls);

            const altNamesArray = altNames 
                ? altNames.split(",").filter(name => name.trim() !== "") 
                : [];

            const product = {
                productId: productId,
                name: name,
                altNames: altNamesArray,
                description: description,
                image: imageUrls,
                labelledPrice: parseFloat(labelledPrice),
                price: parseFloat(price),
                stock: parseInt(stock)
            };

            axios.put(import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId, product, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            }).then((res) => {
                toast.success("Product Updated Successfully");
                navigate("/admin/products");
            }).catch((e) => {
                console.log("Error details:", e);
                console.log("Error response:", e.response);
                const errorMessage = e.response?.data?.message || e.message || "Failed to update product";
                toast.error(errorMessage);
            });

        } catch (e) {
            console.log(e);
            toast.error("Failed to update images: " + e);
        }
    }

    return (
        <div className="w-full h-full p-4 md:p-6 overflow-y-auto bg-linear-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-secondary mb-2">Edit Product</h1>
                <p className="text-sm md:text-base text-gray-600">Update the product details below</p>
            </div>

            {/* Form Container */}
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-8">
                
                {/* Product ID & Name Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                    <div>
                        <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Product ID *</label>
                        <input 
                            type="text" 
                            placeholder="e.g., PROD_001_MOISTURIZER" 
                            disabled
                            className="input input-bordered w-full border-2 border-gray-300 focus:border-accent focus:outline-none rounded-lg px-4 py-2 text-sm md:text-base bg-gray-50"
                            value={productId} 
                            onChange={(e)=>setProductId(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">Unique identifier (cannot be changed)</p>
                    </div>
                    <div>
                        <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                        <input 
                            type="text" 
                            placeholder="e.g., Hydrating Face Moisturizer" 
                            className="input input-bordered w-full border-2 border-gray-300 focus:border-accent focus:outline-none rounded-lg px-4 py-2 text-sm md:text-base"
                            value={name} 
                            onChange={(e)=>setName(e.target.value)}
                        />
                    </div>
                </div>

                {/* Alternative Names */}
                <div className="mb-6">
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Alternative Names</label>
                    <input 
                        type="text" 
                        placeholder="e.g., Daily Hydration Cream, Moisture Boost Lotion (comma separated)" 
                        className="input input-bordered w-full border-2 border-gray-300 focus:border-accent focus:outline-none rounded-lg px-4 py-2 text-sm md:text-base"
                        value={altNames} 
                        onChange={(e)=>setAltNames(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate multiple names with commas</p>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Description *</label>
                    <textarea 
                        placeholder="Enter detailed product description..." 
                        className="w-full border-2 border-gray-300 focus:border-accent focus:outline-none rounded-lg px-4 py-2 min-h-28 resize-none text-sm md:text-base"
                        value={description} 
                        onChange={(e)=>setDescription(e.target.value)}
                    />
                </div>

                {/* Pricing Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                    <div>
                        <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Labelled Price (LKR) *</label>
                        <input 
                            type="number" 
                            placeholder="e.g., 45000" 
                            className="input input-bordered w-full border-2 border-gray-300 focus:border-accent focus:outline-none rounded-lg px-4 py-2 text-sm md:text-base"
                            value={labelledPrice} 
                            onChange={(e)=>setLabelledPrice(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">Original/marked price in LKR</p>
                    </div>
                    <div>
                        <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Selling Price (LKR) *</label>
                        <input 
                            type="number" 
                            placeholder="e.g., 32000" 
                            className="input input-bordered w-full border-2 border-gray-300 focus:border-accent focus:outline-none rounded-lg px-4 py-2 text-sm md:text-base"
                            value={price} 
                            onChange={(e)=>setPrice(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">Final selling price in LKR</p>
                    </div>
                </div>

                {/* Stock */}
                <div className="mb-6">
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Stock Quantity *</label>
                    <input 
                        type="number" 
                        placeholder="e.g., 50" 
                        className="input input-bordered w-full border-2 border-gray-300 focus:border-accent focus:outline-none rounded-lg px-4 py-2 text-sm md:text-base"
                        value={stock} 
                        onChange={(e)=>setStock(e.target.value)}
                    />
                </div>

                {/* Images Upload */}
                <div className="mb-8">
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Product Images</label>
                    <div className="border-2 border-dashed border-accent rounded-lg p-4 md:p-6 text-center cursor-pointer hover:bg-blue-50 transition">
                        <input 
                            type="file" 
                            multiple 
                            className="hidden" 
                            id="imageInput"
                            onChange={(e)=>setImages(e.target.files)}
                        />
                        <label htmlFor="imageInput" className="block cursor-pointer">
                            <div className="text-accent text-2xl md:text-3xl mb-2">📸</div>
                            <p className="font-semibold text-sm md:text-base text-gray-700">Click to select images</p>
                            <p className="text-xs text-gray-500 mt-1">Leave blank to keep existing images</p>
                        </label>
                    </div>
                    {images.length > 0 && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs md:text-sm text-accent font-semibold">✓ {images.length} new image(s) selected</p>
                        </div>
                    )}
                    {productData?.image?.length > 0 && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                            <p className="text-xs md:text-sm text-green-700 font-semibold">✓ {productData.image.length} existing image(s)</p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-4 pt-6 border-t border-gray-200">
                    <Link 
                        to="/admin/products" 
                        className="px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition text-center text-sm md:text-base"
                    >
                        Cancel
                    </Link>
                    <button 
                        onClick={UpdateProduct}
                        className="px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold bg-accent text-white hover:bg-secondary transition shadow-md text-sm md:text-base"
                    >
                        Update Product
                    </button>
                </div>
            </div>
        </div>
    );
}