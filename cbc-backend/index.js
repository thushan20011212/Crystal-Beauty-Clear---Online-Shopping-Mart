import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// MongoDB connection string - using SRV format (recommended by MongoDB Atlas)
const MONGODB_URL = "mongodb+srv://user:123q@cluster0.4snqe6f.mongodb.net/cbc-backend?retryWrites=true&w=majority";
const JWT_KEY = "cbc-batch-five@2025";

app.use(cors());

app.use(bodyParser.json());

app.use((req, res, next) => {
    const tokenString = req.header("Authorization");
    if (tokenString != null) {
        const token = tokenString.replace("Bearer ", "");

        jwt.verify(token, JWT_KEY, 
            (error, decoded) => {
                if (decoded != null) {
                    req.userData = decoded;
                    next();
                } else {
                    console.log("Invalid token:");
                    res.status(403).json({
                        message: "Forbidden access - invalid token",
                    });
                }
            }
        );
    } else {
        next();
    }
});

// Connect to MongoDB before starting the server
mongoose.connect(MONGODB_URL, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => {
    console.log("✅ Connected to MongoDB successfully");
    
    // Only start the server after successful DB connection
    app.listen(5001, () => {
        console.log('✅ Server is running on port 5001');
    });
})
.catch((error) => {
    console.error("❌ Error connecting to MongoDB: ", error.message);
    console.error("\n💡 SOLUTION - Please do ONE of these:");
    console.error("   Option A (RECOMMENDED): Whitelist your IP in MongoDB Atlas");
    console.error("      1. Go to: https://cloud.mongodb.com/");
    console.error("      2. Click your cluster → Network Access");
    console.error("      3. Click 'Add IP Address' → 'Allow Access from Anywhere'");
    console.error("      4. Wait 1-2 minutes and restart the server");
    console.error("\n   Option B: Use localhost MongoDB");
    console.error("      1. Install MongoDB Community locally");
    console.error("      2. Run: mongod --dbpath C:\\data\\db");
    console.error("      3. Update connection string to: mongodb://localhost:27017/cbc-backend");
    console.error("\n⏳ Retrying in 5 seconds...\n");
    
    // Retry connection after 5 seconds
    setTimeout(() => {
        console.log("🔄 Retrying MongoDB connection...");
        mongoose.connect(MONGODB_URL, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        })
        .then(() => {
            console.log("✅ Connected to MongoDB successfully!");
            app.listen(5001, () => {
                console.log('✅ Server is running on port 5001');
            });
        })
        .catch((retryError) => {
            console.error("❌ Connection retry failed: ", retryError.message);
            process.exit(1);
        });
    }, 5000);
});

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);