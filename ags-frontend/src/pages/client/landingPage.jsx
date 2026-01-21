import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import ProductCard from "../../components/productCard"
import Splash from "../../components/splash"

// Avanaa Glowy Square Landing Page
export default function LandingPage() {

// Crystal Beauty Clear Landing Page
export default function LandingPage() {
    const navigate = useNavigate();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        // Hide splash after 2.5 seconds
        const splashTimer = setTimeout(() => {
            setShowSplash(false);
        }, 2500);

        // Fetch all products
        axios
            .get(import.meta.env.VITE_BACKEND_URL + "/api/products")
            .then((res) => {
                setTotalProducts(res.data.length);
                setFeaturedProducts(res.data.slice(0, 4)); // Get first 4 products
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });

        return () => clearTimeout(splashTimer);
    }, []);

    if (showSplash) {
        return (
            <div className="fixed inset-0 bg-primary z-50 flex items-center justify-center">
                <div className="text-center space-y-8 animate-fade-in">
                    {/* Brand Name with Animation */}
                    <div className="space-y-2">
                        <h1 className="text-6xl md:text-8xl font-bold text-secondary tracking-tight">
                            <span className="inline-block animate-fade-in" style={{ animationDelay: '0.2s' }}>Crystal</span>
                        </h1>
                        <h1 className="text-6xl md:text-8xl font-bold text-secondary tracking-tight">
                            <span className="inline-block animate-fade-in" style={{ animationDelay: '0.4s' }}>Beauty Clear</span>
                        </h1>
                    </div>
                    
                    {/* Loading Dots */}
                    <div className="flex gap-2 justify-center">
                        <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen">
            {/* Hero Section */}
            <section className="relative w-full min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-primary via-neutral to-primary overflow-hidden">
                {/* Subtle Background Blur */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-muted/20 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="text-center lg:text-left space-y-6 animate-fade-in">
                            <div className="inline-block px-6 py-3 bg-secondary/10 backdrop-blur-xl rounded-full border border-accent/30 shadow-lg">
                                <p className="text-sm font-semibold text-secondary uppercase tracking-wider">Premium Cosmetics Brand</p>
                            </div>
                            
                            <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-secondary leading-tight">
                                <span className="inline-block hover:scale-110 transition-transform duration-300">Crystal</span>
                                <span className="block bg-gradient-to-r from-secondary via-muted to-secondary bg-clip-text text-transparent mt-2">
                                    Beauty Clear
                                </span>
                            </h1>
                            
                            <p className="text-xl md:text-2xl text-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                                Elevate your beauty routine with our curated collection of premium cosmetics. 
                                <span className="block mt-2 text-secondary font-medium">Where elegance meets authenticity.</span>
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                                <button 
                                    onClick={() => navigate("/products")}
                                    className="group relative px-8 py-4 bg-secondary text-neutral rounded-xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-secondary/50"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        Explore Collection
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-muted to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                                
                                <button 
                                    onClick={() => navigate("/about")}
                                    className="group px-8 py-4 bg-transparent border-2 border-secondary text-secondary rounded-xl font-bold text-lg hover:bg-secondary hover:text-neutral transition-all duration-300 relative overflow-hidden"
                                >
                                    <span className="relative z-10">Our Story</span>
                                    <div className="absolute inset-0 bg-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                </button>
                            </div>

                            {/* Stats - Real Data */}
                            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-accent/30">
                                <div className="text-center lg:text-left group cursor-pointer">
                                    <p className="text-4xl font-bold text-secondary group-hover:scale-110 transition-transform">{totalProducts}</p>
                                    <p className="text-sm text-muted uppercase tracking-wide">Products</p>
                                </div>
                                <div className="text-center lg:text-left group cursor-pointer">
                                    <p className="text-4xl font-bold text-secondary group-hover:scale-110 transition-transform">100%</p>
                                    <p className="text-sm text-muted uppercase tracking-wide">Authentic</p>
                                </div>
                            </div>
                            
                            {/* Trust Badges - Real Info Only */}
                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-6">
                                <div className="flex items-center gap-2 px-4 py-2 bg-neutral rounded-lg shadow-sm border border-accent/20">
                                    <span className="text-sm text-secondary font-medium">Secure Payment</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-neutral rounded-lg shadow-sm border border-accent/20">
                                    <span className="text-sm text-secondary font-medium">Island-wide Delivery</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-neutral rounded-lg shadow-sm border border-accent/20">
                                    <span className="text-sm text-secondary font-medium">Authentic Products</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Image - Hero Image Showcase */}
                        <div className="relative hidden lg:block">
                            <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-all duration-500 border-4 border-accent/50 group">
                                {/* Main Hero Image */}
                                <img 
                                    src="/images/image (1).jpg" 
                                    alt="Avanaa Glowy Square Premium Cosmetics" 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                {/* Enhanced Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 via-transparent to-transparent group-hover:from-secondary/60 transition-colors duration-500"></div>
                                
                                {/* Image Caption */}
                                <div className="absolute bottom-6 left-6 right-6 bg-neutral/90 backdrop-blur-md p-4 rounded-xl border border-accent/30 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                    <p className="text-secondary font-bold text-lg">Premium Beauty Collection</p>
                                    <p className="text-muted text-sm">Curated with care for your beauty needs</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Brand Story Section - NEW */}
            <section className="w-full py-20 bg-gradient-to-br from-neutral via-primary to-neutral relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Content */}
                        <div className="space-y-6">
                            <div className="inline-block px-4 py-2 bg-secondary text-neutral rounded-full text-sm font-semibold uppercase tracking-wider">
                                Our Philosophy
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-secondary leading-tight">
                                Beauty That Speaks For Itself
                            </h2>
                            <p className="text-lg text-muted leading-relaxed">
                                At Avanaa Glowy Square, we believe that true beauty comes from confidence and authenticity. 
                                Our carefully curated collection combines the finest ingredients with cutting-edge formulations 
                                to bring out your natural radiance.
                            </p>
                            <div className="grid grid-cols-2 gap-6 pt-4">
                                <div className="space-y-2">
                                    <div className="text-3xl">🌿</div>
                                    <h3 className="font-bold text-secondary">Natural Ingredients</h3>
                                    <p className="text-sm text-muted">Sustainably sourced, ethically made</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-3xl">🔬</div>
                                    <h3 className="font-bold text-secondary">Science-Backed</h3>
                                    <p className="text-sm text-muted">Proven formulations that work</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-3xl">🐰</div>
                                    <h3 className="font-bold text-secondary">Cruelty-Free</h3>
                                    <p className="text-sm text-muted">Never tested on animals</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-3xl">♻️</div>
                                    <h3 className="font-bold text-secondary">Eco-Conscious</h3>
                                    <p className="text-sm text-muted">Sustainable packaging solutions</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right: Stats Card */}
                        <div className="relative">
                            <div className="bg-secondary p-12 rounded-3xl text-neutral shadow-2xl">
                                <div className="space-y-8">
                                    <div className="border-b border-neutral/20 pb-6">
                                        <p className="text-6xl font-bold">{totalProducts}</p>
                                        <p className="text-xl text-neutral/80 mt-2">Premium Products</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-4xl font-bold">100%</p>
                                            <p className="text-sm text-neutral/80 mt-1">Authentic</p>
                                        </div>
                                        <div>
                                            <p className="text-4xl font-bold">Fast</p>
                                            <p className="text-sm text-neutral/80 mt-1">Delivery</p>
                                        </div>
                                        <div>
                                            <p className="text-4xl font-bold">Safe</p>
                                            <p className="text-sm text-neutral/80 mt-1">Payment</p>
                                        </div>
                                        <div>
                                            <p className="text-4xl font-bold">24/7</p>
                                            <p className="text-sm text-neutral/80 mt-1">Support</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative Element */}
                            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-accent/30 rounded-full blur-3xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Image Gallery Section */}
            <section className="w-full py-20 bg-primary relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16 animate-fade-in">
                        <div className="inline-block px-4 py-2 bg-secondary text-neutral rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
                            Gallery
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">Discover Our Collection</h2>
                        <p className="text-xl text-muted max-w-2xl mx-auto">Explore our handpicked selection of premium cosmetics designed to enhance your natural beauty</p>
                    </div>

                    {/* Image Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                        {/* Image 2 */}
                        <div className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-4 hover:rotate-2">
                            <img 
                                src="/images/image (2).jpg" 
                                alt="Cosmetic Collection 1" 
                                className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-secondary/20 to-transparent group-hover:from-secondary/80 transition-colors duration-300"></div>
                            <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-neutral font-bold text-sm">Skincare Essentials</p>
                            </div>
                        </div>

                        {/* Image 3 */}
                        <div className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-4 hover:-rotate-2">
                            <img 
                                src="/images/image (3).jpg" 
                                alt="Cosmetic Collection 2" 
                                className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-secondary/20 to-transparent group-hover:from-secondary/80 transition-colors duration-300"></div>
                            <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-neutral font-bold text-sm">Makeup Collection</p>
                            </div>
                        </div>

                        {/* Image 4 */}
                        <div className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-4 hover:rotate-2">
                            <img 
                                src="/images/image (4).jpg" 
                                alt="Cosmetic Collection 3" 
                                className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-secondary/20 to-transparent group-hover:from-secondary/80 transition-colors duration-300"></div>
                            <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-neutral font-bold text-sm">Hair Care</p>
                            </div>
                        </div>

                        {/* Image 5 */}
                        <div className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-4 hover:-rotate-2">
                            <img 
                                src="/images/image (5).jpg" 
                                alt="Cosmetic Collection 4" 
                                className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-secondary/20 to-transparent group-hover:from-secondary/80 transition-colors duration-300"></div>
                            <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-neutral font-bold text-sm">Fragrance</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="w-full py-20 bg-neutral">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-block px-4 py-2 bg-secondary text-neutral rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
                            Why Choose Us
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">The Crystal Beauty Difference</h2>
                        <p className="text-xl text-muted max-w-2xl mx-auto">Experience exceptional quality and service with every purchase</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="group bg-primary p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border border-accent/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                                    <span className="text-3xl">💎</span>
                                </div>
                                <h3 className="text-2xl font-bold text-secondary mb-3">Premium Quality</h3>
                                <p className="text-muted leading-relaxed">
                                    100% authentic cosmetics from trusted brands. Only the finest products make it to our shelves, ensuring you receive nothing but the best.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="group bg-primary p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border border-accent/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                                    <span className="text-3xl">�</span>
                                </div>
                                <h3 className="text-2xl font-bold text-secondary mb-3">Fast Delivery</h3>
                                <p className="text-muted leading-relaxed">
                                    Quick and secure delivery across Sri Lanka. Track your order in real-time and get your beauty essentials delivered to your doorstep.
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="group bg-primary p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border border-accent/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                                    <span className="text-3xl">�</span>
                                </div>
                                <h3 className="text-2xl font-bold text-secondary mb-3">Expert Support</h3>
                                <p className="text-muted leading-relaxed">
                                    Our beauty consultants are here 24/7 to help zyou find the perfect products tailored to your unique beauty needs and skin type.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="w-full py-20 bg-primary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">Featured Products</h2>
                        <p className="text-xl text-muted">Handpicked selections just for you</p>
                    </div>

                    {loading ? (
                        <Splash fullScreen={false} message="Loading products..." />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <button
                            onClick={() => navigate("/products")}
                            className="px-8 py-4 bg-secondary text-neutral rounded-xl font-bold text-lg hover:bg-muted transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            View All Products
                        </button>
                    </div>
                </div>
            </section>

            {/* Newsletter CTA Section */}
            <section className="w-full py-20 bg-gradient-to-r from-secondary via-muted to-secondary relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTYgMzZjMy4zMSAwIDYgMi42OSA2IDZzLTIuNjkgNi02IDYtNi0yLjY5LTYtNiAyLjY5LTYgNi02eiIgZmlsbD0iI2ZmZmZmZiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-neutral mb-6">Stay Updated</h2>
                    <p className="text-xl text-accent mb-8">
                        Subscribe to our newsletter for exclusive offers and beauty tips
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-6 py-4 rounded-xl border-2 border-accent bg-neutral text-secondary placeholder-muted focus:outline-none focus:border-neutral transition-colors"
                        />
                        <button className="px-8 py-4 bg-neutral text-secondary rounded-xl font-bold hover:bg-accent transition-all duration-300 hover:scale-105">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full py-12 bg-secondary text-neutral">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        {/* Brand */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold">Avanaa Glowy Square</h3>
                            <p className="text-accent text-sm">
                                Your trusted source for premium cosmetics and beauty products.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><Link to="/" className="text-accent hover:text-neutral transition-colors">Home</Link></li>
                                <li><Link to="/products" className="text-accent hover:text-neutral transition-colors">Products</Link></li>
                                <li><Link to="/about" className="text-accent hover:text-neutral transition-colors">About</Link></li>
                                <li><Link to="/contact" className="text-accent hover:text-neutral transition-colors">Contact</Link></li>
                            </ul>
                        </div>

                        {/* Customer Care */}
                        <div>
                            <h4 className="text-lg font-bold mb-4">Customer Care</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-accent hover:text-neutral transition-colors">Shipping Info</a></li>
                                <li><a href="#" className="text-accent hover:text-neutral transition-colors">Returns</a></li>
                                <li><a href="#" className="text-accent hover:text-neutral transition-colors">FAQ</a></li>
                                <li><a href="#" className="text-accent hover:text-neutral transition-colors">Support</a></li>
                            </ul>
                        </div>

                        {/* Social Media */}
                        <div>
                            <h4 className="text-lg font-bold mb-4">Connect With Us</h4>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 bg-accent rounded-full flex items-center justify-center hover:bg-neutral hover:text-secondary transition-all">
                                    <span>📘</span>
                                </a>
                                <a href="#" className="w-10 h-10 bg-accent rounded-full flex items-center justify-center hover:bg-neutral hover:text-secondary transition-all">
                                    <span>📷</span>
                                </a>
                                <a href="#" className="w-10 h-10 bg-accent rounded-full flex items-center justify-center hover:bg-neutral hover:text-secondary transition-all">
                                    <span>🐦</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-accent pt-8 text-center">
                        <p className="text-accent text-sm">
                            © 2026 Avanaa Glowy Square. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
