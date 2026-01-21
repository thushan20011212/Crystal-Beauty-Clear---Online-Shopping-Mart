import axios from 'axios';
import { useState } from 'react';
import ProductCard from '../../components/productCard';
import Loading from '../../components/loading';

export default function SearchProductPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState("");

    return (
        <div className="w-full min-h-screen bg-primary">
            {/* Search Header */}
            <div className="w-full bg-neutral border-b border-accent/20">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
                    <div className="text-center space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-bold text-secondary">Search Products</h1>
                            <p className="text-lg text-muted max-w-2xl mx-auto">
                                Find your perfect beauty product from our premium collection
                            </p>
                        </div>
                        
                        {/* Search Input */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by product name, brand, or category..."
                                    value={query}
                                    onChange={async (e) => {
                                        setQuery(e.target.value);
                                        setIsLoading(true);
                                        if(e.target.value.length == 0){
                                            setProducts([]);
                                            setIsLoading(false);
                                            return;
                                        }
                                        try {
                                            const q = encodeURIComponent(e.target.value.trim());
                                            const response = await axios.get(import.meta.env.VITE_BACKEND_URL + 
                                                "/api/products/search/" + q
                                            );
                                            setProducts(response.data);
                                        } catch (error) {
                                            console.error("Error fetching search results:", error);
                                        } finally {
                                            setIsLoading(false);
                                        }
                                    }}
                                    className="w-full h-14 px-6 pr-12 border-2 border-accent rounded-xl text-base bg-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition shadow-sm"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-muted">
                                    🔍
                                </div>
                            </div>
                        </div>

                        {/* Search Stats */}
                        {query.length > 0 && !isLoading && (
                            <p className="text-sm text-muted">
                                {products.length > 0 
                                    ? `Found ${products.length} product${products.length !== 1 ? 's' : ''} matching "${query}"`
                                    : `No products found for "${query}"`
                                }
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Search Results */}
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
                {isLoading ? (
                    <Loading fullScreen={false} message="Searching products..." />
                ) : query.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-6">
                        <div className="text-7xl">🔎</div>
                        <h3 className="text-2xl font-bold text-secondary">Start Your Search</h3>
                        <p className="text-muted text-center max-w-md">
                            Enter a product name, brand, or category in the search box above to find what you're looking for
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center pt-4">
                            <button 
                                onClick={() => setQuery("lipstick")}
                                className="px-4 py-2 bg-secondary/10 text-secondary rounded-full hover:bg-secondary hover:text-neutral transition"
                            >
                                💄 Lipstick
                            </button>
                            <button 
                                onClick={() => setQuery("skincare")}
                                className="px-4 py-2 bg-secondary/10 text-secondary rounded-full hover:bg-secondary hover:text-neutral transition"
                            >
                                ✨ Skincare
                            </button>
                            <button 
                                onClick={() => setQuery("perfume")}
                                className="px-4 py-2 bg-secondary/10 text-secondary rounded-full hover:bg-secondary hover:text-neutral transition"
                            >
                                🌸 Perfume
                            </button>
                        </div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-6">
                        <div className="text-7xl">😔</div>
                        <h3 className="text-2xl font-bold text-secondary">No Results Found</h3>
                        <p className="text-muted text-center max-w-md">
                            We couldn't find any products matching "<span className="font-semibold text-secondary">{query}</span>". 
                            Try different keywords or browse our collection.
                        </p>
                        <button 
                            onClick={() => setQuery("")}
                            className="px-6 py-3 bg-secondary text-neutral rounded-xl font-semibold hover:bg-muted transition"
                        >
                            Clear Search
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.productId} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
