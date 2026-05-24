import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { FaStar } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { HiMenu } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

import { useAuth } from "../context/AuthContext";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  setSearch,
} from "../redux/slices/companySlice";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const dispatch = useDispatch();

  const { search } =
    useSelector(
      (state) => state.company
    );

  // Handle scroll visibility
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide navbar
        setIsVisible(false);
      } else {
        // Scrolling up - show navbar
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);

    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality here
      console.log("Searching for:", searchQuery);
      window.location.href = `/?search=${searchQuery}`;
    }
  };

  // Animation variants
  const navbarVariants = {
    visible: {
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
    hidden: {
      y: "-100%",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const mobileMenuVariants = {
    hidden: {
      x: "100%",
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <>
      <motion.nav
        variants={navbarVariants}
        initial="visible"
        animate={isVisible ? "visible" : "hidden"}
        className="w-full bg-white shadow-lg fixed top-0 left-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          {/* LEFT LOGO */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 group"
          >
            {/* Purple Circle with animation */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full primary-gradient flex items-center justify-center shadow-md"
            >
              <FaStar className="text-white text-sm sm:text-base" />
            </motion.div>

            {/* TEXT */}
            <h1 className="text-xl sm:text-2xl font-bold">
              <span className="font-light">Review</span>
              <span className="primary-gradient-text">&</span>
              <span>RATE</span>
            </h1>
          </Link>

          {/* DESKTOP VIEW */}
          <div className="hidden md:flex items-center justify-between gap-8 text-base">
            {/* Search Bar - Thinner & More Elegant */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search companies..."
                value={search}
                onChange={(e) => dispatch(
                  setSearch(e.target.value)
                )}
                className="w-[280px] lg:w-[360px] px-4 py-2 pr-10 border border-gray-200 rounded-md outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:bg-white transition-all duration-200 text-gray-700 placeholder-gray-400 text-sm bg-gray-50 hover:bg-white"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors duration-200"
              >
                <IoSearch className="text-lg" />
              </button>
            </form>

            {user ? (
              <div className="flex items-center gap-5">
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-medium text-gray-700 text-sm"
                >
                  Hi, {user.name.split(" ")[0]}
                </motion.p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="bg-black text-white px-4 py-1.5 rounded-full hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="text-gray-600 hover:text-purple-600 transition-colors duration-200 font-medium text-sm"
                  >
                    Sign Up
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="px-4 py-1.5 font-medium text-sm"
                  >
                    Login
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Implement mobile search modal if needed
                console.log("Mobile search clicked");
              }}
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              <IoSearch className="text-xl" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              <HiMenu className="text-2xl" />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
            />

            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed right-0 top-0 h-full w-[280px] bg-white shadow-2xl z-50 md:hidden"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="text-xl font-bold">
                  <span className="font-light">Review</span>
                  <span className="primary-gradient-text">&</span>
                  <span>RATE</span>
                </h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <IoClose className="text-2xl" />
                </button>
              </div>

              {/* Menu Content */}
              <div className="flex flex-col p-5 gap-5">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={search}
                    onChange={(e) => dispatch(setSearch(e.target.value))}
                    className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-full outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200 bg-gray-50 text-sm"
                  />
                  <button
                    type="submit"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    <IoSearch className="text-lg" />
                  </button>
                </form>

                {user ? (
                  <div className="flex flex-col gap-4">
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <p className="text-xs text-gray-600 mb-1">Welcome back,</p>
                      <p className="font-semibold text-gray-800 text-base">{user.name}</p>
                      <p className="text-xs text-gray-500 mt-1 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-black text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all duration-200 font-medium text-sm"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-center px-5 py-2.5 border border-purple-600 text-purple-600 rounded-full hover:bg-purple-50 transition-all duration-200 font-medium text-sm"
                    >
                      Sign Up
                    </Link>

                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-center px-5 py-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all duration-200 font-medium text-sm shadow-sm"
                    >
                      Login
                    </Link>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-gray-100 my-2"></div>

                {/* Additional Links */}
                <div className="flex flex-col gap-3">
                  <Link
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-600 hover:text-purple-600 transition-colors py-2 text-sm"
                  >
                    Home
                  </Link>
                  <Link
                    to="/companies"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-600 hover:text-purple-600 transition-colors py-2 text-sm"
                  >
                    Companies
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-600 hover:text-purple-600 transition-colors py-2 text-sm"
                  >
                    About
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-[64px] sm:h-[72px]"></div>
    </>
  );
};

export default Navbar;