import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dns from 'dns';

// Routers
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import orderRouter from './routes/orderRouter.js';
import reviewRouter from './routes/reviewRouter.js';

dns.setDefaultResultOrder('ipv4first');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// JWT Authentication Middleware
app.use((req, res, next) => {
  const tokenString = req.header('Authorization');
  if (tokenString) {
    const token = tokenString.replace('Bearer ', '');
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (decoded) {
        req.userData = decoded;
        next();
      } else {
        console.log('Invalid token:', err?.message);
        res.status(403).json({ message: 'Forbidden access - invalid token' });
      }
    });
  } else {
    next();
  }
});

// API Routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/products', productRouter);
app.use('/api/order', orderRouter);
app.use('/api/orders', orderRouter);
app.use('/api/review', reviewRouter);
app.use('/api/reviews', reviewRouter);

// Connect to MongoDB and Start Server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URL.trim());
    console.log('✅ Connected to MongoDB successfully');

    const PORT = process.env.PORT || 5001

    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
}

startServer();