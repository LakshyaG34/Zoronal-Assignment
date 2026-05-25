import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  FaFileAlt,
  FaTimes,
  FaPen,
  FaStar,
} from "react-icons/fa";
import {
  HiLocationMarker,
} from "react-icons/hi";
import {
  Rating,
} from "react-simple-star-rating";
import AddReview from "../components/AddReview";
import ReviewsList from "../components/ReviewList";

const CompanyDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [company, setCompany] =
    useState(null);

  const [reviews, setReviews] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [sort, setSort] =
    useState("latest");

  const [showReviewForm, setShowReviewForm] =
    useState(false);

  // FETCH COMPANY
  const fetchCompany = async () => {
    try {
      const { data } =
        await API.get(
          `/companies/${id}`
        );
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
      const { data } =
        await API.get(
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

  const handleReviewSuccess = () => {

    setShowReviewForm(false);

    fetchCompany();
    fetchReviews();

  };

  const handleAddReviewClick = () => {

    if (!user) {

      navigate("/login");
      return;
    }

    setShowReviewForm(
      (prev) => !prev
    );
  };

  if (!company) {

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        Loading...
      </div>
    );

  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100 p-6 md:p-10"
    >
      <div className="w-full max-w-7xl mx-auto bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-8 md:p-10">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            <div className="flex gap-6">
              <img
                src={
                  company.logo ||
                  "https://via.placeholder.com/120"
                }
                alt={company.name}
                className="w-28 h-28 rounded-2xl object-cover border border-gray-100"
              />

              <div>

                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {company.name}
                </h1>



                <p className="flex items-center gap-2 text-gray-500 mb-4">

                  <HiLocationMarker className="text-purple-500" />
                  {company.location}
                </p>

                <p className="text-gray-500 max-w-3xl leading-relaxed mb-6">
                  {company.description}
                </p>

                <div className="flex items-center gap-8 flex-wrap">

                  <div className="flex items-center gap-3 whitespace-nowrap">

                    <span className="text-2xl font-bold">
                      {Number(
                        company.averageRating || 0
                      ).toFixed(1)}
                    </span>

                    <div className="flex items-center">
                      <Rating
                        initialValue={
                          company.averageRating
                        }
                        readonly
                        allowFraction
                        size={24}
                        fillColor="#f5b301"
                        emptyColor="#d1d5db"
                        SVGstyle={{
                          display: "inline-block",
                        }}
                      />
                    </div>

                  </div>

                  <div className="flex items-center gap-2 text-gray-500">

                    <FaFileAlt className="text-purple-500" />

                    <span>
                      {company.totalReviews} Reviews
                    </span>

                  </div>

                </div>

              </div>

            </div>

            <div className="flex flex-col items-end gap-6">

              <p className="text-gray-400 text-sm border border-gray-200 rounded-full px-4 py-2">

                Founded{" "}

                {new Date(
                  company.foundedOn
                ).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )}

              </p>

              <button
                onClick={
                  handleAddReviewClick
                }
                className="primary-gradient text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-3"
              >
                {showReviewForm ? (
                  <>
                    <FaTimes />
                    Close
                  </>
                ) : (
                  <>
                    <FaPen />
                    + Add Review
                  </>
                )}

              </button>

            </div>

          </div>

        </div>

        <div className="border-t border-gray-200" />

        <AnimatePresence>

          {showReviewForm && (

            <div className="px-8 md:px-10 pt-8">

              <AddReview
                companyId={id}
                onSuccess={
                  handleReviewSuccess
                }
              />

            </div>

          )}

        </AnimatePresence>
        
        <div className="px-8 md:px-10 py-10">

          <ReviewsList
            reviews={reviews}
            loading={loading}
            sort={sort}
            onSortChange={setSort}
            onRefresh={fetchReviews}
          />

        </div>

      </div>

    </motion.div>
  );
};

export default CompanyDetails;