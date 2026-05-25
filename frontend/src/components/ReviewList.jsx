import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaThumbsUp } from "react-icons/fa";
import { Rating } from "react-simple-star-rating";

const ReviewsList = ({
  reviews,
  loading,
  sort,
  onSortChange,
  onRefresh,
}) => {
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
    <div className="px-4 sm:px-0">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Reviews
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Result Found: {reviews.length}
          </p>
        </div>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-auto"
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
            className="text-center py-16"
          >
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
            <p className="text-gray-400 mt-4 text-sm">
              Loading reviews...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REVIEWS */}
      {!loading && (
        <div className="space-y-8">
          <AnimatePresence>
            {reviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border-b border-gray-200 pb-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  {/* LEFT SECTION */}
                  <div className="flex gap-3 sm:gap-5 flex-1 w-full">
                    {/* PROFILE IMAGE */}
                    <img
                      src={review.user?.profilePicture}
                      alt={review.fullName}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
                      onError={(e) => {
                        e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${review.fullName}`;
                      }}
                    />

                    {/* CONTENT */}
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-3xl font-semibold text-black">
                        {review.fullName}
                      </h3>

                      <p className="text-gray-400 text-xs sm:text-sm mt-1 mb-3 sm:mb-5">
                        {new Date(review.createdAt).toLocaleDateString()},{" "}
                        {new Date(review.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>

                      <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                        {review.reviewText}
                      </p>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleLike(review._id)}
                        className="mt-4 sm:mt-6 flex items-center gap-2 text-xs sm:text-sm text-gray-500 hover:text-purple-600 transition"
                      >
                        <FaThumbsUp className="text-sm sm:text-base" />
                        Helpful ({review.likes})
                      </motion.button>
                    </div>
                  </div>

                  {/* RIGHT SECTION - RATING */}
                  <div className="flex-shrink-0 pt-0 sm:pt-2 self-start sm:self-auto">
                    <Rating
                      initialValue={review.rating}
                      readonly
                      allowFraction
                      size={24}
                      fillColor="#f5b301"
                      emptyColor="#d1d5db"
                      SVGstyle={{ display: "inline-block" }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* EMPTY STATE */}
          {reviews.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl p-8 sm:p-16 text-center border border-gray-100"
            >
              <p className="text-gray-400 text-base sm:text-lg">
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