import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUpload, FiHome, FiBriefcase, FiMapPin, FiCalendar, FiFileText } from "react-icons/fi";
import API from "../api/axios";
import toast from "react-hot-toast";

const AddCompany = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    foundedOn: "",
    city: "",
    description: "",
  });

  const [logo, setLogo] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);

  // handle text fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // handle image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const companyData = new FormData();
      companyData.append("name", formData.name);
      companyData.append("location", formData.location);
      companyData.append("foundedOn", formData.foundedOn);
      companyData.append("city", formData.city);
      companyData.append("description", formData.description);

      if (logo) {
        companyData.append("logo", logo);
      }

      await API.post("/companies/add-company", companyData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Company Added Successfully");

      // reset form
      setFormData({
        name: "",
        location: "",
        foundedOn: "",
        city: "",
        description: "",
      });
      setLogo(null);
      setPreviewImage("");

      // redirect to home page
      navigate("/");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-100 flex justify-center items-center p-6"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white w-full max-w-2xl rounded-xl shadow-md border border-gray-200 p-6"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 border-b-2 border-gray-200 pb-3">
          Add New Company
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* company name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FiBriefcase className="text-purple-600" />
              Company Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter company name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* location */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FiMapPin className="text-purple-600" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* city */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FiMapPin className="text-purple-600" />
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* founded on */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FiCalendar className="text-purple-600" />
              Founded On
            </label>
            <input
              type="date"
              name="foundedOn"
              value={formData.foundedOn}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FiFileText className="text-purple-600" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter company description"
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-y"
            />
          </div>

          {/* logo upload */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FiUpload className="text-purple-600" />
              Company Logo
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors border border-gray-300">
                  <FiUpload className="text-sm" />
                  <span className="text-sm">Choose Logo</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {logo && (
                <span className="text-sm text-gray-500">
                  {logo.name}
                </span>
              )}
            </div>
          </div>

          {/* image preview */}
          {previewImage && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex justify-center"
            >
              <img
                src={previewImage}
                alt="preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-purple-200 shadow-sm"
              />
            </motion.div>
          )}

          {/* submit button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-2.5 rounded-lg font-medium transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding Company...
              </span>
            ) : (
              "Add Company"
            )}
          </motion.button>

          {/* return home button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => navigate("/")}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 border border-gray-300"
          >
            <FiHome />
            Return to Home
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddCompany;