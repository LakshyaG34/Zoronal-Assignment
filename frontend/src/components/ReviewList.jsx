import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaThumbsUp } from "react-icons/fa";

const ReviewsList = ({ reviews, loading, sort, onSortChange, onRefresh }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // LIKE REVIEW
  const handleLike = async (reviewId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await API.patch(`/reviews/like/${reviewId}`);
      onRefresh?.();
    } catch (error) {
      toast.error("Failed to like review");
    }
  };

  return (
    <div>
      {/* REVIEWS HEADER */}
      <div className="flex justify-between items-center mb-5 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="border border-gray-200 bg-white p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[160px]"
        >
          <option value="latest">Latest First</option>
          <option value="rating">Highest Rating</option>
        </select>
      </div>

      {/* LOADING */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
            <p className="text-gray-500 mt-3 text-sm">Loading reviews...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REVIEWS LIST */}
      {!loading && (
        <div className="space-y-4">
          <AnimatePresence>
            {reviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-3 flex-wrap gap-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{review.fullName}</h3>
                    <p className="text-gray-400 text-sm mt-0.5">{review.subject}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-purple-50 border border-purple-100 px-3 py-1 rounded-full">
                    <FaStar className="text-yellow-400 text-xs" />
                    <span className="font-semibold text-purple-700 text-sm">
                      {review.rating}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {review.reviewText}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLike(review._id)}
                    className="flex items-center gap-2 text-xs bg-gray-50 hover:bg-gray-100 border border-gray-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <FaThumbsUp className="text-purple-500" />
                    <span className="text-gray-600">Helpful</span>
                    <span className="font-semibold text-gray-700">
                      ({review.likes})
                    </span>
                  </motion.button>

                  <p className="text-xs text-gray-300">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {reviews.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl p-12 text-center border border-gray-100"
            >
              <p className="text-gray-400 text-base">
                No reviews yet. Be the first to review!
              </p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
