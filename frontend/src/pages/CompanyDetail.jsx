import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaFileAlt, FaTimes, FaPen, FaPlus, FaStar } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import AddReview from "../components/AddReview";
import ReviewsList from "../components/ReviewList";

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("latest");
  const [showReviewForm, setShowReviewForm] = useState(false);

  // FETCH COMPANY
  const fetchCompany = async () => {
    try {
      const { data } = await API.get(`/companies/${id}`);
      setCompany(data);
    } catch (error) {
      toast.error("Failed to fetch company");
    }
  };

  // FETCH REVIEWS
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/reviews/${id}?sort=${sort}`);
      setReviews(data.reviews);
    } catch (error) {
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
    fetchReviews();
  }, [sort]);

  // Called after successful review submission
  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    fetchCompany();
    fetchReviews();
  };

  // Toggle review form (redirect to login if guest)
  const handleAddReviewClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowReviewForm((prev) => !prev);
  };

  if (!company) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-100 p-10 flex items-center justify-center"
      >
        <div className="text-xl text-gray-600">Loading...</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-100 p-6 md:p-10"
    >

      {/* COMPANY INFO */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 mb-8"
      >
        <div className="flex items-start gap-6 flex-wrap md:flex-nowrap">
          <img
            src={company.logo || "https://via.placeholder.com/120"}
            alt={company.name}
            className="w-28 h-28 rounded-2xl object-cover border border-gray-100 shadow-sm"
          />

          <div className="flex-1">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-3xl font-bold mb-1 text-gray-800">
                  {company.name}
                </h1>
                <p className="text-gray-500 text-sm mb-1 flex items-center gap-1">
                  <HiLocationMarker className="text-purple-500" />
                  {company.city}
                </p>
              </div>

              {/* Founded badge */}
              {company.foundedOn && (
                <span className="text-xs text-gray-400 border border-gray-200 rounded-full px-3 py-1 whitespace-nowrap">
                  Founded {new Date(company.foundedOn).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                </span>
              )}
            </div>

            <p className="text-gray-500 mt-3 mb-4 leading-relaxed text-sm">
              {company.description}
            </p>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex gap-5 items-center">
                <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-100 px-3 py-1.5 rounded-full">
                  <FaStar className="text-yellow-500 text-sm" />
                  <span className="font-bold text-gray-800 text-sm">
                    {company.averageRating}
                  </span>
                </div>
                <p className="text-gray-400 text-sm flex items-center gap-1.5">
                  <FaFileAlt className="text-purple-400" />
                  {company.totalReviews} reviews
                </p>
              </div>

              {/* Add Review button — bottom-right of company card */}
              <motion.button
                onClick={handleAddReviewClick}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-5 py-2.5 rounded-xl shadow-md shadow-purple-100 font-medium text-sm transition-all"
              >
                <AnimatePresence mode="wait">
                  {showReviewForm ? (
                    <motion.span
                      key="close"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-2"
                    >
                      <FaTimes className="text-xs" /> Close
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-2"
                    >
                      <FaPen className="text-xs" /> + Add Review
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ADD REVIEW FORM — slides in between company info and reviews */}
      <AnimatePresence>
        {showReviewForm && (
          <AddReview
            companyId={id}
            onSuccess={handleReviewSuccess}
          />
        )}
      </AnimatePresence>

      <ReviewsList
        reviews={reviews}
        loading={loading}
        sort={sort}
        onSortChange={setSort}
        onRefresh={fetchReviews}
      />

    </motion.div>
  );
};

export default CompanyDetails;
