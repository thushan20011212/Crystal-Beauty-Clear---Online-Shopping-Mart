import Product from "../models/product.js";

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
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        image: req.body.image,
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
    
    Product.findByIdAndUpdate(productId, {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        image: req.body.image,
    }, { new: true })
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
            error
        });
    });
}

export function deleteProduct(req, res) {
    const productId = req.params.productId;
    
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
}

export function getProductById(req, res) {
    const productId = req.params.productId;
    
    Product.findById(productId)
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
            error
        });
    });
}
