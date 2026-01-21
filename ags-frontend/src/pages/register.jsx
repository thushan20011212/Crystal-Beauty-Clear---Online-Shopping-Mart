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
          sessionStorage.setItem("token", token);
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
    // Check if all fields are filled
    if (!email || !firstName || !lastName || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Email validation: must contain @ and .
    if (!email.includes("@") || !email.includes(".")) {
      toast.error("Please enter a valid email address (must contain @ and .)");
      return;
    }

    // Password validation: at least 6 characters with at least 1 number
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (!/\d/.test(password)) {
      toast.error("Password must contain at least 1 number");
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
      sessionStorage.setItem("token", token);
      navigate("/");
    } catch (error) {
      console.log("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-primary flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 shadow-2xl rounded-3xl overflow-hidden bg-neutral">
        
        {/* Left side - Brand Showcase */}
        <div className="hidden lg:flex flex-col items-center justify-center bg-secondary text-neutral p-12 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-10 right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-muted/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 space-y-6 text-center">
            <div className="space-y-3">
              <h2 className="text-4xl font-bold">Join Us Today</h2>
              <p className="text-lg text-accent max-w-md">
                Become part of the Avanaa Glowy Square family
              </p>
            </div>
            <div className="pt-4">
              <div className="bg-accent/10 rounded-2xl p-6 space-y-2">
                <h3 className="text-xl font-bold">Member Benefits:</h3>
                <ul className="space-y-2 text-left text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-xl">✓</span>
                    <span>Exclusive discounts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-xl">✓</span>
                    <span>Early product access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-xl">✓</span>
                    <span>Personalized recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-xl">✓</span>
                    <span>Free beauty tips</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Register Form */}
        <div className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md space-y-6">
            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-secondary">Create Account</h1>
              <p className="text-muted text-sm">Start your beauty journey today</p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-secondary">First Name</label>
                  <input
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                    type="text"
                    placeholder="Havindu"
                    className="w-full h-11 border-2 border-accent rounded-xl px-4 text-sm bg-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-secondary">Last Name</label>
                  <input
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                    type="text"
                    placeholder="Thushan"
                    className="w-full h-11 border-2 border-accent rounded-xl px-4 text-sm bg-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-secondary">Email Address</label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="havindu@example.com"
                  className="w-full h-11 border-2 border-accent rounded-xl px-4 text-sm bg-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition"
                />
                <p className="text-xs text-muted">Must contain @ and .</p>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-secondary">Password</label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  placeholder="Create a strong password"
                  className="w-full h-11 border-2 border-accent rounded-xl px-4 text-sm bg-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition"
                />
                <p className="text-xs text-muted">At least 6 characters with 1 number</p>
              </div>

              {/* Register Button */}
              <button
                onClick={handleRegister}
                disabled={isLoading}
                className="w-full h-11 bg-secondary text-neutral font-bold rounded-xl hover:bg-muted hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-neutral border-t-transparent rounded-full animate-spin"></div>
                    Creating account...
                  </span>
                ) : "Create Account"}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-accent"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-neutral text-muted">Or continue with</span>
                </div>
              </div>

              {/* Google Register Button */}
              <button
                onClick={() => googleLogin()}
                disabled={isLoading}
                className="w-full h-11 border-2 border-accent bg-primary text-secondary font-semibold rounded-xl hover:bg-accent/10 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaGoogle className="text-lg" />
                Sign up with Google
              </button>

              {/* Login Link */}
              <p className="text-center text-muted text-sm pt-2">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-secondary font-bold hover:underline transition"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
