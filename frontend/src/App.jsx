import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import UserProfile from "./pages/UserProfile";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        {/* <header className="w-full text-center py-4">
            <span className="text-5xl font-extrabold text-gray-900 font-dancing-script">Notes App</span>
        </header> */}
        {/* Routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} /> {/* Changed default to Dashboard */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />}/>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} /> {/* New route for UserDashboard */}
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
