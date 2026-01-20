import axios from 'axios';
import { useState } from 'react';
import ProductCard from '../../components/productCard';

export default function SearchProductPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState("");

    return (
        <div className="w-full h-full p-6 bg-gray-60">
            <input
                type="text"
                placeholder="Search for products..."
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
                className="w-full h-[50px] px-4 border border-gray-300 rounded-md"
            />
            <div className="flex flex-wrap justify-center gap-6">
                {query.length == 0?(
                    <h2 className="text-gray-500">Please enter a search query</h2>
                ):(
                    products.map((product) => {
                        return (
                            <ProductCard key={product.productId} product={product} />
                        );
                    })
                )}
            </div>
        </div>
    );
}
