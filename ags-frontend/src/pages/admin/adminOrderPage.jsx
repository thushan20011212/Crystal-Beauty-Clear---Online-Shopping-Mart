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
      const token = sessionStorage.getItem("token");
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
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-secondary">
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
            className="bg-white max-w-4xl mx-auto mt-10 rounded-2xl outline-none shadow-2xl overflow-hidden w-[calc(100%-2rem)] md:w-auto h-[90vh] md:h-auto max-h-[90vh]"
            overlayClassName="fixed inset-0 bg-black/60 flex justify-center items-start py-5 md:py-10 px-4 md:px-0"
          >
            {activeOrder && (
              <div className="max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-secondary p-4 md:p-6 flex justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-xl md:text-3xl font-bold text-white">Order Details</h2>
                    <p className="text-accent text-xs md:text-sm mt-1">Order ID: {activeOrder.orderId}</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-white hover:bg-white/20 rounded-full p-2 transition text-xl md:text-2xl w-10 h-10 flex items-center justify-center shrink-0"
                  >
                    ✕
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 md:p-8 space-y-4 md:space-y-6">
                  
                  {/* Status Badge */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-black/10 gap-3 md:gap-0">
                    <span className="text-secondary font-semibold text-sm md:text-base">Status:</span>
                    <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
                      <span
                        className={`px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold
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
                            const token = sessionStorage.getItem("token");
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
                        className="text-xs md:text-sm px-3 py-1 md:py-2 bg-white border border-accent rounded-lg text-secondary cursor-pointer hover:bg-primary transition"
                      >
                        <option value="">Change Status</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="canceled">Canceled</option>
                        <option value="returned">Returned</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer Info Grid */}
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-secondary mb-3 md:mb-4">Customer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 bg-primary p-4 md:p-6 rounded-xl border border-accent/20">
                      <div>
                        <label className="text-secondary/70 text-xs md:text-sm font-semibold">Name</label>
                        <p className="text-base md:text-lg font-semibold text-secondary mt-1">{activeOrder.name}</p>
                      </div>
                      <div>
                        <label className="text-secondary/70 text-xs md:text-sm font-semibold">Email</label>
                        <p className="text-base md:text-lg font-semibold text-secondary mt-1 break-all">{activeOrder.email}</p>
                      </div>
                      <div>
                        <label className="text-secondary/70 text-xs md:text-sm font-semibold">Phone</label>
                        <p className="text-base md:text-lg font-semibold text-secondary mt-1">{activeOrder.phone}</p>
                      </div>
                      <div>
                        <label className="text-secondary/70 text-xs md:text-sm font-semibold">Order Date</label>
                        <p className="text-base md:text-lg font-semibold text-secondary mt-1">
                          {new Date(activeOrder.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-secondary mb-2 md:mb-3">Delivery Address</h3>
                    <div className="bg-primary border-2 border-accent p-4 md:p-6 rounded-xl">
                      <p className="text-secondary leading-relaxed text-sm md:text-base">{activeOrder.address}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-secondary mb-3 md:mb-4">Order Items</h3>
                    <div className="border border-accent/30 rounded-xl overflow-x-auto">
                      <table className="w-full text-xs md:text-base">
                        <thead className="bg-secondary text-white">
                          <tr>
                            <th className="p-2 md:p-4 text-left">Product</th>
                            <th className="p-2 md:p-4 text-center">Qty</th>
                            <th className="p-2 md:p-4 text-right">Price</th>
                            <th className="p-2 md:p-4 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeOrder.products && activeOrder.products.map((item, i) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-primary" : "bg-white"}>
                              <td className="p-2 md:p-4 font-semibold text-secondary">{item.name}</td>
                              <td className="p-2 md:p-4 text-center text-secondary font-semibold">{item.quantity}</td>
                              <td className="p-2 md:p-4 text-right text-secondary">₨{(Number(item.price) || 0).toFixed(2)}</td>
                              <td className="p-2 md:p-4 text-right font-bold text-accent">
                                ₨{(Number(item.price) * item.quantity || 0).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="bg-secondary text-white p-4 md:p-6 rounded-xl">
                    <div className="space-y-2 md:space-y-3 text-sm md:text-base">
                      <div className="flex justify-between items-center">
                        <span>Subtotal:</span>
                        <span>₨{(Number(activeOrder.labelledTotal) || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 md:pb-3 border-b border-white/30">
                        <span>Discount:</span>
                        <span>₨{(Number(activeOrder.labelledTotal) - Number(activeOrder.total) || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg md:text-2xl font-bold">
                        <span>Final Total:</span>
                        <span className="text-accent">₨{(Number(activeOrder.total) || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-4 md:pt-6 border-t border-accent/30">
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-black/80 hover:bg-black text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg transition duration-300 text-sm md:text-base"
                    >
                      Close
                    </button>
                    <button
                      className="flex-1 bg-accent hover:bg-accent/80 text-secondary font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg transition duration-300 text-sm md:text-base"
                    >
                      Print Invoice
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Modal>

          {/* ORDERS TABLE */}
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-xs md:text-base">
            <thead className="bg-accent text-secondary">
              <tr>
                <th className="p-2 md:p-3">#</th>
                <th className="p-2 md:p-3 text-left">Order ID</th>
                <th className="p-2 md:p-3 text-left hidden md:table-cell">Name</th>
                <th className="p-2 md:p-3 text-left hidden lg:table-cell">Email</th>
                <th className="p-2 md:p-3 text-left hidden lg:table-cell">Address</th>
                <th className="p-2 md:p-3 text-left hidden md:table-cell">Phone</th>
                <th className="p-2 md:p-3">Total</th>
                <th className="p-2 md:p-3 text-left hidden md:table-cell">Date</th>
                <th className="p-2 md:p-3">Status</th>
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
                  <td className="p-2 md:p-3 font-semibold">{index + 1}</td>
                  <td className="p-2 md:p-3 font-medium text-xs md:text-sm">{order.orderId}</td>
                  <td className="p-2 md:p-3 hidden md:table-cell text-sm">{order.name}</td>
                  <td className="p-2 md:p-3 hidden lg:table-cell text-sm">{order.email}</td>
                  <td className="p-2 md:p-3 hidden lg:table-cell text-sm truncate">{order.address}</td>
                  <td className="p-2 md:p-3 hidden md:table-cell text-sm">{order.phone}</td>
                  <td className="p-2 md:p-3 font-semibold text-sm md:text-base">
                    ₨{(Number(order.total) || 0).toFixed(2)}
                  </td>
                  <td className="p-2 md:p-3 hidden md:table-cell text-xs md:text-sm">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 md:p-3">
                    <span
                      className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold
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
