import { Link } from "react-router-dom";

import { FaStar } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

import { useAuth } from "../context/AuthContext";



const Navbar = () => {

  const { user, logout } = useAuth();



  return (
    <nav className="w-full bg-white border-b shadow-sm">

      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* LEFT LOGO */}
        <Link
          to="/"
          className="flex items-center gap-3"
        >

          {/* Purple Circle */}
          <div className="w-12 h-12 rounded-full primary-gradient flex items-center justify-center shadow-md">

            <FaStar className="text-white text-lg" />

          </div>



          {/* TEXT */}
          <h1 className="text-3xl font-bold">

            <span className="font-light">
              Review
            </span>

            <span>
              &RATE
            </span>

          </h1>

        </Link>



        {/* CENTER SEARCH */}
        <div className="hidden md:flex items-center bg-white border rounded-lg overflow-hidden w-[420px]">

          <input
            type="text"
            placeholder="Search..."
            className="flex-1 px-4 py-3 outline-none"
          />



          <button className="px-4 text-primary-gradient text-xl">

            <IoSearch />

          </button>

        </div>



        {/* RIGHT */}
        <div className="flex items-center gap-6 text-lg">

          {user ? (
            <>
              <p className="font-medium">
                {user.name}
              </p>



              <button
                onClick={logout}
                className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="hover:text-purple-600 transition"
              >
                SignUp
              </Link>

              <Link
                to="/login"
                className="hover:text-purple-600 transition"
              >
                Login
              </Link>
            </>
          )}

        </div>

      </div>

    </nav>
  );
};

export default Navbar;