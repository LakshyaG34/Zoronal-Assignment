import { useState } from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import API from "../api/axios";
import { setUser } from "../utils/auth";
import { useAuth } from "../context/AuthContext";

const Login = () => {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] =
        useState(false);



    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            setLoading(true);

            const { data } = await API.post(
                "/auth/login",
                formData
            );

            login(data);

            toast.success("Login Successful");

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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-[400px]"
            >

                <h2 className="text-3xl font-bold mb-6 text-center">
                    Login
                </h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border p-3 rounded mb-4"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border p-3 rounded mb-4"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded"
                >
                    {loading ? "Loading..." : "Login"}
                </button>

                <p className="mt-4 text-center">
                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        className="text-blue-500"
                    >
                        Register
                    </Link>
                </p>

            </form>
        </div>
    );
};

export default Login;