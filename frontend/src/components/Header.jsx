import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const rawUser = localStorage.getItem("userInfo");
  const user = rawUser ? JSON.parse(rawUser) : null;

  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 55%)`;
  };

  return (
    <header
      className="sticky top-0 z-50 w-full
      bg-[#faf9f8]/80 backdrop-blur-xl 
      border-b border-white/30 shadow-sm
      transition-colors duration-300"
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6 sm:px-10">
        {/* Logo / Brand */}
        <Link
          to="/"
          className="text-2xl font-semibold tracking-tight text-gray-800 select-none flex items-center"
        >
          <span className="mr-1 text-[1.6rem]">🪶</span>
          <span>Notes App</span>
        </Link>

        {/* Auth Buttons / Profile */}
        {!user ? (
          <div className="flex space-x-3">
            <Link
              to="/login"
              className="px-4 py-1.5 text-sm font-medium bg-white/60 
              text-gray-800 rounded-xl border border-gray-200/60 
              hover:bg-white hover:shadow-sm transition-all duration-200"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-1.5 text-sm font-medium bg-gray-900 
              text-white rounded-xl hover:bg-gray-800 transition-all duration-200"
            >
              Signup
            </Link>
          </div>
        ) : (
          <button
            onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-full flex items-center justify-center 
            shadow-sm hover:scale-105 active:scale-95 transition-transform duration-200"
            title={user.name || "User"}
            style={{
              background: `linear-gradient(135deg, ${stringToColor(
                user.name || "User"
              )}, ${stringToColor(user.email || "example")})`,
            }}
          >
            <span className="text-white font-semibold text-lg">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </span>
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
