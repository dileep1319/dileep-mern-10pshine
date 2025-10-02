import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api"; // Import the centralized API instance

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
      navigate("/dashboard"); // Redirect to dashboard after successful login
    } catch (error) {
      console.error("Login failed:", error.response.data.message);
      setError(error.response.data.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center py-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl overflow-hidden min-h-[calc(100vh-4rem)]">
        {/* Left Section: Login Form */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          <h1 className="text-center text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 font-dancing-script">Notes App</h1>
          <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-800 mb-6 font-dancing-script">Sign In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>} {/* Display error here */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Example@email.com"
                className="mt-1 block w-full px-0 py-2 border-b-2 border-gray-300 focus:border-indigo-500 bg-transparent outline-none text-sm"
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
                placeholder="At least 8 characters"
                className="mt-1 block w-full px-0 py-2 border-b-2 border-gray-300 focus:border-indigo-500 bg-transparent outline-none text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="text-right mt-2">
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Forgot Password?</a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Don't have an account? <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</a>
          </div>
        </div>

        {/* Right Section: Image */}
        <div className="hidden md:w-1/2 md:flex items-center justify-center p-0 bg-gray-100">
          <img src="/notes_photo.jpg" alt="Notes" className="max-w-full h-auto object-contain" />
        </div>
      </div>
    </div>
  );
}

export default Login;
