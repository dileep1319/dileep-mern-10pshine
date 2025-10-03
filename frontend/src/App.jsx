import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="w-full text-center py-4">
            <span className="text-5xl font-extrabold text-gray-900 font-dancing-script">Notes App</span>
        </header>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
