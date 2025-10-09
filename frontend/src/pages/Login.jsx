import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api"; // Import the centralized API instance
// import Header from '../components/Header'; // Removed Header import

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // State for error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      const { data } = await API.post(
        "/users/login", // Use relative path since baseURL is set in API instance
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/user-dashboard"); // Redirect to user-dashboard after successful login
    } catch (error) {
      console.error("Login failed:", error.response.data.message);
      setError(error.response.data.message || "Login failed");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center justify-center p-4">
      {/* <Header /> */} {/* Removed Header component */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-xl p-8">

        <h1 className="text-center text-4xl font-extrabold text-gray-900 mb-6">Notes App</h1>
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-8"></h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>} 
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="text-right mt-2">
              <Link to="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Forgot Password?</Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-black hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</Link>
        </div>
      </div>

      {/* Removed decorative animated blobs for a clean, instant feel */}
    </div>
  );
}

export default Login;
