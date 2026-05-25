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
    FiUpload,
    FiUser,
    FiMail,
    FiLock,
} from "react-icons/fi";

import { motion } from "framer-motion";



const Register = () => {

    const { login } = useAuth();

    const navigate = useNavigate();



    const [formData, setFormData] =
        useState({
            name: "",
            email: "",
            password: "",
        });



    const [profilePicture,
        setProfilePicture] =
        useState(null);



    const [previewImage,
        setPreviewImage] =
        useState("");



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



    // HANDLE IMAGE
    const handleImageChange = (e) => {

        const file =
            e.target.files[0];



        if (file) {

            setProfilePicture(file);

            setPreviewImage(
                URL.createObjectURL(file)
            );

        }
    };



    // SUBMIT
    const handleSubmit = async (e) => {

        e.preventDefault();



        try {

            setLoading(true);



            const userData =
                new FormData();



            userData.append(
                "name",
                formData.name
            );

            userData.append(
                "email",
                formData.email
            );

            userData.append(
                "password",
                formData.password
            );



            if (profilePicture) {

                userData.append(
                    "profilePicture",
                    profilePicture
                );

            }



            const { data } =
                await API.post(
                    "/auth/register",
                    userData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data",
                        },
                    }
                );



            login(data);



            toast.success(
                "Registered Successfully"
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

                    Create{" "}

                    <span className="primary-gradient-text">
                        Account
                    </span>

                </h1>



                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* PROFILE IMAGE */}
                    <div className="flex flex-col items-center">

                        <label className="cursor-pointer group">

                            {previewImage ? (

                                <img
                                    src={previewImage}
                                    alt="preview"
                                    className="w-28 h-28 rounded-full object-cover border-4 border-purple-200 shadow-sm"
                                />

                            ) : (

                                <div className="w-28 h-28 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center group-hover:border-purple-400 transition">

                                    <FiUpload className="text-3xl text-gray-400 group-hover:text-purple-500" />

                                </div>

                            )}



                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                        </label>



                        <p className="text-sm text-gray-500 mt-3">
                            Upload Profile Picture
                        </p>

                    </div>



                    {/* NAME */}
                    <div>

                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">

                            <FiUser className="text-purple-600" />

                            Name

                        </label>



                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            required
                        />

                    </div>



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
                            ? "Creating Account..."
                            : "Register"}

                    </motion.button>



                    {/* LOGIN */}
                    <p className="text-center text-gray-600 text-sm">

                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="text-purple-600 font-medium hover:underline"
                        >
                            Login
                        </Link>

                    </p>

                </form>

            </motion.div>

        </motion.div>
    );
};

export default Register;