import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaStar } from "react-icons/fa";

// Components
import ImageSlider from "../../components/imageSlider";
import Loading from "../../components/loading";
import { addToCart } from "../../utils/cart.js";

export default function ProductOverviewPage() {
  const params = useParams();
  const navigate = useNavigate();
  const productId = params.id;

  // State
  const [status, setStatus] = useState("loading");
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Fetch product and reviews on mount
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId)
      .then((response) => {
        setProduct(response.data);
        setStatus("success");
      })
      .catch((error) => {
        console.error(error);
        setStatus("error");
        toast.error("Failed to fetch product");
      });

    fetchReviews();
  }, []);

  // Fetch reviews for product
  async function fetchReviews() {
    setReviewsLoading(true);
    try {
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/api/reviews/product/" + productId
      );
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }

  // Submit a new review
  async function submitReview() {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to submit a review");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setIsSubmittingReview(true);
    try {
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/reviews",
        {
          productId: productId,
          rating: rating,
          comment: comment,
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      toast.success("Review submitted successfully!");
      setComment("");
      setRating(5);
      setShowReviewForm(false);
      await fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  }

  return (
    <>
      {status === "success" && (
        <div className="w-full min-h-screen flex flex-col bg-primary pb-[140px] md:pb-8">
                    
                    {/* ===== PRODUCT DETAILS SECTION ===== */}
                    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 md:py-10">
                        <div className="max-w-7xl mx-auto">
                            
                            {/* Mobile Title */}
                            <h1 className="md:hidden text-center text-2xl text-secondary font-bold mb-4 px-2">
                                {product.name}
                                {product.altNames && product.altNames.map((altName, index) => (
                                    <span key={index} className="text-lg text-muted font-normal">{" | " + altName}</span>
                                ))}
                            </h1>

                            <div className="flex flex-col md:flex-row gap-6 md:gap-10 lg:gap-14">
                                
                                {/* Left: Product Image */}
                                <div className="w-full md:w-[45%] flex justify-center items-start">
                                    <ImageSlider images={product.image || []} />
                                </div>

                                {/* Right: Product Details */}
                                <div className="w-full md:w-[55%] flex flex-col justify-start gap-5 md:gap-6">
                                    
                                    {/* Desktop Product Title */}
                                    <div className="hidden md:block">
                                        <h1 className="text-3xl lg:text-4xl font-bold text-secondary mb-2">
                                            {product.name}
                                        </h1>
                                        {product.altNames && (
                                            <p className="text-base lg:text-lg text-muted">
                                                {product.altNames.map((alt, idx) => (
                                                    <span key={idx}>{idx > 0 ? " | " : ""}{alt}</span>
                                                ))}
                                            </p>
                                        )}
                                    </div>

                                    {/* Product ID & Description */}
                                    <div className="border-t border-accent pt-4">
                                        <p className="text-xs md:text-sm text-muted mb-3">
                                            <span className="font-semibold text-secondary">SKU:</span> {product.productId}
                                        </p>
                                        <p className="text-sm md:text-base text-muted leading-relaxed">
                                            {product.description}
                                        </p>
                                    </div>

                                    {/* Price Section */}
                                    <div className="bg-neutral rounded-xl p-4 md:p-6 shadow-md border border-accent">
                                        {product.labelledPrice > product.price ? (
                                            <div className="flex flex-wrap items-center gap-3 md:gap-4">
                                                <span className="text-lg md:text-2xl text-muted line-through font-medium">
                                                    ₨{product.labelledPrice.toFixed(2)}
                                                </span>
                                                <span className="text-2xl md:text-4xl font-bold text-secondary">
                                                    ₨{product.price.toFixed(2)}
                                                </span>
                                                <span className="text-xs md:text-sm font-bold text-secondary bg-accent px-3 py-1 rounded-full">
                                                    Save {Math.round(((product.labelledPrice - product.price) / product.labelledPrice) * 100)}%
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-2xl md:text-4xl font-bold text-secondary">
                                                ₨{product.price.toFixed(2)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Desktop Action Buttons */}
                                    <div className="hidden md:flex flex-col gap-3 mt-2">
                                        <button 
                                            className="w-full h-12 lg:h-14 bg-accent text-secondary font-semibold rounded-xl hover:bg-secondary hover:text-neutral transition-all duration-300 shadow-md text-base lg:text-lg"
                                            onClick={() => {
                                                addToCart(product, 1);
                                                toast.success(`${product.name} added to cart!`);
                                            }}>
                                            🛒 Add to Cart
                                        </button>
                                        <button 
                                            className="w-full h-12 lg:h-14 bg-secondary text-neutral font-semibold rounded-xl hover:bg-muted transition-all duration-300 shadow-md text-base lg:text-lg"
                                            onClick={() => {
                                                navigate("/checkout", { 
                                                    state: { 
                                                        cart: [{
                                                            productId: product.productId,
                                                            name: product.name,
                                                            image: product.image?.[0] || "/placeholder.svg",
                                                            price: product.price,
                                                            labelledPrice: product.labelledPrice,
                                                            qty: 1
                                                        }],
                                                    }, 
                                                });
                                            }}>
                                            💳 Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ===== MOBILE STICKY BUTTONS ===== */}
                    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-neutral border-t-2 border-accent px-4 py-3 z-40 shadow-2xl">
                        <div className="flex gap-3">
                            <button 
                                className="flex-1 h-12 bg-accent text-secondary font-semibold rounded-xl hover:bg-secondary hover:text-neutral transition-all duration-300 shadow-md"
                                onClick={() => {
                                    addToCart(product, 1);
                                    toast.success(`${product.name} added to cart!`);
                                }}>
                                🛒 Add to Cart
                            </button>
                            <button 
                                className="flex-1 h-12 bg-secondary text-neutral font-semibold rounded-xl hover:bg-muted transition-all duration-300 shadow-md"
                                onClick={() => {
                                    navigate("/checkout", { 
                                        state: { 
                                            cart: [{
                                                productId: product.productId,
                                                name: product.name,
                                                image: product.image?.[0] || "/placeholder.svg",
                                                price: product.price,
                                                labelledPrice: product.labelledPrice,
                                                qty: 1
                                            }],
                                        }, 
                                    });
                                }}>
                                💳 Buy Now
                            </button>
                        </div>
                    </div>

                    {/* ===== REVIEWS SECTION ===== */}
                    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 md:py-12">
                        <div className="max-w-7xl mx-auto">
                            {/* On mobile, full width. On desktop, align with image slider (45% width) */}
                            <div className="w-full md:w-[45%]">
                            
                                {/* Reviews Header */}
                                <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-6">
                                    ⭐ Customer Reviews
                            </h2>

                            {/* Review Stats */}
                            {reviews.length > 0 && (
                                <div className="mb-8 p-5 md:p-6 bg-neutral rounded-xl shadow-md">
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col items-center">
                                            <div className="text-4xl md:text-5xl font-bold text-secondary">
                                                {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                                            </div>
                                            <div className="flex gap-1 mt-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} className={`text-lg ${i < Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) ? "text-secondary" : "text-accent"}`} />
                                                ))}
                                            </div>
                                            <p className="text-sm text-muted mt-2 font-medium">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Write Review Button */}
                            <button
                                onClick={() => setShowReviewForm(!showReviewForm)}
                                className="mb-6 px-6 py-3 bg-secondary text-neutral rounded-lg hover:bg-muted transition-all font-semibold text-base shadow-md"
                            >
                                {showReviewForm ? "✕ Cancel" : "✏️ Write a Review"}
                            </button>

                            {/* Review Form */}
                            {showReviewForm && (
                                <div className="mb-8 p-5 md:p-6 bg-neutral rounded-xl shadow-md border-l-4 border-secondary">
                                    <h3 className="text-lg md:text-xl font-bold text-secondary mb-5">Share Your Experience</h3>
                                    
                                    <div className="mb-5">
                                        <label className="block text-sm md:text-base font-semibold text-secondary mb-3">Rate this product</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => setRating(star)}
                                                    className="p-1 transition-transform duration-200 hover:scale-110"
                                                >
                                                    <FaStar className={`text-2xl md:text-3xl ${star <= rating ? "text-secondary" : "text-accent"}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <label className="block text-sm md:text-base font-semibold text-secondary mb-3">Your Comment</label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Share your thoughts about this product..."
                                            className="w-full p-4 border-2 border-accent rounded-lg text-sm md:text-base focus:outline-none focus:border-secondary transition-colors resize-none"
                                            rows="4"
                                        />
                                    </div>

                                    <button
                                        onClick={submitReview}
                                        disabled={isSubmittingReview}
                                        className="w-full bg-secondary text-neutral px-6 py-3 rounded-lg hover:bg-muted transition-all font-semibold text-base disabled:opacity-50 shadow-md"
                                    >
                                        {isSubmittingReview ? "⏳ Submitting..." : "✓ Submit Review"}
                                    </button>
                                </div>
                            )}

                            {/* Reviews List */}
                            <div className="space-y-4">
                                {reviewsLoading ? (
                                    <div className="text-center py-12">
                                        <p className="text-muted text-base">⏳ Loading reviews...</p>
                                    </div>
                                ) : reviews.length === 0 ? (
                                    <div className="text-center py-12 bg-neutral rounded-xl shadow-sm">
                                        <p className="text-muted text-base">📝 No reviews yet. Be the first to review this product!</p>
                                    </div>
                                ) : (
                                    reviews.map((review, index) => (
                                        <div key={index} className="p-5 md:p-6 bg-neutral rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-secondary">
                                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-3">
                                                <div>
                                                    <p className="font-bold text-base md:text-lg text-secondary">{review.user?.name || "Anonymous"}</p>
                                                    <div className="flex gap-1 mt-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar key={i} className={`text-sm ${i < review.rating ? "text-secondary" : "text-accent"}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-xs md:text-sm text-muted font-medium">{new Date(review.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <p className="text-sm md:text-base text-secondary leading-relaxed">{review.comment}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                            </div>
                        </div>
                    </section>

                </div>
              )}
              {
                status == "loading" && <Loading />
              }
            </>
        );

}
