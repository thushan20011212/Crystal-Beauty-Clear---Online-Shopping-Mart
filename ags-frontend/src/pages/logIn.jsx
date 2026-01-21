import { useState } from "react"
import { useGoogleLogin } from "@react-oauth/google"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useNavigate, Link } from "react-router-dom"
import { FaGoogle } from "react-icons/fa"

export default function LogInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordError, setShowPasswordError] = useState(false)
  const navigate = useNavigate()

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      const accessToken = response.access_token
      axios.post(import.meta.env.VITE_BACKEND_URL + "/api/user/login/google", {
          accessToken: accessToken,
        })
        .then((response) => {
          toast.success("Login successful!")
          const token = response.data.token
          sessionStorage.setItem("token", token)
          if (response.data.role === "admin") {
            navigate("/admin/")
          } else {
            navigate("/")
          }
        })
    },
  })

  async function handleLogIn() {
    // Validate email
    if (!email || !password) {
      toast.error("Please enter email and password")
      return
    }

    // Email validation: must contain @ and .
    if (!email.includes("@") || !email.includes(".")) {
      toast.error("Please enter a valid email address (must contain @ and .)")
      return
    }

    // Password validation: at least 6 characters with at least 1 number
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }

    if (!/\d/.test(password)) {
      toast.error("Password must contain at least 1 number")
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/user/login",
        {
          email,
          password,
        }
      )
      toast.success("Login successful!")
      sessionStorage.setItem("token", response.data.token)

      if (response.data.role === "admin") {
        navigate("/admin/")
      } else {
        navigate("/")
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message
      
      if (errorMessage === "Incorrect password") {
        setShowPasswordError(true)
        toast.error("Wrong password! Click 'Forgot password?' to reset.", {
          duration: 5000,
        })
      } else if (errorMessage === "User not found") {
        setShowPasswordError(false)
        toast.error("No account found with this email.")
      } else {
        setShowPasswordError(false)
        toast.error(errorMessage || "Login failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-primary flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 shadow-2xl rounded-3xl overflow-hidden bg-neutral">
        
        {/* Left side - Brand Showcase */}
        <div className="hidden lg:flex flex-col items-center justify-center bg-secondary text-neutral p-12 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-10 right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-muted/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 space-y-8 text-center">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold">Avanaa</h2>
              <h2 className="text-5xl font-bold">Glowy Square</h2>
            </div>
            <p className="text-xl text-accent max-w-md">
              Premium cosmetics for your natural beauty
            </p>
            <div className="pt-8 space-y-4">
              <div className="flex items-center gap-3 justify-center">
                <div className="w-12 h-12 bg-accent/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <p className="text-left">
                  <span className="block font-bold text-lg">Premium Quality</span>
                  <span className="text-sm text-accent">100% Authentic Products</span>
                </p>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <div className="w-12 h-12 bg-accent/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🚚</span>
                </div>
                <p className="text-left">
                  <span className="block font-bold text-lg">Fast Delivery</span>
                  <span className="text-sm text-accent">Island-wide Shipping</span>
                </p>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <div className="w-12 h-12 bg-accent/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔒</span>
                </div>
                <p className="text-left">
                  <span className="block font-bold text-lg">Secure Payment</span>
                  <span className="text-sm text-accent">Safe & Protected</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-secondary">Welcome Back</h1>
              <p className="text-muted">Sign in to your account</p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-secondary">Email Address</label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-12 border-2 border-accent rounded-xl px-4 text-base bg-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-secondary">Password</label>
                  <Link to="/forgot-password" className="text-xs text-muted hover:text-secondary transition">
                    Forgot password?
                  </Link>
                </div>
                <input
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setShowPasswordError(false)
                  }}
                  value={password}
                  type="password"
                  placeholder="Enter your password"
                  className="w-full h-12 border-2 border-accent rounded-xl px-4 text-base bg-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition"
                />
              </div>

              {/* Wrong Password Alert */}
              {showPasswordError && (
                <div className="bg-secondary/5 border-2 border-secondary rounded-xl p-4 animate-fadeIn">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🔐</div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-secondary mb-1">Wrong Password?</h3>
                      <p className="text-xs text-muted mb-3">
                        Don't worry! You can reset your password easily.
                      </p>
                      <Link
                        to="/forgot-password"
                        className="inline-block w-full text-center py-2 px-4 bg-secondary text-neutral text-sm font-semibold rounded-lg hover:bg-muted transition-all duration-300"
                      >
                        Reset Password Now
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Login Button */}
              <button
                onClick={handleLogIn}
                disabled={isLoading}
                className="w-full h-12 bg-secondary text-neutral font-bold rounded-xl hover:bg-muted hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-neutral border-t-transparent rounded-full animate-spin"></div>
                    Logging in...
                  </span>
                ) : "Log In"}
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

              {/* Google Login Button */}
              <button
                onClick={() => googleLogin()}
                className="w-full h-12 border-2 border-accent bg-primary text-secondary font-semibold rounded-xl hover:bg-accent/10 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3"
              >
                <FaGoogle className="text-xl" />
                Sign in with Google
              </button>

              {/* Register Link */}
              <p className="text-center text-muted pt-4">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-secondary font-bold hover:underline transition"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}