import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";



const Navbar = () => {

  const { user, logout } = useAuth();



  return (
    <div className="flex justify-between items-center px-10 py-4 border-b">

      <Link
        to="/"
        className="text-2xl font-bold"
      >
        ReviewHub
      </Link>



      <div className="flex gap-4 items-center">

        {user ? (
          <>
            <p>
              Hello, {user.name}
            </p>

            <button
              onClick={logout}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>
        )}

      </div>
    </div>
  );
};

export default Navbar;