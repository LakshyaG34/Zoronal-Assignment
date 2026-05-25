import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import API from "../api/axios";

import { useAuth }
from "../context/AuthContext";

import {
  FiMail,
  FiLock,
} from "react-icons/fi";

import { motion } from "framer-motion";



const Login = () => {

  const navigate = useNavigate();

  const { login } = useAuth();



  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });



  const [loading, setLoading] =
    useState(false);




  // HANDLE INPUTS
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };



  // SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();



    try {

      setLoading(true);



      const { data } =
        await API.post(
          "/auth/login",
          formData
        );



      login(data);



      toast.success(
        "Login Successful"
      );



      navigate("/");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Something went wrong"
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
        initial={{
          y: -20,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.4,
        }}
        className="bg-white w-full max-w-md rounded-xl shadow-md border border-gray-200 p-8"
      >

        {/* HEADING */}
        <h1 className="text-3xl font-bold text-center mb-8">

          Welcome{" "}

          <span className="primary-gradient-text">
            Back
          </span>

        </h1>



        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* EMAIL */}
          <div>

            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">

              <FiMail className="text-purple-600" />

              Email

            </label>



            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />

          </div>



          {/* PASSWORD */}
          <div>

            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">

              <FiLock className="text-purple-600" />

              Password

            </label>



            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />

          </div>



          {/* SUBMIT */}
          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            type="submit"
            disabled={loading}
            className="w-full primary-gradient text-white py-3 rounded-lg font-medium shadow-md disabled:opacity-50"
          >

            {loading
              ? "Logging In..."
              : "Login"}

          </motion.button>



          {/* REGISTER */}
          <p className="text-center text-gray-600 text-sm">

            Don&apos;t have an account?{" "}

            <Link
              to="/register"
              className="text-purple-600 font-medium hover:underline"
            >
              Register
            </Link>

          </p>

        </form>

      </motion.div>

    </motion.div>
  );
};

export default Login;