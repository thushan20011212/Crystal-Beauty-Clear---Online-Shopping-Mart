import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { mediaUpload } from "../../utils/mediaUpload.jsx";

export default function AddProductPage() {
    const [productId, setProductId] = useState("");
    const [name, setName] = useState("");
    const [altNames, setAltNames] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [labelledPrice, setLabelledPrice] = useState(0);
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const navigate = useNavigate();

    async function AddProduct() {
        const token = localStorage.getItem("token");
        
        if (token == null) {
            toast.error("Please Login First");
            return;
        }

        if (images.length <= 0) {
            toast.error("Please select at least one image");
            return;
        }

        // Validate required fields
        if (!productId || !name || !description || !labelledPrice || !price || !stock) {
            toast.error("Please fill in all required fields");
            return;
        }

        const promisesArray = [];
        for (let i = 0; i < images.length; i++) {
            promisesArray[i] = mediaUpload(images[i]);
        }

        try {
            const imageUrls = await Promise.all(promisesArray);
            console.log("Image URLs uploaded:", imageUrls);

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
                stock: parseInt(stock),
                isAvailabel: true
            };
            
            console.log("Product being sent:", product);

            axios.post(import.meta.env.VITE_BACKEND_URL + "/api/products", product, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            }).then((res) => {
                toast.success("Product Added Successfully");
                navigate("/admin/products");
            }).catch((e) => {
                console.log("Error details:", e);
                console.log("Error response:", e.response);
                const errorMessage = e.response?.data?.message || e.message || "Failed to add product";
                toast.error(errorMessage);
            });

        } catch (e) {
            console.log("Upload error:", e);
            toast.error("Failed to upload images: " + e);
        }
    }

    return (
        <div className="w-full min-h-screen bg-primary p-4 md:p-8">
            
            {/* Header */}
            <div className="max-w-4xl mx-auto mb-6">
                <div className="bg-neutral rounded-2xl shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-secondary mb-2">Add New Product</h1>
                    <p className="text-muted">Fill in all the details below to create a new product</p>
                </div>
            </div>

            {/* Form Container */}
            <div className="max-w-4xl mx-auto bg-neutral rounded-2xl shadow-lg p-6 md:p-8">
                
                {/* Product ID & Name Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-bold text-secondary mb-2">Product ID *</label>
                        <input 
                            type="text" 
                            placeholder="e.g., PROD_001_MOISTURIZER" 
                            className="w-full h-12 border-2 border-accent rounded-xl px-4 bg-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition"
                            value={productId} 
                            onChange={(e)=>setProductId(e.target.value)}
                        />
                        <p className="text-xs text-muted mt-1">Unique identifier for the product</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-secondary mb-2">Product Name *</label>
                        <input 
                            type="text" 
                            placeholder="e.g., Hydrating Face Moisturizer" 
                            className="w-full h-12 border-2 border-accent rounded-xl px-4 bg-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition"
                            value={name} 
                            onChange={(e)=>setName(e.target.value)}
                        />
                    </div>
                </div>

                {/* Alternative Names */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-secondary mb-2">Alternative Names</label>
                    <input 
                        type="text" 
                        placeholder="e.g., Daily Hydration Cream, Moisture Boost Lotion (comma separated)" 
                        className="w-full h-12 border-2 border-accent rounded-xl px-4 bg-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition"
                        value={altNames} 
                        onChange={(e)=>setAltNames(e.target.value)}
                    />
                    <p className="text-xs text-muted mt-1">Separate multiple names with commas</p>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-secondary mb-2">Description *</label>
                    <textarea 
                        placeholder="Enter detailed product description..." 
                        className="w-full border-2 border-accent rounded-xl px-4 py-3 bg-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition min-h-32 resize-none"
                        value={description} 
                        onChange={(e)=>setDescription(e.target.value)}
                    />
                </div>

                {/* Pricing Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-bold text-secondary mb-2">Labelled Price (LKR) *</label>
                        <input 
                            type="number" 
                            placeholder="e.g., 45000" 
                            className="w-full h-12 border-2 border-accent rounded-xl px-4 bg-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition"
                            value={labelledPrice} 
                            onChange={(e)=>setLabelledPrice(e.target.value)}
                        />
                        <p className="text-xs text-muted mt-1">Original/marked price in LKR</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-secondary mb-2">Selling Price (LKR) *</label>
                        <input 
                            type="number" 
                            placeholder="e.g., 32000" 
                            className="w-full h-12 border-2 border-accent rounded-xl px-4 bg-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition"
                            value={price} 
                            onChange={(e)=>setPrice(e.target.value)}
                        />
                        <p className="text-xs text-muted mt-1">Final selling price in LKR</p>
                    </div>
                </div>

                {/* Stock */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-secondary mb-2">Stock Quantity *</label>
                    <input 
                        type="number" 
                        placeholder="e.g., 50" 
                        className="w-full h-12 border-2 border-accent rounded-xl px-4 bg-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition"
                        value={stock} 
                        onChange={(e)=>setStock(e.target.value)}
                    />
                </div>

                {/* Images Upload */}
                <div className="mb-8">
                    <label className="block text-sm font-bold text-secondary mb-2">Product Images *</label>
                    <div className="border-2 border-dashed border-accent/50 rounded-xl p-8 text-center cursor-pointer hover:bg-accent/5 hover:border-secondary transition">
                        <input 
                            type="file" 
                            multiple 
                            className="hidden" 
                            id="imageInput"
                            onChange={(e)=>setImages(e.target.files)}
                        />
                        <label htmlFor="imageInput" className="block cursor-pointer">
                            <div className="text-5xl mb-3">📸</div>
                            <p className="font-bold text-secondary mb-1">Click to select images</p>
                            <p className="text-sm text-muted">Supported: JPG, PNG, WebP</p>
                        </label>
                    </div>
                    {images.length > 0 && (
                        <div className="mt-3 p-4 bg-secondary/10 rounded-xl border border-secondary/20">
                            <p className="text-sm text-secondary font-bold">✓ {images.length} image(s) selected</p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 pt-6 border-t-2 border-accent/20">
                    <Link 
                        to="/admin/products" 
                        className="px-8 py-3 rounded-xl font-bold border-2 border-accent text-secondary hover:bg-accent/10 transition"
                    >
                        Cancel
                    </Link>
                    <button 
                        onClick={AddProduct}
                        className="px-8 py-3 rounded-xl font-bold bg-secondary text-neutral hover:bg-muted hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                        Add Product
                    </button>
                </div>
            </div>
        </div>
    );
}