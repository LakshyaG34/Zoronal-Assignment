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
      <div className="p-10">
        Loading...
      </div>
    );
  }




  return (
    <div className="min-h-screen bg-gray-100 p-10">

      {/* COMPANY INFO */}
      <div className="bg-white rounded-xl p-8 shadow-sm mb-10">

        <div className="flex items-center gap-6">

          <img
            src={
              company.logo ||
              "https://via.placeholder.com/120"
            }
            alt={company.name}
            className="w-28 h-28 rounded-full object-cover"
          />



          <div>

            <h1 className="text-4xl font-bold mb-2">
              {company.name}
            </h1>

            <p className="text-gray-600 mb-2">
              {company.city}
            </p>

            <p className="text-gray-500 mb-4">
              {company.description}
            </p>

            <div className="flex gap-4">

              <p className="font-semibold">
                ⭐ {company.averageRating}
              </p>

              <p className="text-gray-500">
                {company.totalReviews} reviews
              </p>

            </div>

          </div>

        </div>

      </div>



      {/* ADD REVIEW */}
      <div className="bg-white rounded-xl p-8 shadow-sm mb-10">

        <h2 className="text-2xl font-bold mb-6">
          Add Review
        </h2>



        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />



          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />



          <textarea
            name="reviewText"
            placeholder="Write your review..."
            value={formData.reviewText}
            onChange={handleChange}
            className="w-full border p-3 rounded h-32"
          />



          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          >

            <option value="1">
              1 Star
            </option>

            <option value="2">
              2 Stars
            </option>

            <option value="3">
              3 Stars
            </option>

            <option value="4">
              4 Stars
            </option>

            <option value="5">
              5 Stars
            </option>

          </select>



          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded"
          >
            Submit Review
          </button>

        </form>

      </div>



      {/* REVIEW HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h2 className="text-3xl font-bold">
          Reviews
        </h2>



        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
          className="border p-3 rounded"
        >

          <option value="latest">
            Latest
          </option>

          <option value="rating">
            Highest Rating
          </option>

        </select>

      </div>



      {/* LOADING */}
      {loading && (
        <div>Loading reviews...</div>
      )}



      {/* REVIEWS */}
      <div className="space-y-6">

        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white p-6 rounded-xl shadow-sm"
          >

            <div className="flex justify-between mb-3">

              <div>

                <h3 className="font-bold text-lg">
                  {review.fullName}
                </h3>

                <p className="text-gray-500">
                  {review.subject}
                </p>

              </div>



              <p className="font-semibold">
                ⭐ {review.rating}
              </p>

            </div>



            <p className="text-gray-700 mb-4">
              {review.reviewText}
            </p>



            <button
              onClick={() =>
                handleLike(review._id)
              }
              className="text-sm bg-gray-200 px-4 py-2 rounded"
            >
              👍 Like ({review.likes})
            </button>

          </div>
        ))}

      </div>

    </div>
  );
};

export default CompanyDetails;