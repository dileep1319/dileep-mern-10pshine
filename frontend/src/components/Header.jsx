import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ onSearch, darkMode }) => {
  const navigate = useNavigate();
  const rawUser = localStorage.getItem("userInfo");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const [search, setSearch] = useState("");

  // Generates consistent color for avatar
  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 55%)`;
  };

  // Handle typing (debounced)
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (onSearch) onSearch(search, false);
    }, 400); // debounce delay

    return () => clearTimeout(delay);
  }, [search, onSearch]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(search, true); // true = Enter pressed
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-2xl border-b shadow-sm transition-colors duration-500 ${
        darkMode
          ? "bg-black/80 border-gray-800 text-gray-100"
          : "bg-[#faf9f8]/70 border-white/30 text-gray-800"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6 sm:px-10 gap-4">
        {/* Logo */}
        <Link
          to="/"
          className={`text-2xl font-semibold tracking-tight select-none flex items-center whitespace-nowrap ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          <span className="mr-1 text-[1.6rem]">🪶</span>
          <span>Notes App</span>
        </Link>

        {/* Search Bar */}
        {user && (
          <div className="hidden sm:flex flex-1 justify-center">
            <div className="relative w-full max-w-md group">
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-full border backdrop-blur-lg shadow-inner focus:shadow-lg focus:outline-none focus:ring-2 transition-all duration-300 ease-in-out
                  ${
                    darkMode
                      ? "bg-gray-900/60 text-gray-100 placeholder-gray-400 border-gray-700 focus:ring-gray-600"
                      : "bg-gradient-to-r from-white/60 to-white/40 text-gray-800 placeholder-gray-500 border-white/20 focus:ring-gray-400/30"
                  }`}
              />
              <svg
                className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 transition-transform duration-300 group-focus-within:scale-110 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Profile / Auth */}
        {!user ? (
          <div className="flex space-x-3">
            <Link
              to="/login"
              className={`px-4 py-1.5 text-sm font-medium rounded-xl border transition-all duration-200 ${
                darkMode
                  ? "bg-gray-900 text-gray-100 border-gray-700 hover:bg-gray-800"
                  : "bg-white/60 text-gray-800 border-gray-200/60 hover:bg-white hover:shadow-sm"
              }`}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`px-4 py-1.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                darkMode
                  ? "bg-white text-gray-900 hover:bg-gray-100"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              Signup
            </Link>
          </div>
        ) : (
          <button
            onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-transform duration-200"
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

      {/* Mobile Search */}
      {user && (
        <div className="flex sm:hidden px-4 pb-2">
          <div className="relative w-full group">
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className={`w-full pl-10 pr-4 py-2 text-sm rounded-full border backdrop-blur-lg shadow-inner focus:shadow-lg focus:outline-none focus:ring-2 transition-all duration-300 ease-in-out
                ${
                  darkMode
                    ? "bg-gray-900/60 text-gray-100 placeholder-gray-400 border-gray-700 focus:ring-gray-600"
                    : "bg-gradient-to-r from-white/60 to-white/40 text-gray-800 placeholder-gray-500 border-white/20 focus:ring-gray-400/30"
                }`}
            />
            <svg
              className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 transition-transform duration-300 group-focus-within:scale-110 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
