import Product from "../models/product";

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
