import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const rawUser = localStorage.getItem("userInfo");
  const user = rawUser ? JSON.parse(rawUser) : null;

  // Function to generate consistent color based on user
  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 60%, 50%)`;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-gray-200">
      <nav className="container mx-auto flex items-center justify-between h-16 px-4 sm:px-8">
        <Link
          to="/"
          className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight"
        >
          📝 Notes
        </Link>

        {!user ? (
          <div className="flex space-x-3">
            <Link
              to="/login"
              className="px-4 py-1.5 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-1.5 text-sm font-medium bg-gray-800 text-white rounded-lg hover:bg-black transition-colors"
            >
              Signup
            </Link>
          </div>
        ) : (
          <button
            onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            title={user.name || "User"}
            style={{
              background: `linear-gradient(135deg, ${stringToColor(
                user.name || "User"
              )}, ${stringToColor(user.email || "example")})`,
            }}
          >
            <span className="text-white font-bold text-lg">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </span>
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
