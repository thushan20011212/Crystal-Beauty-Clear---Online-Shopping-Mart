import express from "express";
import {
    createReview,
    getProductReviews,
    getUserReviews,
    getAllReviews,
    updateReview,
    deleteReview
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

// Create a new review (requires authentication)
reviewRouter.post("/", createReview);

// Get all reviews for a specific product (public)
reviewRouter.get("/product/:productId", getProductReviews);

// Get all reviews by the current user (requires authentication)
reviewRouter.get("/user/my-reviews", getUserReviews);

// Get all reviews (admin only)
reviewRouter.get("/admin/all", getAllReviews);

// Update a review (user can update their own)
reviewRouter.put("/:reviewId", updateReview);

// Delete a review (user can delete their own, admin can delete any)
reviewRouter.delete("/:reviewId", deleteReview);

export default reviewRouter;
