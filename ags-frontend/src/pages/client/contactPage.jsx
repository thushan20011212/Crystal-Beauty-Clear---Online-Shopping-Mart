import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsSubmitting(true);
        
        // Simulate form submission
        setTimeout(() => {
            toast.success("Thank you! We'll get back to you soon.");
            setFormData({ name: "", email: "", subject: "", message: "" });
            setIsSubmitting(false);
        }, 1500);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="w-full min-h-screen bg-primary">
            
            {/* Hero Section */}
            <div className="w-full bg-neutral border-b border-accent/20">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl md:text-6xl font-bold text-secondary">Contact Us</h1>
                        <p className="text-xl text-muted max-w-3xl mx-auto">
                            We'd love to hear from you! Get in touch with our team for any questions, concerns, or feedback
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Content */}
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    
                    {/* Contact Form */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="inline-block px-5 py-2 bg-secondary text-neutral rounded-full text-sm font-semibold uppercase tracking-wider">
                                Get In Touch
                            </div>
                            <h2 className="text-4xl font-bold text-secondary">Send Us a Message</h2>
                            <p className="text-lg text-muted">
                                Fill out the form below and our team will respond within 24 hours
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-secondary">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full h-12 border-2 border-accent rounded-xl px-4 text-base bg-neutral focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition"
                                />
                            </div>

                            {/* Email Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-secondary">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    className="w-full h-12 border-2 border-accent rounded-xl px-4 text-base bg-neutral focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition"
                                />
                            </div>

                            {/* Subject Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-secondary">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="How can we help you?"
                                    className="w-full h-12 border-2 border-accent rounded-xl px-4 text-base bg-neutral focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition"
                                />
                            </div>

                            {/* Message Textarea */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-secondary">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us more about your inquiry..."
                                    rows="6"
                                    className="w-full border-2 border-accent rounded-xl px-4 py-3 text-base bg-neutral focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition resize-none"
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-14 bg-secondary text-neutral font-bold rounded-xl hover:bg-muted hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-neutral border-t-transparent rounded-full animate-spin"></div>
                                        Sending...
                                    </span>
                                ) : "Send Message"}
                            </button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="inline-block px-5 py-2 bg-secondary text-neutral rounded-full text-sm font-semibold uppercase tracking-wider">
                                Contact Information
                            </div>
                            <h2 className="text-4xl font-bold text-secondary">Let's Connect</h2>
                            <p className="text-lg text-muted">
                                Reach out through any of these channels
                            </p>
                        </div>

                        {/* Contact Cards */}
                        <div className="space-y-6">
                            {/* Email Card */}
                            <div className="bg-neutral p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-accent/20">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                                        <span className="text-2xl text-neutral">📧</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-secondary">Email Us</h3>
                                        <p className="text-muted">We typically respond within 24 hours</p>
                                        <a href="mailto:support@avanaaglowysquare.com" className="text-secondary font-semibold hover:underline">
                                            support@avanaaglowysquare.com
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Phone Card */}
                            <div className="bg-neutral p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-accent/20">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                                        <span className="text-2xl text-neutral">📱</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-secondary">Call Us</h3>
                                        <p className="text-muted">Monday - Saturday, 9 AM - 6 PM</p>
                                        <a href="tel:+94123456789" className="text-secondary font-semibold hover:underline">
                                            +94 123 456 789
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Location Card */}
                            <div className="bg-neutral p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-accent/20">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                                        <span className="text-2xl text-neutral">📍</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-secondary">Visit Us</h3>
                                        <p className="text-muted">
                                            123 Beauty Street<br />
                                            Colombo, Sri Lanka
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media Card */}
                            <div className="bg-neutral p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-accent/20">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                                        <span className="text-2xl text-neutral">💬</span>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-bold text-secondary">Follow Us</h3>
                                        <p className="text-muted">Stay connected on social media</p>
                                        <div className="flex gap-3">
                                            <a href="#" className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-muted transition">
                                                <span className="text-lg">📘</span>
                                            </a>
                                            <a href="#" className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-muted transition">
                                                <span className="text-lg">📷</span>
                                            </a>
                                            <a href="#" className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-muted transition">
                                                <span className="text-lg">🐦</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Quick Links */}
            <section className="w-full bg-neutral py-20 border-t border-accent/20">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">Frequently Asked Questions</h2>
                        <p className="text-muted">Quick answers to common questions</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <div className="bg-primary p-6 rounded-xl hover:shadow-lg transition">
                            <h3 className="text-lg font-bold text-secondary mb-2">How long does delivery take?</h3>
                            <p className="text-muted text-sm">Island-wide delivery typically takes 2-5 business days depending on your location.</p>
                        </div>
                        <div className="bg-primary p-6 rounded-xl hover:shadow-lg transition">
                            <h3 className="text-lg font-bold text-secondary mb-2">Are all products authentic?</h3>
                            <p className="text-muted text-sm">Yes! We guarantee 100% authentic products from authorized distributors only.</p>
                        </div>
                        <div className="bg-primary p-6 rounded-xl hover:shadow-lg transition">
                            <h3 className="text-lg font-bold text-secondary mb-2">What payment methods do you accept?</h3>
                            <p className="text-muted text-sm">We accept cash on delivery and all major credit/debit cards for secure online payment.</p>
                        </div>
                        <div className="bg-primary p-6 rounded-xl hover:shadow-lg transition">
                            <h3 className="text-lg font-bold text-secondary mb-2">Do you have a return policy?</h3>
                            <p className="text-muted text-sm">Yes, we offer a 7-day return policy for unopened products in original packaging.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
