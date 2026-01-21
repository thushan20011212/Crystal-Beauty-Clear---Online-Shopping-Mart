import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiXCircle } from "react-icons/fi";
import Loading from "../../components/loading";

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const token = sessionStorage.getItem("token");
        if (!token) {
            toast.error("Please login to view your orders");
            navigate("/logIn");
            return;
        }

        // Fetch user's orders
        fetchOrders(token);
    }, []);

    async function fetchOrders(token) {
        try {
            const response = await axios.get(
                import.meta.env.VITE_BACKEND_URL + "/api/orders",
                {
                    headers: { Authorization: "Bearer " + token },
                }
            );
            setOrders(response.data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again");
                navigate("/logIn");
            } else {
                toast.error("Failed to fetch orders");
            }
        } finally {
            setLoading(false);
        }
    }

    // Get status icon and color
    function getStatusDisplay(status) {
        switch (status.toLowerCase()) {
            case "pending":
                return {
                    icon: <FiClock className="text-2xl" />,
                    color: "text-yellow-600",
                    bg: "bg-yellow-100",
                    label: "Pending"
                };
            case "processing":
                return {
                    icon: <FiPackage className="text-2xl" />,
                    color: "text-blue-600",
                    bg: "bg-blue-100",
                    label: "Processing"
                };
            case "shipped":
            case "delivering":
                return {
                    icon: <FiTruck className="text-2xl" />,
                    color: "text-purple-600",
                    bg: "bg-purple-100",
                    label: "Shipped"
                };
            case "delivered":
            case "completed":
                return {
                    icon: <FiCheckCircle className="text-2xl" />,
                    color: "text-green-600",
                    bg: "bg-green-100",
                    label: "Delivered"
                };
            case "cancelled":
                return {
                    icon: <FiXCircle className="text-2xl" />,
                    color: "text-red-600",
                    bg: "bg-red-100",
                    label: "Cancelled"
                };
            default:
                return {
                    icon: <FiPackage className="text-2xl" />,
                    color: "text-gray-600",
                    bg: "bg-gray-100",
                    label: status
                };
        }
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="w-full min-h-screen bg-primary pt-20 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-2">
                        My Orders
                    </h1>
                    <p className="text-lg text-muted">
                        Track and manage your orders
                    </p>
                </div>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-neutral rounded-xl shadow-sm">
                        <FiPackage className="text-6xl text-accent mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-secondary mb-2">
                            No Orders Yet
                        </h2>
                        <p className="text-muted mb-6">
                            Start shopping to create your first order!
                        </p>
                        <button
                            onClick={() => navigate("/products")}
                            className="px-8 py-3 bg-secondary text-neutral rounded-lg hover:bg-muted transition-all font-semibold shadow-md"
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const statusDisplay = getStatusDisplay(order.status);
                            return (
                                <div
                                    key={order._id}
                                    className="bg-neutral rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border-l-4 border-secondary"
                                >
                                    {/* Order Header */}
                                    <div className="p-6 border-b border-accent/20">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-secondary mb-2">
                                                    Order #{order.orderId}
                                                </h3>
                                                <p className="text-sm text-muted">
                                                    Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            
                                            {/* Status Badge */}
                                            <div className={`flex items-center gap-3 px-6 py-3 rounded-lg ${statusDisplay.bg}`}>
                                                <span className={statusDisplay.color}>
                                                    {statusDisplay.icon}
                                                </span>
                                                <span className={`font-bold text-lg ${statusDisplay.color}`}>
                                                    {statusDisplay.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="p-6">
                                        <h4 className="font-semibold text-secondary mb-4 text-lg">
                                            Order Items
                                        </h4>
                                        <div className="space-y-3">
                                            {order.orderItems && order.orderItems.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-4 p-4 bg-primary rounded-lg hover:bg-accent/10 transition-colors"
                                                >
                                                    <img
                                                        src={item.image || "/placeholder.svg"}
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-secondary">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-sm text-muted">
                                                            Quantity: {item.qty}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-secondary text-lg">
                                                            Rs. {(item.price * item.qty).toFixed(2)}
                                                        </p>
                                                        <p className="text-sm text-muted">
                                                            Rs. {item.price} each
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Order Footer */}
                                    <div className="px-6 py-4 bg-accent/5 border-t border-accent/20">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="space-y-1">
                                                <p className="text-sm text-muted">
                                                    <span className="font-semibold">Delivery Address:</span> {order.address}
                                                </p>
                                                <p className="text-sm text-muted">
                                                    <span className="font-semibold">Phone:</span> {order.phone}
                                                </p>
                                                {order.notes && (
                                                    <p className="text-sm text-muted">
                                                        <span className="font-semibold">Notes:</span> {order.notes}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-muted mb-1">Total Amount</p>
                                                <p className="text-3xl font-bold text-secondary">
                                                    Rs. {order.total?.toFixed(2) || "0.00"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
