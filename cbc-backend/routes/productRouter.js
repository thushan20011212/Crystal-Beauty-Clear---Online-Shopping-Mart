import express from "express";
import { getProducts , saveProduct } from "../controllers/productController";

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.post("/", saveProduct);
productRouter.put("/:productId", updateProduct);
productRouter.delete("/:productId", deleteProduct);
productRouter.get("/:productId", getProductById);

export default productRouter;
