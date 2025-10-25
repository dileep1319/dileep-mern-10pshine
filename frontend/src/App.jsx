import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import UserProfile from "./pages/UserProfile";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <Router>
      <div
        className={`min-h-screen transition-colors duration-500 ${
          darkMode ? "bg-black text-gray-100" : "bg-gray-100 text-gray-900"
        }`}
      >
        <Routes>
          <Route path="/" element={<Dashboard darkMode={darkMode} />} />
          <Route path="/login" element={<Login darkMode={darkMode} />} />
          <Route path="/signup" element={<Signup darkMode={darkMode} />} />
          <Route
            path="/forgot-password"
            element={<ForgotPassword darkMode={darkMode} />}
          />
          <Route
            path="/dashboard"
            element={<Dashboard darkMode={darkMode} />}
          />
          {/* Pass darkMode + setDarkMode to UserDashboard */}
          <Route
            path="/user-dashboard"
            element={
              <UserDashboard darkMode={darkMode} setDarkMode={setDarkMode} />
            }
          />
          <Route
            path="/profile"
            element={<UserProfile darkMode={darkMode} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
