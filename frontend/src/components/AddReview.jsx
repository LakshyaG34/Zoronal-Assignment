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
    "w-full border border-gray-200 bg-gray-50 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white focus:border-transparent transition-all placeholder-gray-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: -24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 mb-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-7 bg-gradient-to-b from-purple-500 to-purple-700 rounded-full" />
        <h2 className="text-xl font-bold text-gray-800">Write a Review</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="fullName"
            placeholder="Your full name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className={inputClass}
          />
          <input
            type="text"
            name="subject"
            placeholder="Review subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <textarea
          name="reviewText"
          placeholder="Share your experience with this company..."
          value={formData.reviewText}
          onChange={handleChange}
          required
          className={`${inputClass} h-28 resize-none`}
        />

        {/* Star Rating */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 font-medium">Rating:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                className="focus:outline-none"
              >
                <FaStar
                  className={`text-2xl transition-colors ${
                    star <= (hoveredStar ?? formData.rating)
                      ? "text-yellow-400"
                      : "text-gray-200"
                  }`}
                />
              </motion.button>
            ))}
          </div>
          <span className="text-sm font-semibold text-purple-600">
            {formData.rating} / 5
          </span>
        </div>

        <div className="flex justify-end pt-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={submitting}
            className="primary-gradient text-white px-7 py-3 rounded-md font-medium transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed text-sm"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddReview;