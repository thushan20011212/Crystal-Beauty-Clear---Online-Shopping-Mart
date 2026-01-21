import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function ForgetPasswordPage() {
    const [otpSent, setOtpSent] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    function sendOtp() {
        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        // Email validation: must contain @ and .
        if (!email.includes("@") || !email.includes(".")) {
            toast.error("Please enter a valid email address (must contain @ and .)");
            return;
        }

        setIsLoading(true);
        axios.post(import.meta.env.VITE_BACKEND_URL + "/api/user/send-otp", {
            email: email
        })
        .then((response) => {
            setOtpSent(true);
            toast.success("OTP sent to your email!");
            console.log(response.data);
        })
        .catch((error) => {
            console.error("Error sending OTP:", error);
            toast.error(error.response?.data?.message || "Failed to send OTP");
        })
        .finally(() => {
            setIsLoading(false);
        });
    }

    function verifyOtp() {
        if (!otp || !newPassword || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        // Password validation: at least 6 characters with at least 1 number
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        if (!/\d/.test(newPassword)) {
            toast.error("Password must contain at least 1 number");
            return;
        }

        setIsLoading(true);
        const otpInNumberFormat = parseInt(otp, 10);
        axios.post(import.meta.env.VITE_BACKEND_URL + "/api/user/reset-password", {
            email: email,
            otp: otpInNumberFormat,
            newPassword: newPassword
        })
        .then((response) => {
            toast.success("Password reset successfully!");
            console.log(response.data);
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        })
        .catch((error) => {
            console.error("Error verifying OTP:", error);
            toast.error(error.response?.data?.message || "Failed to verify OTP");
        })
        .finally(() => {
            setIsLoading(false);
        });
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
              <div className="text-6xl mb-4">🔐</div>
              <h2 className="text-5xl font-bold">Reset Your</h2>
              <h2 className="text-5xl font-bold">Password</h2>
            </div>
            <p className="text-xl text-accent max-w-md">
              Don't worry, it happens to the best of us
            </p>
            <div className="pt-8 space-y-4">
              <div className="flex items-center gap-3 justify-center">
                <div className="w-12 h-12 bg-accent/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📧</span>
                </div>
                <p className="text-left">
                  <span className="block font-bold text-lg">Email Verification</span>
                  <span className="text-sm text-accent">Secure OTP Process</span>
                </p>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <div className="w-12 h-12 bg-accent/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <p className="text-left">
                  <span className="block font-bold text-lg">Quick Recovery</span>
                  <span className="text-sm text-accent">Reset in Minutes</span>
                </p>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <div className="w-12 h-12 bg-accent/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔒</span>
                </div>
                <p className="text-left">
                  <span className="block font-bold text-lg">Secure Process</span>
                  <span className="text-sm text-accent">Your Data is Safe</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md space-y-8">
            
            {/* Email Step */}
            {
              !otpSent ?
              <>
                {/* Title */}
                <div className="text-center space-y-2">
                  <h1 className="text-4xl font-bold text-secondary">Forgot Password?</h1>
                  <p className="text-muted">Enter your email to receive a verification code</p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-secondary">Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 border-2 border-accent rounded-xl px-4 text-base bg-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition"
                    />
                  </div>

                  {/* Send OTP Button */}
                  <button
                    onClick={sendOtp}
                    disabled={isLoading}
                    className="w-full h-12 bg-secondary text-neutral font-bold rounded-xl hover:bg-muted hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-neutral border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </span>
                    ) : "Send Verification Code"}
                  </button>

                  {/* Back to Login */}
                  <p className="text-center text-muted pt-4">
                    Remember your password?{" "}
                    <Link
                      to="/login"
                      className="text-secondary font-bold hover:underline transition"
                    >
                      Back to Login
                    </Link>
                  </p>
                </div>
              </>
              :
              <>
                {/* Title */}
                <div className="text-center space-y-2">
                  <h1 className="text-4xl font-bold text-secondary">Verify OTP</h1>
                  <p className="text-muted">Check your email for the verification code</p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                  {/* OTP Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-secondary">Verification Code</label>
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      className="w-full h-12 border-2 border-accent rounded-xl px-4 bg-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition text-center text-2xl tracking-widest"
                    />
                  </div>

                  {/* New Password Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-secondary">New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-12 border-2 border-accent rounded-xl px-4 text-base bg-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition"
                    />
                  </div>

                  {/* Confirm Password Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-secondary">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-12 border-2 border-accent rounded-xl px-4 text-base bg-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition"
                    />
                  </div>

                  {/* Reset Password Button */}
                  <button
                    onClick={verifyOtp}
                    disabled={isLoading}
                    className="w-full h-12 bg-secondary text-neutral font-bold rounded-xl hover:bg-muted hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-neutral border-t-transparent rounded-full animate-spin"></div>
                        Resetting...
                      </span>
                    ) : "Reset Password"}
                  </button>

                  {/* Back Button */}
                  <button
                    onClick={() => setOtpSent(false)}
                    disabled={isLoading}
                    className="w-full h-12 border-2 border-accent bg-primary text-secondary font-semibold rounded-xl hover:bg-accent/10 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back to Email
                  </button>
                </div>
              </>
            }
          </div>
        </div>
      </div>
    </div>
  );
}