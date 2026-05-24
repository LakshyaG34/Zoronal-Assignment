import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaMapMarkerAlt, FaFileAlt, FaThumbsUp } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";

const CompanyDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("latest");

  // review form
  const [formData, setFormData] =
    useState({
      fullName: "",
      subject: "",
      reviewText: "",
      rating: 5,
    });




  // FETCH COMPANY
  const fetchCompany = async () => {
    try {

      const { data } = await API.get(
        `/companies/${id}`
      );

      console.log(data);
      setCompany(data);

    } catch (error) {

      toast.error(
        "Failed to fetch company"
      );

    }
  };


  // FETCH REVIEWS
  const fetchReviews = async () => {
    try {

      setLoading(true);

      const { data } = await API.get(
        `/reviews/${id}?sort=${sort}`
      );

      setReviews(data.reviews);

    } catch (error) {

      toast.error(
        "Failed to fetch reviews"
      );

    } finally {

      setLoading(false);

    }
  };




  useEffect(() => {
    fetchCompany();
    fetchReviews();
  }, [sort]);




  // HANDLE FORM
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };




  // ADD REVIEW
  const handleSubmit = async (e) => {
    e.preventDefault();

    // not logged in
    if (!user) {
      navigate("/login");
      return;
    }

    try {

      await API.post(
        `/reviews/${id}`,
        formData
      );

      toast.success(
        "Review added successfully"
      );

      setFormData({
        fullName: "",
        subject: "",
        reviewText: "",
        rating: 5,
      });

      fetchCompany();
      fetchReviews();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to add review"
      );

    }
  };


  // LIKE REVIEW
  const handleLike = async (
    reviewId
  ) => {

    // guest user
    if (!user) {
      navigate("/login");
      return;
    }

    try {

      await API.patch(
        `/reviews/like/${reviewId}`
      );

      fetchReviews();

    } catch (error) {

      toast.error(
        "Failed to like review"
      );

    }
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
      className="min-h-screen bg-gray-100 p-10"
    >

      {/* COMPANY INFO */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl p-8 shadow-md border border-gray-200 mb-10"
      >

        <div className="flex items-start gap-6 flex-wrap md:flex-nowrap">

          <img
            src={
              company.logo ||
              "https://via.placeholder.com/120"
            }
            alt={company.name}
            className="w-28 h-28 rounded-full object-cover border-2 border-gray-200"
          />

          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2 text-gray-800">
              {company.name}
            </h1>
            <p className="text-gray-600 mb-2 flex items-center gap-1">
              <HiLocationMarker className="text-purple-600" /> {company.city}
            </p>
            <p className="text-gray-500 mb-4 leading-relaxed">
              {company.description}
            </p>
            <div className="flex gap-6 items-center">
              <p className="font-semibold text-lg text-gray-800 flex items-center gap-1">
                <FaStar className="text-yellow-500" /> {company.averageRating}
              </p>
              <p className="text-gray-500 flex items-center gap-1">
                <FaFileAlt className="text-purple-600" /> {company.totalReviews} reviews
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-xl p-8 shadow-md border border-gray-200 mb-10"
      >

        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b-2 border-gray-200 pb-3">
          Add Review
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />

          <textarea
            name="reviewText"
            placeholder="Write your review..."
            value={formData.reviewText}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all h-32 resize-y"
          />

          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
          >

            <option value="1">
              ⭐ 1 Star
            </option>

            <option value="2">
              ⭐⭐ 2 Stars
            </option>

            <option value="3">
              ⭐⭐⭐ 3 Stars
            </option>

            <option value="4">
              ⭐⭐⭐⭐ 4 Stars
            </option>

            <option value="5">
              ⭐⭐⭐⭐⭐ 5 Stars
            </option>

          </select>



          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md"
          >
            Submit Review
          </motion.button>

        </form>

      </motion.div>



      {/* REVIEW HEADER */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">

        <h2 className="text-3xl font-bold text-gray-800">
          Reviews
        </h2>



        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white min-w-[180px]"
        >

          <option value="latest">
            Latest First
          </option>

          <option value="rating">
            Highest Rating
          </option>

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
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="text-gray-600 mt-3">Loading reviews...</p>
          </motion.div>
        )}
      </AnimatePresence>



      {/* REVIEWS */}
      {!loading && (
        <div className="space-y-5">

          <AnimatePresence>
            {reviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
              >

                <div className="flex justify-between items-start mb-4 flex-wrap gap-3">

                  <div className="flex-1">

                    <h3 className="font-bold text-lg text-gray-800">
                      {review.fullName}
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                      {review.subject}
                    </p>

                  </div>



                  <div className="bg-purple-50 px-3 py-1 rounded-full">
                    <p className="font-semibold text-purple-700 flex items-center gap-1">
                      <FaStar className="text-yellow-500" /> {review.rating}
                    </p>
                  </div>

                </div>



                <p className="text-gray-700 mb-5 leading-relaxed">
                  {review.reviewText}
                </p>



                <div className="flex items-center justify-between pt-3 border-t border-gray-100">

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      handleLike(review._id)
                    }
                    className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
                  >
                    <FaThumbsUp className="text-purple-600" /> Like
                    <span className="font-semibold text-gray-700">
                      ({review.likes})
                    </span>
                  </motion.button>

                  <p className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>

                </div>

              </motion.div>
            ))}
          </AnimatePresence>

          {!loading && reviews.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl p-12 text-center border border-gray-200"
            >
              <p className="text-gray-500 text-lg">No reviews yet. Be the first to review!</p>
            </motion.div>
          )}

        </div>
      )}

    </motion.div>
  );
};

export default CompanyDetails;