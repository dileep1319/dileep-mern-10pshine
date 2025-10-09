import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const userInfo = localStorage.getItem("userInfo");

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-2 bg-white border-b border-gray-200 shadow-sm">
      <nav className="container mx-auto flex items-center justify-between h-14">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-black">
          Notes App
        </Link>

        {/* Right side */}
        {!userInfo ? (
          <div className="flex space-x-2">
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-md text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-3 py-1.5 rounded-md text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors"
            >
              Signup
            </Link>
          </div>
        ) : (
          <div className="flex items-center">
            <button
              onClick={() => navigate("/profile")}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Open profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="black"
              >
                <circle cx="12" cy="12" r="12" />
                <path d="M12 7a3 3 0 110 6 3 3 0 010-6z" fill="white" />
                <path d="M6 18c0-2.5 3-4 6-4s6 1.5 6 4" fill="white" />
              </svg>
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
