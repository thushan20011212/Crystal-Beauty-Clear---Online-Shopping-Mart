import express from "express";
import { 
    getProducts, 
    saveProduct, 
    updateProduct, 
    deleteProduct, 
    getProductById,
    searchProducts
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.post("/", saveProduct);
productRouter.put("/:productId", updateProduct);
productRouter.delete("/:productId", deleteProduct);
productRouter.get("/search/:query", searchProducts);
productRouter.get("/:productId", getProductById);

export default productRouter;
