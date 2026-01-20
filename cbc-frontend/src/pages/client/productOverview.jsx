import { toast } from "react-hot-toast"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import ImageSlider from "../../components/imageSlider"
import Loading from "../../components/loading"
import { addToCart } from "../../utils/cart.js"
import { FaStar } from "react-icons/fa"

export default function ProductOverviewPage() {
    const params = useParams()
    const navigate = useNavigate()
    const productId = params.id
    const [status, setStatus] = useState("loading") //loading ,success, error
    const [product, setProduct] = useState(null)
    const [reviews, setReviews] = useState([])
    const [reviewsLoading, setReviewsLoading] = useState(false)
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState("")
    const [isSubmittingReview, setIsSubmittingReview] = useState(false)

    useEffect(
        () => {
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId).then(
                (response) => {
                    setProduct(response.data)
                    setStatus("success")
                }
            ).catch(
                (error) => {
                    console.error(error)
                    setStatus("error")
                    toast.error("Failed to fetch product")
                });
            
            // Fetch reviews
            fetchReviews();
        },[]);

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
            const response = await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/reviews",
                {
                    productId: productId,
                    rating: rating,
                    comment: comment
                },
                {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
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
               {status == "success" && (
                <div className="w-full min-h-screen flex flex-col bg-gray-50 pb-[120px] md:pb-4">
                    {/* Product Details Section */}
                    <div className="w-full flex flex-col md:flex-row gap-4 md:gap-8 p-4 md:p-6">
                        {/* Mobile Title */}
                        <h1 className="w-full md:hidden block text-center text-2xl text-secondary font-semibold px-2">
                            {product.name}
                            {
                                product.altNames && product.altNames.map((altName, index) => {      
                                    return (
                                    <span key={index} className="text-lg text-gray-600">{" | " +altName}</span>
                                    )
                                })  
                            }
                        </h1>

                        {/* Image Section */}
                        <div className="w-full md:w-[50%] flex justify-center items-start">
                            <ImageSlider images={product.image || []} />
                        </div>

                        {/* Product Details Section */}
                        <div className="w-full md:w-[50%] flex justify-center">
                            <div className="w-full md:max-w-[500px] flex flex-col">
                                {/* Desktop Title */}
                                <h1 className="w-full hidden md:block text-left text-3xl md:text-4xl text-secondary font-semibold mb-4">
                                    {product.name}
                                    {
                                        product.altNames && product.altNames.map((altName, index) => {      
                                            return (
                                            <span key={index} className="text-2xl md:text-3xl text-gray-600">{" | " +altName}</span>
                                            )
                                        })  
                                    }
                                </h1>
                                
                                {/* Product ID */}
                                <p className="text-xs md:text-sm text-gray-500 font-semibold mb-2">ID: {product.productId}</p>
                                
                                {/* Description */}
                                <p className="text-sm md:text-base text-gray-700 font-medium mb-4">{product.description}</p>
                                
                                {/* Price Section */}
                                <div className="mb-6 flex flex-col">
                                    {
                                        product.labelledPrice > product.price ? 
                                            <div className="flex flex-wrap gap-3 items-center">
                                                <span className="text-lg md:text-2xl text-gray-500 line-through">₨{product.labelledPrice.toFixed(2)}</span>
                                                <span className="text-2xl md:text-4xl font-bold text-accent">₨{product.price.toFixed(2)}</span>
                                            </div> 
                                            : <span className="text-2xl md:text-4xl font-bold text-accent">₨{product.price.toFixed(2)}</span>
                                    }
                                </div>

                                {/* Desktop Buttons */}
                                <div className="hidden md:flex flex-col gap-3 w-full">
                                    <button 
                                        className="w-full h-[50px] cursor-pointer bg-accent text-white rounded-2xl hover:bg-accent/80 transition-all duration-300 font-semibold text-base"
                                        onClick={ () => {
                                            addToCart(product, 1);
                                            toast.success(`${product.name} added to cart!`);
                                        }}>
                                        Add to Cart
                                    </button>
                                    <button 
                                        className="w-full h-[50px] cursor-pointer bg-secondary text-white rounded-2xl hover:bg-secondary/80 transition-all duration-300 font-semibold text-base"
                                        onClick={ () => {
                                            navigate("/checkout", { 
                                                state: { 
                                                    cart: [
                                                        {
                                                            productId: product.productId,
                                                            name: product.name,
                                                            image: product.image?.[0] || "/placeholder.svg",
                                                            price: product.price,
                                                            labelledPrice: product.labelledPrice,
                                                            qty: 1
                                                        },
                                                    ],
                                                }, 
                                            });
                                        }}>
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Sticky Buttons */}
                    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 shadow-lg">
                        <div className="flex flex-col gap-2">
                            <button 
                                className="w-full h-[45px] cursor-pointer bg-accent text-white rounded-2xl hover:bg-accent/80 transition-all duration-300 font-semibold text-sm"
                                onClick={ () => {
                                    addToCart(product, 1);
                                    toast.success(`${product.name} added to cart!`);
                                }}>
                                Add to Cart
                            </button>
                            <button 
                                className="w-full h-[45px] cursor-pointer bg-secondary text-white rounded-2xl hover:bg-secondary/80 transition-all duration-300 font-semibold text-sm"
                                onClick={ () => {
                                    navigate("/checkout", { 
                                        state: { 
                                            cart: [
                                                {
                                                    productId: product.productId,
                                                    name: product.name,
                                                    image: product.image?.[0] || "/placeholder.svg",
                                                    price: product.price,
                                                    labelledPrice: product.labelledPrice,
                                                    qty: 1
                                                },
                                            ],
                                        }, 
                                    });
                                }}>
                                Buy Now
                            </button>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="w-full px-4 md:px-6 py-8 md:py-12 mt-6 md:mt-8 md:pr-[55%]">
                        <div className="max-w-full md:max-w-[calc(50%-20px)] md:ml-0">
                            <h2 className="text-xl md:text-2xl font-bold text-secondary mb-6">Customer Reviews</h2>

                            {/* Review Stats */}
                            {reviews.length > 0 && (
                                <div className="mb-6 p-4 md:p-6 bg-white rounded-lg shadow-sm">
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                        <div className="flex flex-col items-center">
                                            <div className="text-3xl md:text-4xl font-bold text-secondary">
                                                {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                                            </div>
                                            <div className="flex gap-1 mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} className={i < Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) ? "text-yellow-400" : "text-gray-300"} />
                                                ))}
                                            </div>
                                            <p className="text-xs md:text-sm text-gray-500 mt-1">{reviews.length} reviews</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Write Review Button */}
                            <button
                                onClick={() => setShowReviewForm(!showReviewForm)}
                                className="w-full md:w-auto px-4 md:px-6 py-2 md:py-3 bg-primary text-secondary rounded-lg hover:bg-gray-100 transition-all font-semibold text-sm md:text-base mb-6 border-2 border-secondary"
                            >
                                {showReviewForm ? "Cancel" : "Write a Review"}
                            </button>

                            {/* Review Form */}
                            {showReviewForm && (
                                <div className="mb-6 p-4 md:p-6 bg-white rounded-lg shadow-sm">
                                    <div className="mb-4">
                                        <label className="block text-sm md:text-base font-semibold text-secondary mb-2">Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => setRating(star)}
                                                    className="p-1 md:p-2 transition-all"
                                                >
                                                    <FaStar className={star <= rating ? "text-yellow-400 text-lg md:text-2xl" : "text-gray-300 text-lg md:text-2xl"} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm md:text-base font-semibold text-secondary mb-2">Comment</label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Share your thoughts about this product..."
                                            className="w-full p-3 border border-gray-300 rounded-lg text-sm md:text-base focus:outline-none focus:border-accent"
                                            rows="4"
                                        />
                                    </div>

                                    <button
                                        onClick={submitReview}
                                        disabled={isSubmittingReview}
                                        className="w-full bg-accent text-white px-4 py-2 md:py-3 rounded-lg hover:bg-accent/80 transition-all font-semibold text-sm md:text-base disabled:opacity-50"
                                    >
                                        {isSubmittingReview ? "Submitting..." : "Submit Review"}
                                    </button>
                                </div>
                            )}

                            {/* Reviews List */}
                            {reviewsLoading ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Loading reviews...</p>
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.map((review, index) => (
                                        <div key={index} className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
                                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                                                <div>
                                                    <p className="font-semibold text-sm md:text-base text-secondary">{review.user?.name || "Anonymous"}</p>
                                                    <div className="flex gap-1 mt-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar key={i} className={i < review.rating ? "text-yellow-400 text-xs md:text-sm" : "text-gray-300 text-xs md:text-sm"} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-xs md:text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <p className="text-sm md:text-base text-gray-700">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
              )}
              {
                status == "loading" && <Loading />
              }
            </>
        );

}
