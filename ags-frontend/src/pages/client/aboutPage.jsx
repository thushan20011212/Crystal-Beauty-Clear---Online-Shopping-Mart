import { useNavigate } from "react-router-dom";

export default function AboutPage() {
    const navigate = useNavigate();

    return (
        <div className="w-full min-h-screen bg-primary">
            
            {/* Hero Section */}
            <div className="w-full bg-neutral border-b border-accent/20">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl md:text-6xl font-bold text-secondary">About Us</h1>
                        <p className="text-xl text-muted max-w-3xl mx-auto">
                            Discover the story behind Avanaa Glowy Square and our commitment to bringing you premium beauty products
                        </p>
                    </div>
                </div>
            </div>

            {/* Our Story Section */}
            <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <div className="inline-block px-5 py-2 bg-secondary text-neutral rounded-full text-sm font-semibold uppercase tracking-wider">
                            Our Story
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-secondary">
                            Beauty That Inspires Confidence
                        </h2>
                        <div className="space-y-4 text-lg text-muted leading-relaxed">
                            <p>
                                Avanaa Glowy Square was founded with a simple yet powerful vision: to make premium beauty products 
                                accessible to everyone who values quality and authenticity.
                            </p>
                            <p>
                                We believe that beauty is not just about appearance—it's about feeling confident in your own skin. 
                                That's why we carefully curate each product in our collection, ensuring that only the finest, 
                                most effective cosmetics make it to your vanity.
                            </p>
                            <p>
                                From skincare essentials to makeup must-haves, every item is selected with your beauty journey in mind.
                            </p>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <div className="bg-secondary rounded-3xl p-12 text-neutral shadow-2xl">
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <h3 className="text-3xl font-bold">Our Mission</h3>
                                    <p className="text-accent text-lg">
                                        To empower individuals through premium beauty products that enhance natural beauty 
                                        and boost confidence.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-3xl font-bold">Our Vision</h3>
                                    <p className="text-accent text-lg">
                                        To be Sri Lanka's most trusted destination for authentic, high-quality cosmetics 
                                        and beauty essentials.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-accent/20 rounded-full blur-3xl -z-10"></div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="w-full bg-neutral py-20">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="text-center mb-16">
                        <div className="inline-block px-5 py-2 bg-secondary text-neutral rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
                            Our Values
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">What We Stand For</h2>
                        <p className="text-xl text-muted max-w-2xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Value 1 */}
                        <div className="bg-primary p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 space-y-4">
                            <div className="text-5xl">🌿</div>
                            <h3 className="text-2xl font-bold text-secondary">Natural</h3>
                            <p className="text-muted leading-relaxed">
                                We prioritize products with natural ingredients that are gentle on your skin and the environment.
                            </p>
                        </div>

                        {/* Value 2 */}
                        <div className="bg-primary p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 space-y-4">
                            <div className="text-5xl">✨</div>
                            <h3 className="text-2xl font-bold text-secondary">Quality</h3>
                            <p className="text-muted leading-relaxed">
                                Every product is thoroughly vetted to ensure it meets our high standards of excellence.
                            </p>
                        </div>

                        {/* Value 3 */}
                        <div className="bg-primary p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 space-y-4">
                            <div className="text-5xl">💎</div>
                            <h3 className="text-2xl font-bold text-secondary">Authenticity</h3>
                            <p className="text-muted leading-relaxed">
                                We guarantee 100% authentic products from trusted brands and authorized distributors.
                            </p>
                        </div>

                        {/* Value 4 */}
                        <div className="bg-primary p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 space-y-4">
                            <div className="text-5xl">❤️</div>
                            <h3 className="text-2xl font-bold text-secondary">Care</h3>
                            <p className="text-muted leading-relaxed">
                                Your satisfaction is our priority. We're here to support your beauty journey every step.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">Why Choose Avanaa Glowy Square?</h2>
                    <p className="text-xl text-muted max-w-2xl mx-auto">
                        Experience the difference of shopping with a brand that truly cares
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center space-y-4 p-6">
                        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto text-4xl text-neutral">
                            🚚
                        </div>
                        <h3 className="text-2xl font-bold text-secondary">Island-wide Delivery</h3>
                        <p className="text-muted">
                            Fast and reliable shipping to every corner of Sri Lanka. Track your order in real-time.
                        </p>
                    </div>

                    <div className="text-center space-y-4 p-6">
                        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto text-4xl text-neutral">
                            🔒
                        </div>
                        <h3 className="text-2xl font-bold text-secondary">Secure Shopping</h3>
                        <p className="text-muted">
                            Your privacy and security are paramount. Shop with confidence using our secure payment system.
                        </p>
                    </div>

                    <div className="text-center space-y-4 p-6">
                        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto text-4xl text-neutral">
                            💬
                        </div>
                        <h3 className="text-2xl font-bold text-secondary">Expert Support</h3>
                        <p className="text-muted">
                            Our beauty consultants are available 24/7 to help you find the perfect products.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full bg-secondary py-20">
                <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center space-y-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-neutral">Ready to Start Your Beauty Journey?</h2>
                    <p className="text-xl text-accent">
                        Explore our curated collection of premium cosmetics and find your perfect match
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <button 
                            onClick={() => navigate("/products")}
                            className="px-10 py-4 bg-neutral text-secondary rounded-xl font-bold text-lg hover:bg-accent hover:scale-105 transition-all duration-300 shadow-xl"
                        >
                            Shop Now
                        </button>
                        <button 
                            onClick={() => navigate("/contact")}
                            className="px-10 py-4 bg-transparent border-2 border-neutral text-neutral rounded-xl font-bold text-lg hover:bg-neutral hover:text-secondary transition-all duration-300"
                        >
                            Contact Us
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
