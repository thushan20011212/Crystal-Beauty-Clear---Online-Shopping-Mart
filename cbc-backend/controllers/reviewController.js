import Review from "../models/review.js";
import User from "../models/user.js";
import Product from "../models/product.js";

// Helper function to check if user is authenticated
function isAuthenticated(req) {
    return req.userData != null;
}

// Create a new review
export async function createReview(req, res) {
    try {
        // Check if user is authenticated
        if (!isAuthenticated(req)) {
            return res.status(403).json({
                message: "Authentication required to create review"
            });
        }

        const { productId, rating, comment } = req.body;
        const userEmail = req.userData.email;

        // Validate input
        if (!productId || !rating || !comment) {
            return res.status(400).json({
                message: "productId, rating, and comment are required"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        // Find user by email
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Find product by productId
        const product = await Product.findOne({ productId: productId });
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Create review
        const review = new Review({
            user: user._id,
            product: product._id,
            rating: rating,
            comment: comment
        });

        await review.save();

        // Populate user and product details before returning
        await review.populate("user", "firstName lastName email img");
        await review.populate("product", "name productId price image");

        res.status(201).json({
            message: "Review created successfully",
            review: review
        });

    } catch (error) {
        console.error("Create review error:", error.message);
        res.status(500).json({
            message: "Failed to create review",
            error: error.message
        });
    }
}

// Get all reviews for a product (with user and product names)
export async function getProductReviews(req, res) {
    try {
        const { productId } = req.params;

        // Find product
        const product = await Product.findOne({ productId: productId });
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Find all reviews for this product and populate user & product details
        const reviews = await Review.find({ product: product._id })
            .populate("user", "firstName lastName email img")
            .populate("product", "name productId price image")
            .sort({ createdAt: -1 }); // Latest reviews first

        res.status(200).json({
            message: "Reviews fetched successfully",
            productName: product.name,
            reviewCount: reviews.length,
            reviews: reviews
        });

    } catch (error) {
        console.error("Get reviews error:", error.message);
        res.status(500).json({
            message: "Failed to fetch reviews",
            error: error.message
        });
    }
}

// Get all reviews by a user (with user and product names)
export async function getUserReviews(req, res) {
    try {
        if (!req.userData) {
            return res.status(403).json({
                message: "Authentication required"
            });
        }

        const userEmail = req.userData.email;

        // Find user
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Find all reviews by this user and populate user & product details
        const reviews = await Review.find({ user: user._id })
            .populate("user", "firstName lastName email img")
            .populate("product", "name productId price image")
            .sort({ createdAt: -1 }); // Latest reviews first

        res.status(200).json({
            message: "User reviews fetched successfully",
            userName: `${user.firstName} ${user.lastName}`,
            reviewCount: reviews.length,
            reviews: reviews
        });

    } catch (error) {
        console.error("Get user reviews error:", error.message);
        res.status(500).json({
            message: "Failed to fetch user reviews",
            error: error.message
        });
    }
}

// Get all reviews (admin only, with user and product names)
export async function getAllReviews(req, res) {
    try {
        if (!req.userData || req.userData.role !== "admin") {
            return res.status(403).json({
                message: "Admin access required"
            });
        }

        // Get all reviews with populated user and product details
        const reviews = await Review.find()
            .populate("user", "firstName lastName email img")
            .populate("product", "name productId price image")
            .sort({ createdAt: -1 }); // Latest reviews first

        res.status(200).json({
            message: "All reviews fetched successfully",
            reviewCount: reviews.length,
            reviews: reviews
        });

    } catch (error) {
        console.error("Get all reviews error:", error.message);
        res.status(500).json({
            message: "Failed to fetch reviews",
            error: error.message
        });
    }
}

// Update review (user can only update their own)
export async function updateReview(req, res) {
    try {
        if (!req.userData) {
            return res.status(403).json({
                message: "Authentication required"
            });
        }

        const { reviewId } = req.params;
        const { rating, comment } = req.body;
        const userEmail = req.userData.email;

        // Find review
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({
                message: "Review not found"
            });
        }

        // Find user
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check if user owns this review
        if (review.user.toString() !== user._id.toString()) {
            return res.status(403).json({
                message: "You can only update your own reviews"
            });
        }

        // Update review
        if (rating) {
            if (rating < 1 || rating > 5) {
                return res.status(400).json({
                    message: "Rating must be between 1 and 5"
                });
            }
            review.rating = rating;
        }

        if (comment) {
            review.comment = comment;
        }

        await review.save();

        // Populate user and product details before returning
        await review.populate("user", "firstName lastName email img");
        await review.populate("product", "name productId price image");

        res.status(200).json({
            message: "Review updated successfully",
            review: review
        });

    } catch (error) {
        console.error("Update review error:", error.message);
        res.status(500).json({
            message: "Failed to update review",
            error: error.message
        });
    }
}

// Delete review (user can only delete their own, or admin can delete any)
export async function deleteReview(req, res) {
    try {
        if (!req.userData) {
            return res.status(403).json({
                message: "Authentication required"
            });
        }

        const { reviewId } = req.params;
        const userEmail = req.userData.email;

        // Find review
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({
                message: "Review not found"
            });
        }

        // Find user
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check permissions: own review or admin
        const isOwner = review.user.toString() === user._id.toString();
        const isAdmin = req.userData.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message: "You can only delete your own reviews"
            });
        }

        await Review.findByIdAndDelete(reviewId);

        res.status(200).json({
            message: "Review deleted successfully"
        });

    } catch (error) {
        console.error("Delete review error:", error.message);
        res.status(500).json({
            message: "Failed to delete review",
            error: error.message
        });
    }
}
