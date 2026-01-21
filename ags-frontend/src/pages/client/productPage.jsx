import axios from "axios";
import { useState, useEffect } from "react";
import ProductCard from "../../components/productCard";
import Loading from "../../components/loading";

export default function ProductPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isLoading) {
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products")
                .then((res) => {
                    setProducts(res.data);
                    setIsLoading(false);
                })
                .catch(() => {
                    setIsLoading(false);
                });
        }
    }, [isLoading]);

    if (isLoading) {
        return <Loading fullScreen={false} message="Loading our premium collection..." />;
    }

    return (
        <div className="w-full min-h-screen bg-primary">

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[50vh] space-y-6">
                        <div className="text-6xl">📦</div>
                        <h3 className="text-2xl font-bold text-secondary">No Products Available</h3>
                        <p className="text-muted">Check back soon for new arrivals!</p>
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
