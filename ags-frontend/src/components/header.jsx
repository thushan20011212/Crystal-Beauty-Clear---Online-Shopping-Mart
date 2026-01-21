import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsCart3 } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function Header() {
    const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // Check if user is logged in
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    // Logout function
    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("cart");
        setIsLoggedIn(false);
        toast.success("Logged out successfully!");
        navigate("/");
    }

    return (
        <header className="w-full h-[80px] shadow-2xl flex justify-center relative">
            {/* Mobile Hamburger Menu */}
            <GiHamburgerMenu 
                className="text-3xl h-full md:hidden absolute left-2" 
                onClick={() => setSideDrawerOpen(true)}
            /> 
            
            {/* Logo */}
            <img 
                onClick={() => navigate("/")} 
                src="/logo.png" 
                alt="Logo" 
                className="w-[80px] h-[80px] object-cover cursor-pointer"
            />
            
            {/* Desktop Navigation Links */}
            <div className="w-[calc(100%-160px)] h-full hidden md:flex items-center justify-center gap-6">
                <Link to="/" className="text-[20px] font-bold text-secondary hover:text-muted transition">Home</Link>
                <Link to="/products" className="text-[20px] font-bold text-secondary hover:text-muted transition">Products</Link>
                <Link to="/about" className="text-[20px] font-bold text-secondary hover:text-muted transition">About</Link>
                <Link to="/contact" className="text-[20px] font-bold text-secondary hover:text-muted transition">Contact</Link>
                <Link to="/search" className="text-[20px] font-bold text-secondary hover:text-muted transition">Search</Link>
            </div>
            
            {/* Right Side Buttons */}
            <div className="hidden md:flex items-center gap-3 pr-4">
                {isLoggedIn ? (
                    <button 
                        onClick={handleLogout}
                        className="px-4 py-2 text-[16px] font-bold text-neutral bg-secondary rounded-lg hover:bg-muted transition whitespace-nowrap flex items-center gap-2"
                    >
                        <FiLogOut />
                        Logout
                    </button>
                ) : (
                    <>
                        <Link to="/logIn" className="px-4 py-2 text-[16px] font-bold text-neutral bg-secondary rounded-lg hover:bg-muted transition whitespace-nowrap">
                            Login
                        </Link>
                        <Link to="/register" className="px-4 py-2 text-[16px] font-bold text-neutral bg-accent rounded-lg hover:bg-secondary hover:text-neutral transition whitespace-nowrap">
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
            
            {/* Cart Icon */}
            <Link to="/cart" className="w-[80px] h-[80px] hidden md:flex items-center justify-center hover:bg-accent transition">
                <AiOutlineShoppingCart className="text-secondary text-3xl" title="Shopping Cart" />
            </Link>
            
            {/* Mobile Side Drawer */}
            {sideDrawerOpen && (
                <div className="fixed h-screen w-full bg-[#00000060] flex md:hidden z-50">
                    <div className="w-[350px] bg-white h-full">
                        <div className="w-full h-[80px] shadow-2xl flex justify-center items-center relative">
                            <GiHamburgerMenu 
                                className="text-3xl h-full md:hidden absolute left-2 cursor-pointer" 
                                onClick={() => setSideDrawerOpen(false)}
                            />
                            <img 
                                onClick={() => window.location.href = "/"} 
                                src="/logo.png" 
                                alt="Logo" 
                                className="w-[40px] h-[40px] object-cover cursor-pointer"
                            />
                        </div>
                        <div className="w-full h-[calc(100%-80px)] flex flex-col items-center gap-2">
                            <a href="/" className="text-[20px] font-bold text-secondary mx-2 my-4">Home</a>
                            <a href="/products" className="text-[20px] font-bold text-secondary mx-2 my-4">Products</a>
                            <a href="/about" className="text-[20px] font-bold text-secondary mx-2 my-4">About</a>
                            <a href="/contact" className="text-[20px] font-bold text-secondary mx-2 my-4">Contact</a>
                            <a href="/cart" className="text-[20px] font-bold text-secondary mx-2 my-4"><BsCart3 /></a>
                            {isLoggedIn ? (
                                <button 
                                    onClick={() => {
                                        setSideDrawerOpen(false);
                                        handleLogout();
                                    }}
                                    className="text-[20px] font-bold mx-2 my-4 text-secondary flex items-center gap-2"
                                >
                                    <FiLogOut />
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <a href="/logIn" className="text-[20px] font-bold text-secondary mx-2 my-4">Login</a>
                                    <a href="/register" className="text-[20px] font-bold text-secondary mx-2 my-4">Sign Up</a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}