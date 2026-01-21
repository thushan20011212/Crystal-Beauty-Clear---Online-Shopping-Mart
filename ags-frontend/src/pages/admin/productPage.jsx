import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/products")
        .then((res) => {
          setProducts(res.data);
          setIsLoading(false);
        })
        .catch(() => {
          toast.error("Failed to load products");
          setIsLoading(false);
        });
    }
  }, [isLoading]);

  function deleteProduct(productId) {
    if (!productId || productId.toString().length === 0) {
      toast.error("Product ID is invalid");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this product?")) return;

    const deleteUrl = import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId;

    axios
      .delete(deleteUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then(() => {
        toast.success("Product deleted successfully");
        setIsLoading(true);
      })
      .catch((e) => {
        toast.error(e.response?.data?.message || "Delete failed");
      });
  }

  return (
    <div className="w-full min-h-screen bg-primary p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-neutral rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-secondary mb-2">
                Product Management
              </h1>
              <p className="text-muted">
                Manage your product catalog
              </p>
            </div>

            <Link
              to="/admin/addProductPage"
              className="w-full md:w-auto bg-secondary text-neutral hover:bg-muted hover:scale-105 transition-all duration-300 px-6 py-3 rounded-xl font-bold shadow-lg text-center"
            >
              + Add New Product
            </Link>
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="bg-neutral rounded-2xl shadow-lg p-12">
            <div className="w-full flex flex-col justify-center items-center gap-4">
              <div className="w-16 h-16 border-4 border-accent border-t-secondary rounded-full animate-spin"></div>
              <p className="text-muted">Loading products...</p>
            </div>
          </div>
        ) : (
          <div className="bg-neutral rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary text-neutral">
                  <tr>
                    <th className="p-4 text-left font-bold">#</th>
                    <th className="p-4 text-left font-bold">Product ID</th>
                    <th className="p-4 text-left font-bold">Name</th>
                    <th className="p-4 text-center font-bold">Image</th>
                    <th className="p-4 text-right font-bold">L. Price</th>
                    <th className="p-4 text-right font-bold">Price</th>
                    <th className="p-4 text-center font-bold">Stock</th>
                    <th className="p-4 text-center font-bold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <span className="text-6xl">📦</span>
                          <p className="text-xl text-muted">No products found</p>
                          <Link
                            to="/admin/addProductPage"
                            className="bg-secondary text-neutral px-6 py-2 rounded-xl font-bold hover:bg-muted transition"
                          >
                            Add Your First Product
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    products.map((item, index) => (
                      <tr
                        key={item._id || item.productId || item.id || index}
                        className="border-t border-accent/20 hover:bg-primary/50 transition"
                      >
                        <td className="p-4 text-secondary font-semibold">{index + 1}</td>
                        <td className="p-4 text-muted text-sm">{item.productId}</td>
                        <td className="p-4 font-medium text-secondary">{item.name}</td>

                        <td className="p-4">
                          <div className="flex justify-center">
                            <img
                              src={item.image?.[0] || "/placeholder.svg"}
                              alt={item.name}
                              className="w-14 h-14 object-cover rounded-lg shadow-md"
                              onError={(e) => {
                                e.target.src = "/placeholder.svg";
                              }}
                            />
                          </div>
                        </td>

                        <td className="p-4 text-right text-muted line-through">Rs. {item.labelledPrice}</td>
                        <td className="p-4 text-right font-bold text-secondary">Rs. {item.price}</td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            item.stock > 10 ? 'bg-green-100 text-green-700' : 
                            item.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-red-100 text-red-700'
                          }`}>
                            {item.stock}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/editProductPage/${item.productId || item._id}`,
                                  { state: item }
                                )
                              }
                              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:scale-110 transition"
                              title="Edit Product"
                            >
                              <FaEdit className="text-lg" />
                            </button>
                            <button
                              onClick={() => deleteProduct(item.productId || item._id)}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:scale-110 transition"
                              title="Delete Product"
                            >
                              <FaTrash className="text-lg" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
