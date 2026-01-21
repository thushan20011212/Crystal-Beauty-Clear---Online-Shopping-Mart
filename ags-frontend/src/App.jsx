import { BrowserRouter, Route, Routes } from "react-router-dom"
import "./App.css"
import AdminPage from "./pages/adminPage"
import HomePage from "./pages/home"
import LogInPage from "./pages/logIn"
import ForgetPasswordPage from "./pages/forgetPasswordPage"
import RegisterPage from "./pages/register"
import { Toaster } from "react-hot-toast"
import { GoogleOAuthProvider } from "@react-oauth/google"

function App() {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <BrowserRouter>
                <div>
                    <Toaster />
                    <Routes path="/*">
                        <Route path="/login" element={<LogInPage />} />
                        <Route path="/forgot-password" element={<ForgetPasswordPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/admin/*" element={<AdminPage />} />
                        <Route path="/*" element={<HomePage />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </GoogleOAuthProvider>
    )
}

export default App
