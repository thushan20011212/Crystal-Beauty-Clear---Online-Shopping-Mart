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

app.use(cors());

app.use(bodyParser.json());

app.use((req, res, next) => {
    const tokenString = req.header("Authorization");
    if (tokenString != null) {
        const token = tokenString.replace("Bearer ", "");

        jwt.verify(token, process.env.JWT_KEY, 
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

mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log("Connected to MongoDB successfully");
})
.catch((error) => {
    console.error("Error connecting to MongoDB: ", error);
});

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);

function serverSuccessfullyStarted() {
    console.log('Server is running on port 5001');
}

app.listen(5001, serverSuccessfullyStarted);