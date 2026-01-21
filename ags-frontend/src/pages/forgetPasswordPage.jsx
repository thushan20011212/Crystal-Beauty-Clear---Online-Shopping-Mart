import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

export default function ForgetPasswordPage() {
    const [otpSent, setOtpSent] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    function sendOtp() {
        axios.post(import.meta.env.VITE_BACKEND_URL + "/api/user/send-otp", {
            email: email
        })
        .then((response) => {
            setOtpSent(true);
            toast.success("OTP sent successfully!");
            console.log(response.data);
        })
        .catch((error) => {
            console.error("Error sending OTP:", error);
            toast.error("Failed to send OTP");
        });
    }

    function verifyOtp() {
        const otpInNumberFormat = parseInt(otp, 10);
        axios.post(import.meta.env.VITE_BACKEND_URL + "/api/user/reset-password", {
            email: email,
            otp: otpInNumberFormat,
            newPassword: newPassword
        })
        .then((response) => {
            toast.success("OTP verified successfully!");
            console.log(response.data);
            // Proceed with password reset
        })
        .catch((error) => {
            console.error("Error verifying OTP:", error);
            toast.error("Failed to verify OTP");
        });
    }

  return (
    <div className="w-full min-h-screen bg-[url('/login-bg.jpg')] bg-cover bg-center flex items-center justify-center md:justify-evenly px-4 py-6">
      {/* Left side - hidden on mobile */}
      <div className="hidden md:block w-[50%] h-full"></div>

      {/* Right side - Form */}
      <div className="w-full md:w-[50%] flex items-center justify-center py-8 md:py-0">
        <div className="w-full max-w-[380px] backdrop-blur-md shadow-xl flex flex-col items-center justify-center rounded-[20px] p-8 md:p-12 gap-6">
          
          {/* Email Step */}
          {
            !otpSent ?
            <>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Forgot Password?</h1>
              <p className="text-gray-200 text-sm md:text-base mb-4">Enter your email to receive OTP</p>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 border border-[#ccc] rounded-xl px-4 text-sm md:text-base bg-white bg-opacity-90 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-50 transition"
              />
              <button
                onClick={sendOtp}
                className="w-full h-12 bg-accent text-white font-bold rounded-xl hover:bg-secondary transition text-sm md:text-base"
              >
                Send OTP
              </button>

              <p className="text-gray-200 text-center text-sm md:text-base mt-4">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-white font-bold hover:underline transition"
                >
                  Login here
                </Link>
              </p>
            </>
            :
            <>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Verify OTP</h1>
              <p className="text-gray-200 text-sm md:text-base mb-4">Enter OTP and new password</p>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full h-12 border border-[#ccc] rounded-xl px-4 text-sm md:text-base bg-white bg-opacity-90 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-50 transition"
              />

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-12 border border-[#ccc] rounded-xl px-4 text-sm md:text-base bg-white bg-opacity-90 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-50 transition"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 border border-[#ccc] rounded-xl px-4 text-sm md:text-base bg-white bg-opacity-90 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-50 transition"
              />

              <button
                onClick={verifyOtp}
                className="w-full h-12 bg-accent text-white font-bold rounded-xl hover:bg-secondary transition text-sm md:text-base"
              >
                Verify OTP
              </button>

              <button
                onClick={() => setOtpSent(false)}
                className="w-full h-12 border border-white text-white font-bold rounded-xl hover:bg-white hover:bg-opacity-10 transition text-sm md:text-base"
              >
                Back
              </button>
            </>
          }
        </div>
      </div>
    </div>
  );
}