import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-8 font-dancing-script">Welcome to Notes App!</h1>
      <p className="text-lg text-gray-700 mb-8">You have successfully logged in.</p>
      <button
        onClick={handleLogout}
        className="px-6 py-3 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
