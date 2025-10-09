import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
      localStorage.removeItem("userInfo");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Avatar & Heading */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <h1 className="mt-4 text-2xl font-semibold text-gray-900">
              {user.name || "User"}
            </h1>
            <p className="text-gray-500 text-sm">Manage your account details</p>
          </div>

          {/* User Info */}
          <div className="space-y-4 mb-8">
            {user.name && (
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-gray-500 text-sm">Full Name</span>
                <span className="font-medium text-gray-800">{user.name}</span>
              </div>
            )}
            {user.email && (
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-gray-500 text-sm">Email</span>
                <span className="font-medium text-gray-800">{user.email}</span>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
