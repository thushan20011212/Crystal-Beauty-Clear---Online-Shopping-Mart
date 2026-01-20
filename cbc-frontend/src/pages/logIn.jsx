import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

export default function LogInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      const accessToken = response.access_token;
      axios.post(import.meta.env.VITE_BACKEND_URL + "/api/user/login/google", {
          accessToken: accessToken,
        })
        .then((response) => {
          toast.success("Login successful!");
          const token = response.data.token;
          localStorage.setItem("token", token);
          if (response.data.role === "admin") {
            navigate("/admin/");
          } else {
            navigate("/");
          }
        })
    },
  });

  async function handleLogIn() {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/user/login",
        {
          email,
          password,
        }
      );
      toast.success("Login successful!");
      localStorage.setItem("token", response.data.token);

      if (response.data.role === "admin") {
        navigate("/admin/");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-[url('/login-bg.jpg')] bg-cover bg-center flex items-center justify-center md:justify-evenly px-4 py-6">
      {/* Left side - hidden on mobile */}
      <div className="hidden md:block w-[50%] h-full"></div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-[50%] flex items-center justify-center py-8 md:py-0">
        <div className="w-full max-w-[380px] backdrop-blur-md shadow-xl flex flex-col items-center justify-center rounded-[20px] p-8 md:p-12 gap-6">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Login
          </h1>
          <p className="text-gray-200 text-sm md:text-base mb-4">
            Welcome back to Crystal Beauty Clear
          </p>

          {/* Email Input */}
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email Address"
            className="w-full h-[48px] border border-[#ccc] rounded-[12px] px-4 text-sm md:text-base bg-white bg-opacity-90 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-50 transition"
          />

          {/* Password Input */}
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
            className="w-full h-[48px] border border-[#ccc] rounded-[12px] px-4 text-sm md:text-base bg-white bg-opacity-90 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-50 transition"
          />

          {/* Login Button */}
          <button
            onClick={handleLogIn}
            disabled={isLoading}
            className="w-full h-[48px] bg-accent text-white font-bold rounded-[12px] hover:bg-secondary transition text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>

          {/* Divider */}
          <div className="w-full flex items-center gap-3 my-2">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-300 text-xs">Or continue with</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google Login Button */}
          <button
            onClick={() => googleLogin()}
            className="w-full h-[48px] border-2 border-white bg-white bg-opacity-90 text-gray-800 font-semibold rounded-[12px] hover:bg-opacity-100 transition flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaGoogle className="text-red-500 text-lg" />
            Sign in with Google
          </button>

          {/* Register Link */}
          <p className="text-gray-200 text-center text-sm md:text-base mt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-white font-bold hover:underline transition"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}