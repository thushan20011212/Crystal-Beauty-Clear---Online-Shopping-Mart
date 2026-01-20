import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      setIsLoading(true);
      const accessToken = response.access_token;
      axios
        .post(import.meta.env.VITE_BACKEND_URL + "/api/user/register/google", {
          access_token: accessToken,
        })
        .then((response) => {
          toast.success("Registration successful!");
          const token = response.data.token;
          localStorage.setItem("token", token);
          navigate("/");
        })
        .catch((error) => {
          console.log("Google registration error:", error);
          toast.error(
            error.response?.data?.message || "Google registration failed"
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    onError: () => {
      toast.error("Google registration failed");
      setIsLoading(false);
    },
  });

  async function handleRegister() {
    if (!email || !firstName || !lastName || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/user/",
        {
          email,
          firstName,
          lastName,
          password,
        }
      );

      toast.success("Registration successful!");
      const token = response.data.token;
      localStorage.setItem("token", token);
      navigate("/");
    } catch (error) {
      console.log("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-[url('/login-bg.jpg')] bg-cover bg-center flex items-center justify-center md:justify-evenly px-4 py-6">
      {/* Left side - hidden on mobile */}
      <div className="hidden md:block w-[50%] h-full"></div>

      {/* Right side - Register Form */}
      <div className="w-full md:w-[50%] flex items-center justify-center py-8 md:py-0">
        <div className="w-full max-w-[380px] backdrop-blur-md shadow-xl flex flex-col items-center justify-center rounded-[20px] p-8 md:p-12 gap-6">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Register
          </h1>
          <p className="text-gray-200 text-sm md:text-base mb-4">
            Create your account with Crystal Beauty Clear
          </p>

          {/* First Name Input */}
          <input
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
            type="text"
            placeholder="First Name"
            className="w-full h-12 border border-[#ccc] rounded-xl px-4 text-sm md:text-base bg-white bg-opacity-90 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-50 transition"
          />

          {/* Last Name Input */}
          <input
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
            type="text"
            placeholder="Last Name"
            className="w-full h-12 border border-[#ccc] rounded-xl px-4 text-sm md:text-base bg-white bg-opacity-90 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-50 transition"
          />

          {/* Email Input */}
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email Address"
            className="w-full h-12 border border-[#ccc] rounded-xl px-4 text-sm md:text-base bg-white bg-opacity-90 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-50 transition"
          />

          {/* Password Input */}
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
            className="w-full h-12 border border-[#ccc] rounded-xl px-4 text-sm md:text-base bg-white bg-opacity-90 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-50 transition"
          />

          {/* Register Button */}
          <button
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full h-12 bg-accent text-white font-bold rounded-xl hover:bg-secondary transition text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          {/* Divider */}
          <div className="w-full flex items-center gap-3 my-2">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-300 text-xs">Or continue with</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google Register Button - Coming Soon */}
          <button
            onClick={() => {
              toast.error("Google registration backend endpoint not yet configured. Please use email/password registration.");
            }}
            disabled={true}
            className="w-full h-12 border-2 border-white bg-white bg-opacity-90 text-gray-800 font-semibold rounded-xl hover:bg-opacity-100 transition flex items-center justify-center gap-2 text-sm md:text-base opacity-60 cursor-not-allowed"
            title="Google registration backend endpoint setup needed"
          >
            <FaGoogle className="text-red-500 text-lg" />
            Sign up with Google (Coming Soon)
          </button>

          {/* Login Link */}
          <p className="text-gray-200 text-center text-sm md:text-base mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-white font-bold hover:underline transition"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
