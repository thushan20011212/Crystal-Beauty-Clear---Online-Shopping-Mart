import Product from "../models/product.js";
import mongoose from "mongoose";

// Helper function to check if string is valid MongoDB ObjectId
function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

export function getProducts(req, res) {
    Product.find()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
}

export function saveProduct(req, res) {
    const product = new Product({
        productId: req.body.productId,
        name: req.body.name,
        altNames: req.body.altNames,
        description: req.body.description,
        labelledPrice: req.body.labelledPrice,
        price: req.body.price,
        image: req.body.image,
        stock: req.body.stock,
        isAvailable: req.body.isAvailable,
    });

    product.save().then(() => {
        res.status(201).json({ 
            message: "Product created successfully" });
    })
    .catch((error) => {
        res.status(400).json({ 
            message: "Cannot create product",
            error
        });
    });
}

export function updateProduct(req, res) {
    const productId = req.params.productId;
    
    // Validate that productId is provided
    if (!productId || productId === "undefined") {
        return res.status(400).json({ 
            message: "Product ID is required" 
        });
    }
    
    const updateData = {
        productId: req.body.productId,
        name: req.body.name,
        altNames: req.body.altNames,
        description: req.body.description,
        labelledPrice: req.body.labelledPrice,
        price: req.body.price,
        image: req.body.image,
        stock: req.body.stock,
        isAvailable: req.body.isAvailable,
    };
    
    // Try to update by MongoDB _id first if it's a valid ObjectId
    if (isValidObjectId(productId)) {
        Product.findByIdAndUpdate(productId, updateData, { new: true })
        .then((updatedProduct) => {
            if (!updatedProduct) {
                return res.status(404).json({ 
                    message: "Product not found" 
                });
            }
            res.status(200).json({ 
                message: "Product updated successfully",
                product: updatedProduct
            });
        })
        .catch((error) => {
            res.status(500).json({ 
                message: "Cannot update product",
                error: error.message
            });
        });
    } else {
        // If not valid ObjectId, try to find by productId field
        Product.findOneAndUpdate({ productId: productId }, updateData, { new: true })
        .then((updatedProduct) => {
            if (!updatedProduct) {
                return res.status(404).json({ 
                    message: "Product not found" 
                });
            }
            res.status(200).json({ 
                message: "Product updated successfully",
                product: updatedProduct
            });
        })
        .catch((error) => {
            res.status(500).json({ 
                message: "Cannot update product",
                error: error.message
            });
        });
    }
}

export function deleteProduct(req, res) {
    const productId = req.params.productId;
    
    // Validate that productId is provided
    if (!productId || productId === "undefined") {
        return res.status(400).json({ 
            message: "Product ID is required" 
        });
    }
    
    // Try to find by MongoDB _id first if it's a valid ObjectId
    if (isValidObjectId(productId)) {
        Product.findByIdAndDelete(productId)
        .then((deletedProduct) => {
            if (!deletedProduct) {
                return res.status(404).json({ 
                    message: "Product not found" 
                });
            }
            res.status(200).json({ 
                message: "Product deleted successfully" 
            });
        })
        .catch((error) => {
            res.status(500).json({ 
                message: "Cannot delete product",
                error
            });
        });
    } else {
        // If not valid ObjectId, try to find by productId field
        Product.findOneAndDelete({ productId: productId })
        .then((deletedProduct) => {
            if (!deletedProduct) {
                return res.status(404).json({ 
                    message: "Product not found" 
                });
            }
            res.status(200).json({ 
                message: "Product deleted successfully" 
            });
        })
        .catch((error) => {
            res.status(500).json({ 
                message: "Cannot delete product",
                error
            });
        });
    }
}

export function getProductById(req, res) {
    const productId = req.params.productId;
    
    // Validate that productId is provided and not "undefined"
    if (!productId || productId === "undefined") {
        return res.status(400).json({ 
            message: "Product ID is required" 
        });
    }
    
    // Try to find by MongoDB _id first if it's a valid ObjectId
    if (isValidObjectId(productId)) {
        Product.findById(productId)
        .then((product) => {
            if (!product) {
                // If not found by _id, try by productId field
                Product.findOne({ productId: productId })
                .then((product) => {
                    if (!product) {
                        return res.status(404).json({ 
                            message: "Product not found" 
                        });
                    }
                    res.status(200).json(product);
                })
                .catch((error) => {
                    res.status(500).json({ 
                        message: "Cannot get product",
                        error: error.message
                    });
                });
            } else {
                res.status(200).json(product);
            }
        })
        .catch((error) => {
            res.status(500).json({ 
                message: "Cannot get product",
                error: error.message
            });
        });
    } else {
        // If not a valid ObjectId, search by productId field
        Product.findOne({ productId: productId })
        .then((product) => {
            if (!product) {
                return res.status(404).json({ 
                    message: "Product not found" 
                });
            }
            res.status(200).json(product);
        })
        .catch((error) => {
            res.status(500).json({ 
                message: "Cannot get product",
                error: error.message
            });
        });
    }
}

export async function searchProducts(req, res) {
    const searchQuery = req.params.query || req.params.searchQuery || "";
    if (!searchQuery || searchQuery.trim() === "") {
        return res.status(200).json([]);
    }
    try {
        const products = await Product.find({
            $or: [
                { name: { $regex: searchQuery, $options: "i" } },
                { altNames: { $elemMatch: { $regex: searchQuery, $options: "i" } } }
            ],
            isAvailable: true
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message: "Cannot search products",
            error: error.message
        });
    }
}
