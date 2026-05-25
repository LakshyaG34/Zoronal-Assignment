import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axios";
import { Rating } from "react-simple-star-rating";
import { FaArrowLeft, FaBuilding, FaMapMarkerAlt, FaUser, FaCalendarAlt } from "react-icons/fa";

const SingleReview = () => {
  const { reviewId } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReview();
  }, [reviewId]);

  const fetchReview = async () => {
    try {
      const { data } = await API.get(`/reviews/single/${reviewId}`);
      setReview(data.review);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Loading Skeleton with Animation
  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen p-4 sm:p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-sm p-6 sm:p-8"
          >
            <div className="animate-pulse">
              <div className="flex items-center gap-4 sm:gap-5 pb-6 border-b">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-200 rounded-2xl"></div>
                <div className="flex-1">
                  <div className="h-6 sm:h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 sm:h-5 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="pt-6 sm:pt-8">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-5 sm:h-7 bg-gray-200 rounded w-32 sm:w-40 mb-2"></div>
                      <div className="h-3 sm:h-4 bg-gray-200 rounded w-24 sm:w-32"></div>
                    </div>
                  </div>
                  <div className="w-24 sm:w-32 h-6 sm:h-8 bg-gray-200 rounded"></div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-11/12"></div>
                  <div className="h-4 bg-gray-200 rounded w-10/12"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="bg-gray-100 min-h-screen p-4 sm:p-6 md:p-10 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
              Review Not Found
            </h2>
            <p className="text-gray-500 mb-6">
              The review you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/"
              className="inline-block primary-gradient text-white px-6 py-3 rounded-lg font-medium"
            >
              Go Back Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gray-100 min-h-screen p-4 sm:p-6 md:p-10"
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-4 sm:mb-6 transition-colors"
        >
          <FaArrowLeft className="text-sm sm:text-base" />
          <span className="text-sm sm:text-base">Back</span>
        </motion.button>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden"
        >
          {/* Company Section */}
          <div className="p-5 sm:p-6 md:p-8 border-b border-gray-100">
            <Link to={`/company/${review.company._id}`}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 sm:gap-5 cursor-pointer group"
              >
                <motion.img
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={review.company.logo}
                  alt={review.company.name}
                  className="w-16 h-16 sm:w-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl object-cover shadow-sm group-hover:shadow-md transition-shadow"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/120";
                  }}
                />
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {review.company.name}
                  </h1>
                  <div className="flex items-center gap-1 mt-1">
                    <FaMapMarkerAlt className="text-purple-500 text-xs sm:text-sm" />
                    <p className="text-gray-500 text-xs sm:text-sm">
                      {review.company.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>

          {/* Review Section */}
          <div className="p-5 sm:p-6 md:p-8">
            {/* User Info and Rating */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex gap-3 sm:gap-4">
                <motion.img
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  src={review.user?.profilePicture}
                  alt={review.fullName}
                  className="w-10 h-10 sm:w-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-purple-100"
                  onError={(e) => {
                    e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${review.fullName}`;
                  }}
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <FaUser className="text-purple-500 text-xs sm:text-sm" />
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                      {review.fullName}
                    </h2>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <FaCalendarAlt className="text-gray-400 text-xs" />
                    <p className="text-gray-400 text-xs sm:text-sm">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="self-start sm:self-auto"
              >
                <Rating
                  initialValue={review.rating}
                  readonly
                  allowFraction
                  size={24}
                  fillColor="#f5b301"
                  emptyColor="#d1d5db"
                  SVGstyle={{ display: "inline-block" }}
                />
              </motion.div>
            </div>

            {/* Review Subject */}
            {review.subject && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-6"
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                  {review.subject}
                </h3>
              </motion.div>
            )}

            {/* Review Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-4 text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg"
            >
              {review.reviewText}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 pt-4 border-t border-gray-100"
            >
              <Link to={`/company/${review.company._id}`}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="primary-gradient text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <FaBuilding className="text-sm" />
                  View Company Details
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SingleReview;