import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserProfile({ darkMode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Generate a consistent soft gradient color from a string
  const stringToGradient = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    const hue2 = (hue + 40) % 360;
    return `linear-gradient(135deg, hsl(${hue}, 70%, 55%), hsl(${hue2}, 70%, 65%))`;
  };

  useEffect(() => {
    const raw = localStorage.getItem("userInfo");
    if (!raw) {
      navigate("/login");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setUser(parsed);
    } catch (e) {
      console.log(e);
      localStorage.removeItem("userInfo");
      navigate("/login");
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-6 transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100"
          : "bg-gradient-to-br from-gray-100 via-white to-gray-100 text-gray-900"
      }`}
    >
      <div className="w-full max-w-md">
        {/* Profile Card */}
        <div
          className={`rounded-3xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl backdrop-blur-xl border
          ${
            darkMode
              ? "bg-gray-900/80 border-gray-800"
              : "bg-white/70 border-white/40"
          }`}
        >
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className={`p-2 rounded-full transition-all duration-200 mr-3 ${
                darkMode
                  ? "text-gray-300 hover:text-white hover:bg-gray-800"
                  : "text-gray-700 hover:text-black hover:bg-gray-100"
              }`}
            >
              ←
            </button>
            <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-1">
              Profile
            </h1>
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col items-center text-center mb-10">
            <div
              className="w-24 h-24 rounded-full shadow-md flex items-center justify-center text-white text-3xl font-semibold"
              style={{
                background: stringToGradient(user.name || "User"),
              }}
            >
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <h2 className="mt-4 text-2xl font-semibold">
              {user.name || "User"}
            </h2>
            <p
              className={`mt-1 text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Manage your account details
            </p>
          </div>

          {/* Information Section */}
          <div
            className={`rounded-2xl p-6 space-y-4 border backdrop-blur-lg transition-all duration-300 ${
              darkMode
                ? "bg-gray-800/60 border-gray-700"
                : "bg-white/60 border-gray-100"
            }`}
          >
            {user.name && (
              <div
                className={`flex justify-between items-center border-b pb-3 ${
                  darkMode ? "border-gray-700" : "border-gray-100"
                }`}
              >
                <span
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Full Name
                </span>
                <span
                  className={`font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {user.name}
                </span>
              </div>
            )}
            {user.email && (
              <div className="flex justify-between items-center">
                <span
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Email
                </span>
                <span
                  className={`font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {user.email}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
