import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate('/user-dashboard');
    }
  }, [navigate]);

  const handleTakeNotesClick = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate('/user-dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f6f8fb] overflow-hidden font-[system-ui] text-gray-900 antialiased">
      <Header />

      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-gray-100 opacity-70"></div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 text-center">
        <div className="backdrop-blur-2xl bg-white/40 border border-white/30 shadow-sm rounded-3xl p-14 sm:p-16 animate-fade-in-down max-w-3xl">
          <h1 className="text-[3rem] sm:text-[4rem] lg:text-[4.5rem] font-semibold tracking-tight text-gray-900 leading-tight mb-6">
            Capture ideas.  
            <br className="hidden sm:block" />
            Create brilliance.
          </h1>
          <p className="text-[1.25rem] sm:text-[1.4rem] text-gray-700 font-medium mb-12 leading-relaxed">
            Because every great thought deserves a place to live.
          </p>

          <button
            onClick={handleTakeNotesClick}
            className="group relative inline-flex items-center justify-center px-10 py-4 text-[1.1rem] font-semibold rounded-full
            text-gray-900 bg-white/80 border border-gray-300 hover:bg-white hover:shadow-md 
            transition-all duration-300 ease-in-out backdrop-blur-md"
          >
            Take Notes
            <svg
              className="ml-2 w-5 h-5 text-gray-700 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </main>

      {/* Soft Ambient Blobs */}
      <div className="absolute top-1/4 left-1/3 w-48 h-48 bg-[#cce3ff] rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-1/2 right-1/4 w-52 h-52 bg-[#fff2d6] rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-[#ffdce5] rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
    </div>
  );
}

export default Dashboard;
