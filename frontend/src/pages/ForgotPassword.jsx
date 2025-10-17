import { useState } from "react";
import API from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: enter email, 2: enter code & new password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const { data } = await API.post(
        "/users/forgot-password",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      setSuccess(data.message);
      setStep(2); // move to next step
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset code");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const { data } = await API.post(
        "/users/reset-password",
        { email, code, newPassword },
        { headers: { "Content-Type": "application/json" } }
      );
      setSuccess(data.message);
      setTimeout(() => navigate("/login"), 2000); // redirect after success
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f6f8fb] overflow-hidden font-[system-ui] text-gray-900 antialiased">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-gray-100 opacity-70"></div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="backdrop-blur-2xl bg-white/40 border border-white/30 shadow-sm rounded-3xl p-10 sm:p-12 max-w-md w-full">
          <h1 className="text-[2rem] sm:text-[2.5rem] font-[700] tracking-tight text-gray-900 leading-[1.1] mb-10">
            Forgot Password
          </h1>

          <form
            onSubmit={step === 1 ? handleRequestCode : handleResetPassword}
            className="space-y-6 text-left"
          >
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                <strong className="font-bold">Error! </strong>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg" role="alert">
                <span>{success}</span>
              </div>
            )}

            {step === 1 && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:ring-gray-800 focus:border-gray-800 sm:text-sm bg-white/70 backdrop-blur-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}

            {step === 2 && (
              <>
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    placeholder="Enter 6-digit code"
                    className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:ring-gray-800 focus:border-gray-800 sm:text-sm bg-white/70 backdrop-blur-md"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    placeholder="••••••••"
                    className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:ring-gray-800 focus:border-gray-800 sm:text-sm bg-white/70 backdrop-blur-md"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-full text-lg font-[500] text-gray-900 bg-white/70 hover:bg-white/90 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all duration-300 ease-in-out backdrop-blur-md"
            >
              {step === 1 ? "Send Code" : "Reset Password"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="font-medium text-gray-900 hover:underline transition-all"
            >
              Log in
            </Link>
          </div>
        </div>
      </main>

      <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-[#cce3ff] rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-[#fff2d6] rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      <div className="absolute bottom-1/4 left-1/4 w-44 h-44 bg-[#ffdce5] rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
    </div>
  );
}

export default ForgotPassword;
