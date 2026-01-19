import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Modal from "react-modal";
import Loading from "../../components/loading.jsx";

Modal.setAppElement("#root");

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  // Fetch orders from backend
  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        setIsLoading(false);
        return;
      }

      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/api/orders",
        {
          headers: { Authorization: "Bearer " + token }
        }
      );

      setOrders(response.data || []);
      if (response.data.length === 0) {
        toast.success("No orders yet");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(error.response?.data?.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }

  function openOrderModal(order) {
    setActiveOrder(order);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setActiveOrder(null);
  }

  return (
    <div className="w-full h-full p-6 overflow-y-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary">
          Order Management
        </h1>
      </div>

      {/* Loading */}
      {isLoading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto">

          {/* ORDER DETAILS MODAL */}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            className="bg-white max-w-4xl mx-auto mt-10 rounded-2xl outline-none shadow-2xl overflow-hidden"
            overlayClassName="fixed inset-0 bg-black/60 flex justify-center items-start py-10"
          >
            {activeOrder && (
              <div className="max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-secondary p-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-white">Order Details</h2>
                    <p className="text-accent text-sm mt-1">Order ID: {activeOrder.orderId}</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-white hover:bg-white/20 rounded-full p-2 transition text-2xl w-10 h-10 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                  
                  {/* Status Badge */}
                  <div className="flex items-center justify-between pb-4 border-b border-black/10">
                    <span className="text-secondary font-semibold">Status:</span>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold
                        ${
                          activeOrder.status === "pending"
                            ? "bg-accent text-secondary"
                            : activeOrder.status === "completed"
                            ? "bg-primary text-secondary"
                            : "bg-black text-white"
                        }`}
                    >
                      {activeOrder.status?.toUpperCase()}
                    </span>
                    <select
                      defaultValue=""
                      onChange={async (e) => {
                        const updatedValue = e.target.value;
                        try{
                          const token = localStorage.getItem("token");
                          await axios.put(
                            import.meta.env.VITE_BACKEND_URL + 
                            "/api/orders/" +
                            activeOrder.orderId +
                            "/" +
                            updatedValue,
                          {},
                          {
                              headers: {
                                Authorization: `Bearer ${token}`
                              }
                          }
                          )

                          toast.success("Order status updated successfully");
                          const updatedOrder = {...activeOrder}
                          updatedOrder.status = updatedValue;
                          setActiveOrder(updatedOrder);
                          
                          // Refresh orders list
                          await fetchOrders();

                        } catch (e) {
                          console.error("Error updating order status:", e);
                          toast.error("Failed to update order status");
                        }
                      }}
                    >
                    <option value="">Change Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                    <option value="returned">Returned</option>
                    </select>
                  </div>

                  {/* Customer Info Grid */}
                  <div>
                    <h3 className="text-lg font-bold text-secondary mb-4">Customer Information</h3>
                    <div className="grid grid-cols-2 gap-6 bg-primary p-6 rounded-xl border border-accent/20">
                      <div>
                        <label className="text-secondary/70 text-sm font-semibold">Name</label>
                        <p className="text-lg font-semibold text-secondary mt-1">{activeOrder.name}</p>
                      </div>
                      <div>
                        <label className="text-secondary/70 text-sm font-semibold">Email</label>
                        <p className="text-lg font-semibold text-secondary mt-1">{activeOrder.email}</p>
                      </div>
                      <div>
                        <label className="text-secondary/70 text-sm font-semibold">Phone</label>
                        <p className="text-lg font-semibold text-secondary mt-1">{activeOrder.phone}</p>
                      </div>
                      <div>
                        <label className="text-secondary/70 text-sm font-semibold">Order Date</label>
                        <p className="text-lg font-semibold text-secondary mt-1">
                          {new Date(activeOrder.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <h3 className="text-lg font-bold text-secondary mb-3">Delivery Address</h3>
                    <div className="bg-primary border-2 border-accent p-6 rounded-xl">
                      <p className="text-secondary leading-relaxed">{activeOrder.address}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="text-lg font-bold text-secondary mb-4">Order Items</h3>
                    <div className="border border-accent/30 rounded-xl overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-secondary text-white">
                          <tr>
                            <th className="p-4 text-left">Product</th>
                            <th className="p-4 text-center">Quantity</th>
                            <th className="p-4 text-right">Unit Price</th>
                            <th className="p-4 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeOrder.products && activeOrder.products.map((item, i) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-primary" : "bg-white"}>
                              <td className="p-4 font-semibold text-secondary">{item.name}</td>
                              <td className="p-4 text-center text-secondary font-semibold">{item.quantity}</td>
                              <td className="p-4 text-right text-secondary">₨{(Number(item.price) || 0).toFixed(2)}</td>
                              <td className="p-4 text-right font-bold text-accent">
                                ₨{(Number(item.price) * item.quantity || 0).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="bg-secondary text-white p-6 rounded-xl">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg">Subtotal:</span>
                        <span className="text-lg">₨{(Number(activeOrder.labelledTotal) || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-white/30">
                        <span className="text-lg">Discount:</span>
                        <span className="text-lg">₨{(Number(activeOrder.labelledTotal) - Number(activeOrder.total) || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-2xl font-bold">
                        <span>Final Total:</span>
                        <span className="text-accent">₨{(Number(activeOrder.total) || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6 border-t border-accent/30">
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-black/80 hover:bg-black text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                    >
                      Close
                    </button>
                    <button
                      className="flex-1 bg-accent hover:bg-accent/80 text-secondary font-bold py-3 px-6 rounded-lg transition duration-300"
                    >
                      Print Invoice
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Modal>

          {/* ORDERS TABLE */}
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-accent text-secondary">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Order ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Address</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Total (Rs)</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order.orderId || index}
                  onClick={() => openOrderModal(order)}
                  className={`cursor-pointer ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } border-t hover:bg-gray-200 transition`}
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-medium">{order.orderId}</td>
                  <td className="p-3">{order.name}</td>
                  <td className="p-3">{order.email}</td>
                  <td className="p-3">{order.address}</td>
                  <td className="p-3">{order.phone}</td>
                  <td className="p-3 font-semibold">
                    {order.total?.toFixed(2)}
                  </td>
                  <td className="p-3">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold
                        ${
                          order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}
    </div>
  );
}
