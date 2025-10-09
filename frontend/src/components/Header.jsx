import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const userInfo = localStorage.getItem('userInfo');

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-2 sm:p-4 bg-white border-b border-gray-200 shadow-sm">
      <nav className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-black">Notes App</Link>
        {!userInfo ? (
          <div className="flex space-x-2 sm:space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors duration-200"
            >
              Signup
            </Link>
          </div>
        ) : (
          <div className="flex items-center space-x-2 sm:space-x-4">
            <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.0 0 0010 16a5.986 5.0 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path></svg>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
