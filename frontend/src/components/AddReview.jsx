import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const AddReview = ({ companyId, onSuccess }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    subject: "",
    reviewText: "",
    rating: 5,
  });

  const [submitting, setSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStarClick = (star) => {
    setFormData({ ...formData, rating: star });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);
      await API.post(`/reviews/${companyId}`, formData);
      toast.success("Review added successfully");
      setFormData({ fullName: "", subject: "", reviewText: "", rating: 5 });
      onSuccess?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add review");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 bg-gray-50 p-3 sm:p-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white focus:border-transparent transition-all placeholder-gray-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: -24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-md border border-gray-100 mb-6 sm:mb-8"
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="w-1 h-5 sm:h-7 bg-gradient-to-b from-purple-500 to-purple-700 rounded-full" />
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Write a Review</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Name and Subject Fields - Stack on mobile, side by side on tablet/desktop */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
          
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Review Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subject"
              placeholder="What's this review about?"
              value={formData.subject}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* Review Text Field */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Your Review <span className="text-red-500">*</span>
          </label>
          <textarea
            name="reviewText"
            placeholder="Share your experience with this company..."
            value={formData.reviewText}
            onChange={handleChange}
            required
            className={`${inputClass} h-24 sm:h-28 resize-none`}
          />
        </div>

        {/* Star Rating - Responsive layout */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm text-gray-500 font-medium">
            Rating: <span className="text-red-500">*</span>
          </span>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1.5 sm:gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(null)}
                  className="focus:outline-none"
                >
                  <FaStar
                    className={`text-xl sm:text-2xl md:text-2xl transition-colors ${
                      star <= (hoveredStar ?? formData.rating)
                        ? "text-yellow-400"
                        : "text-gray-200"
                    }`}
                  />
                </motion.button>
              ))}
            </div>
            
            <span className="text-xs sm:text-sm font-semibold text-purple-600 ml-0 sm:ml-1">
              {formData.rating} / 5
            </span>
          </div>
        </div>

        {/* Submit Button - Full width on mobile */}
        <div className="flex flex-col sm:flex-row sm:justify-end pt-2 sm:pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={submitting}
            className="primary-gradient text-white px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 rounded-md font-medium transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed text-sm w-full sm:w-auto"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit Review"
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddReview;