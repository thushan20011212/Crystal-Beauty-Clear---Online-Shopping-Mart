import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import orderRouter from './routes/orderRouter.js';
import reviewRouter from './routes/reviewRouter.js';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

dotenv.config(); // Must be first

const app = express();

app.use(cors());
app.use(bodyParser.json());

// JWT middleware
app.use((req, res, next) => {
  const tokenString = req.header("Authorization");
  if (tokenString) {
    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (decoded) {
        req.userData = decoded;
        next();
      } else {
        console.log("Invalid token:", err?.message);
        res.status(403).json({ message: "Forbidden access - invalid token" });
      }
    });
  } else {
    next();
  }
});

// Define all routes BEFORE starting the server
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/products', productRouter); // Alias for /api/products (same as /api/product)
app.use('/api/order', orderRouter);
app.use('/api/orders', orderRouter); // Alias for /api/orders (same as /api/order)
app.use('/api/review', reviewRouter);
app.use('/api/reviews', reviewRouter); // Alias for /api/reviews (same as /api/review)

// Connect to MongoDB and start server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URL.trim());
    console.log("✅ Connected to MongoDB successfully");

    app.listen(5001, () => {
      console.log("✅ Server is running on port 5001");
    });
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
  }
}

startServer();