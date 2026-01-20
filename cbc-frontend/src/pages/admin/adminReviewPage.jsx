import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Modal from "react-modal";
import Loading from "../../components/loading.jsx";
import { FaStar, FaTrash } from "react-icons/fa";

Modal.setAppElement("#root");

export default function AdminReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeReview, setActiveReview] = useState(null);

  // Fetch reviews from backend
  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        setIsLoading(false);
        return;
      }

      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/api/reviews/admin/all",
        {
          headers: { Authorization: "Bearer " + token }
        }
      );

      setReviews(response.data.reviews || []);
      if (response.data.reviews?.length === 0) {
        toast.success("No reviews found");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error(error.response?.data?.message || "Failed to fetch reviews");
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  }

  function openReviewModal(review) {
    setActiveReview(review);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setActiveReview(null);
  }

  async function deleteReview(reviewId) {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        import.meta.env.VITE_BACKEND_URL + "/api/reviews/" + reviewId,
        {
          headers: { Authorization: "Bearer " + token }
        }
      );

      toast.success("Review deleted successfully");
      await fetchReviews();
      closeModal();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error(error.response?.data?.message || "Failed to delete review");
    }
  }

  return (
    <div className="w-full h-full p-4 md:p-6 overflow-y-auto">

      {/* Header */}
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-secondary">
          Review Management
        </h1>
      </div>

      {/* Loading */}
      {isLoading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto">

          {/* REVIEW DETAILS MODAL */}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            className="bg-white max-w-4xl mx-auto mt-10 rounded-2xl outline-none shadow-2xl overflow-hidden w-[calc(100%-2rem)] md:w-auto h-[90vh] md:h-auto max-h-[90vh]"
            overlayClassName="fixed inset-0 bg-black/60 flex justify-center items-start py-5 md:py-10 px-4 md:px-0"
          >
            {activeReview && (
              <div className="max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-secondary p-4 md:p-6 flex justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-xl md:text-3xl font-bold text-white">Review Details</h2>
                    <p className="text-accent text-xs md:text-sm mt-1">Review ID: {activeReview._id}</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-white hover:bg-white/20 rounded-full p-2 transition text-xl md:text-2xl w-10 h-10 flex items-center justify-center shrink-0"
                  >
                    ✕
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 md:p-8 space-y-4 md:space-y-6">
                  
                  {/* Rating */}
                  <div className="flex items-center justify-between pb-4 border-b border-black/10 gap-3 md:gap-0">
                    <span className="text-secondary font-semibold text-sm md:text-base">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`text-lg md:text-2xl ${star <= activeReview.rating ? "text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* User Info */}
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-secondary mb-3 md:mb-4">User Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 bg-primary p-4 md:p-6 rounded-xl border border-accent/20">
                      <div>
                        <label className="text-secondary/70 text-xs md:text-sm font-semibold">Name</label>
                        <p className="text-base md:text-lg font-semibold text-secondary mt-1">
                          {activeReview.user?.firstName} {activeReview.user?.lastName}
                        </p>
                      </div>
                      <div>
                        <label className="text-secondary/70 text-xs md:text-sm font-semibold">Email</label>
                        <p className="text-base md:text-lg font-semibold text-secondary mt-1 break-all">
                          {activeReview.user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-secondary mb-3 md:mb-4">Product Information</h3>
                    <div className="bg-primary border-2 border-accent p-4 md:p-6 rounded-xl">
                      <p className="text-secondary font-semibold text-base md:text-lg">{activeReview.product?.name}</p>
                      <p className="text-secondary text-xs md:text-sm mt-2">ID: {activeReview.product?.productId}</p>
                      <p className="text-secondary text-sm md:text-base mt-2">Price: ₨{(Number(activeReview.product?.price) || 0).toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Review Comment */}
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-secondary mb-2 md:mb-3">Review Comment</h3>
                    <div className="bg-gray-50 border-2 border-gray-200 p-4 md:p-6 rounded-xl">
                      <p className="text-secondary leading-relaxed text-sm md:text-base">{activeReview.comment}</p>
                    </div>
                  </div>

                  {/* Review Date */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0 text-xs md:text-sm text-gray-500">
                    <p>Submitted: {new Date(activeReview.createdAt).toLocaleString()}</p>
                    {activeReview.updatedAt && activeReview.createdAt !== activeReview.updatedAt && (
                      <p>Updated: {new Date(activeReview.updatedAt).toLocaleString()}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-4 md:pt-6 border-t border-accent/30">
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-black/80 hover:bg-black text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg transition duration-300 text-sm md:text-base"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => deleteReview(activeReview._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg transition duration-300 text-sm md:text-base flex items-center justify-center gap-2"
                    >
                      <FaTrash className="text-sm" />
                      Delete Review
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Modal>

          {/* REVIEWS TABLE */}
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-xs md:text-base">
            <thead className="bg-accent text-secondary">
              <tr>
                <th className="p-2 md:p-3">#</th>
                <th className="p-2 md:p-3 text-left">User</th>
                <th className="p-2 md:p-3 text-left hidden md:table-cell">Product</th>
                <th className="p-2 md:p-3 text-center">Rating</th>
                <th className="p-2 md:p-3 text-left hidden lg:table-cell">Comment</th>
                <th className="p-2 md:p-3 text-left hidden md:table-cell">Date</th>
                <th className="p-2 md:p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {reviews.map((review, index) => (
                <tr
                  key={review._id || index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } border-t hover:bg-gray-200 transition`}
                >
                  <td className="p-2 md:p-3 font-semibold">{index + 1}</td>
                  <td className="p-2 md:p-3 text-xs md:text-sm">
                    <p className="font-semibold">{review.user?.firstName} {review.user?.lastName}</p>
                    <p className="text-gray-500 text-xs">{review.user?.email}</p>
                  </td>
                  <td className="p-2 md:p-3 hidden md:table-cell text-sm">{review.product?.name}</td>
                  <td className="p-2 md:p-3 text-center">
                    <div className="flex justify-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar 
                          key={star} 
                          className={`text-xs md:text-sm ${star <= review.rating ? "text-yellow-400" : "text-gray-300"}`} 
                        />
                      ))}
                    </div>
                  </td>
                  <td className="p-2 md:p-3 hidden lg:table-cell text-xs md:text-sm truncate">
                    {review.comment}
                  </td>
                  <td className="p-2 md:p-3 hidden md:table-cell text-xs md:text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 md:p-3">
                    <button
                      onClick={() => openReviewModal(review)}
                      className="px-2 md:px-3 py-1 md:py-2 bg-secondary text-white rounded text-xs md:text-sm hover:bg-secondary/80 transition font-semibold"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {reviews.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-base md:text-lg">No reviews found</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
