import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsCart3 } from "react-icons/bs";
import { FiLogOut, FiPackage } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { getCart } from "../utils/cart";

export default function Header() {
    const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const navigate = useNavigate();

    // Check if user is logged in
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    // Update cart count
    useEffect(() => {
        const updateCartCount = () => {
            const cart = getCart();
            const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
            setCartCount(totalItems);
        };

        updateCartCount();

        // Listen for cart updates
        window.addEventListener('storage', updateCartCount);
        window.addEventListener('cartUpdated', updateCartCount);

        return () => {
            window.removeEventListener('storage', updateCartCount);
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, []);

    useEffect(() => {
    const handleScroll = () => {
      // If the user scrolls down more than 50px, change the state
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup the listener when the component unmounts
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

    // Logout function
    function handleLogout() {
        sessionStorage.removeItem("token");
        // Keep cart items - don't clear on logout
        setIsLoggedIn(false);
        toast.success("Logged out successfully!");
        navigate("/");
    }

    return (
        <header 
            className={`w-full h-[80px] fixed top-0 z-50 flex justify-center transition-all duration-300 ${
                scrolled 
                    ? "bg-transparent backdrop-blur-sm" 
                    : "bg-white shadow-2xl"
            }`}
        >
            <div className="w-full max-w-[1920px] flex items-center justify-between px-4">
                {/* Mobile Hamburger Menu */}
                <GiHamburgerMenu 
                    className={`text-3xl md:hidden cursor-pointer transition-colors ${
                        scrolled ? "text-white" : "text-secondary"
                    } hover:text-muted`}
                    onClick={() => setSideDrawerOpen(true)}
                /> 
                
                {/* Logo - Centered on Mobile, Left on Desktop */}
                <div className="absolute left-1/2 transform -translate-x-1/2 md:relative md:left-0 md:transform-none">
                    <img 
                        onClick={() => navigate("/")} 
                        src="/logo.png" 
                        alt="Avanaa Glowy Square Logo" 
                        className="w-[80px] h-[80px] object-cover cursor-pointer hover:scale-105 transition-transform"
                    />
                </div>
                
                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
                    <Link 
                        to="/" 
                        className={`text-[18px] font-bold transition-colors relative group ${
                            scrolled ? "text-muted hover:text-neutral" : "text-secondary hover:text-muted"
                        }`}
                    >
                        Home
                        <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                            scrolled ? "bg-white" : "bg-muted"
                        }`}></span>
                    </Link>
                    <Link 
                        to="/products" 
                        className={`text-[18px] font-bold transition-colors relative group ${
                            scrolled ? "text-muted hover:text-neutral" : "text-secondary hover:text-muted"
                        }`}
                    >
                        Products
                        <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                            scrolled ? "bg-white" : "bg-muted"
                        }`}></span>
                    </Link>
                    <Link 
                        to="/about" 
                        className={`text-[18px] font-bold transition-colors relative group ${
                            scrolled ? "text-muted hover:text-neutral" : "text-secondary hover:text-muted"
                        }`}
                    >
                        About
                        <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                            scrolled ? "bg-white" : "bg-muted"
                        }`}></span>
                    </Link>
                    <Link 
                        to="/contact" 
                        className={`text-[18px] font-bold transition-colors relative group ${
                            scrolled ? "text-muted hover:text-neutral" : "text-secondary hover:text-muted"
                        }`}
                    >
                        Contact
                        <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                            scrolled ? "bg-white" : "bg-muted"
                        }`}></span>
                    </Link>
                    <Link 
                        to="/search" 
                        className={`text-[18px] font-bold transition-colors relative group ${
                            scrolled ? "text-muted hover:text-neutral" : "text-secondary hover:text-muted"
                        }`}
                    >
                        Search
                        <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                            scrolled ? "bg-white" : "bg-muted"
                        }`}></span>
                    </Link>
                </nav>
                
                {/* Right Side - Auth Buttons & Cart */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        {isLoggedIn ? (
                            <button 
                                onClick={handleLogout}
                                className={`px-5 py-2.5 text-[15px] font-bold rounded-lg hover:scale-105 transition-all duration-300 whitespace-nowrap flex items-center gap-2 shadow-md ${
                                    scrolled 
                                        ? "text-secondary bg-white/20 backdrop-blur-md hover:bg-white/30" 
                                        : "text-neutral bg-secondary hover:bg-muted"
                                }`}
                            >
                                <FiLogOut className="text-lg" />
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link 
                                    to="/logIn" 
                                    className={`px-5 py-2.5 text-[15px] font-bold rounded-lg hover:scale-105 transition-all duration-300 whitespace-nowrap shadow-md ${
                                        scrolled 
                                            ? "text-secondary bg-white/20 backdrop-blur-md hover:bg-white/30" 
                                            : "text-neutral bg-secondary hover:bg-muted"
                                    }`}
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register" 
                                    className={`px-5 py-2.5 text-[15px] font-bold rounded-lg hover:scale-105 transition-all duration-300 whitespace-nowrap shadow-md ${
                                        scrolled 
                                            ? "text-neutral bg-accent hover:bg-accent/80" 
                                            : "text-neutral bg-accent hover:bg-secondary"
                                    }`}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                    
                    {/* Order History Icon - Only for logged in users */}
                    {isLoggedIn && (
                        <Link 
                            to="/orders" 
                            className={`w-[50px] h-[50px] flex items-center justify-center rounded-full transition-all duration-300 relative group ${
                                scrolled ? "hover:bg-white/20" : "hover:bg-accent/10"
                            }`}
                            title="My Orders"
                        >
                            <FiPackage 
                                className={`text-2xl group-hover:scale-110 transition-all ${
                                    scrolled ? "text-muted" : "text-secondary"
                                }`}
                            />
                        </Link>
                    )}
                    
                    {/* Cart Icon with Badge */}
                    <Link 
                        to="/cart" 
                        className={`w-[50px] h-[50px] flex items-center justify-center rounded-full transition-all duration-300 relative group ${
                            scrolled ? "hover:bg-white/20" : "hover:bg-accent/10"
                        }`}
                    >
                        <AiOutlineShoppingCart 
                            className={`text-3xl group-hover:scale-110 transition-all ${
                                scrolled ? "text-muted" : "text-secondary"
                            }`}
                            title="Shopping Cart" 
                        />
                        {/* Cart Count Badge - Only show when logged in */}
                        {isLoggedIn && cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce shadow-lg">
                                {cartCount > 99 ? '99+' : cartCount}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Mobile Cart Icon with Badge */}
                <div className="md:hidden flex items-center gap-2">
                    {isLoggedIn && (
                        <Link 
                            to="/orders" 
                            className="w-[40px] h-[40px] flex items-center justify-center relative"
                        >
                            <FiPackage 
                                className={`text-xl transition-colors ${
                                    scrolled ? "text-white" : "text-secondary"
                                }`}
                                title="My Orders" 
                            />
                        </Link>
                    )}
                    <Link 
                        to="/cart" 
                        className="w-[40px] h-[40px] flex items-center justify-center relative"
                    >
                        <AiOutlineShoppingCart 
                            className={`text-2xl transition-colors ${
                                scrolled ? "text-white" : "text-secondary"
                            }`}
                            title="Shopping Cart" 
                        />
                        {/* Mobile Cart Count Badge - Only show when logged in */}
                        {isLoggedIn && cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
            
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
                            <a href="/cart" className="text-[20px] font-bold text-secondary mx-2 my-4 flex items-center gap-2">
                                <BsCart3 />
                                {cartCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </span>
                                )}
                            </a>
                            {isLoggedIn && (
                                <a href="/orders" className="text-[20px] font-bold text-secondary mx-2 my-4 flex items-center gap-2">
                                    <FiPackage />
                                    My Orders
                                </a>
                            )}
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