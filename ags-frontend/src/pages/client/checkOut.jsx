import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiMinus, BiPlus, BiTrash } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";

export default function CheckOutPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // Early return for no cart state
    if (!location.state || !location.state.cart) {
        return (
            <div className="w-full h-full flex flex-col justify-center items-center bg-primary">
                <h1 className="text-2xl font-bold text-secondary mb-4">No items in checkout</h1>
                <button 
                    onClick={() => navigate("/products")}
                    className="px-6 py-2 bg-secondary text-neutral rounded-lg hover:bg-muted transition"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    const [cart, setCart] = useState(location.state?.cart || []);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");

    function getTotal() {
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.qty;
        });
        return total;
    }

    function removeFromCart(index) {
        const newCart = cart.filter((item, i) => i !== index);
        setCart(newCart);
        toast.success("Item removed from checkout");
    }

    function changeQty(index, change) {
        const newCart = [...cart];
        const newQty = newCart[index].qty + change;

        if (newQty <= 0) {
            removeFromCart(index);
            return;
        }

        newCart[index].qty = newQty;
        setCart(newCart);
    }

    async function placeOrder() {
        const token = localStorage.getItem("token");
        
        if (!token) {
            toast.error("You need to be logged in to place an order.");
            return;
        }

        if (!phoneNumber || !address) {
            toast.error("Please fill in all fields");
            return;
        }

        if (cart.length === 0) {
            toast.error("Cart is empty");
            return;
        }

        const orderInformation = {
            products: cart.map(item => ({
                productId: item.productId,
                qty: item.qty
            })),
            phone: phoneNumber,
            address: address
        };

        try {
            const res = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/orders", orderInformation, {
                headers: { Authorization: "Bearer " + token }
            });

            if (res.status === 201 || res.status === 200) {
                toast.success("Order placed successfully!");
                localStorage.removeItem("cart");
                navigate("/");
            }
        } catch (err) {
            console.error("Order creation error:", err);
            toast.error(err.response?.data?.message || "Failed to place order.");
            return;
        }
    }

    return (
        <div className="w-full min-h-screen flex flex-col items-center px-4 pt-4 pb-28 md:pb-4 relative bg-primary">
            {/* Desktop Summary Card */}
            <div className="z-50 hidden w-full md:w-[600px] md:max-w-[600px] mb-6 p-6 bg-neutral rounded-lg shadow-lg md:flex flex-col">
                <h2 className="text-xl md:text-2xl font-bold text-secondary mb-4">Order Summary</h2>
                <p className="text-lg md:text-xl text-secondary font-bold mb-4">
                    Total: <span className="text-secondary">₨{getTotal().toFixed(2)}</span>
                </p>
                
                <div className="space-y-3 mb-4">
                    <input 
                        type="text" 
                        placeholder="Phone Number" 
                        className="w-full p-3 rounded-lg border-2 border-accent focus:border-secondary focus:outline-none text-sm md:text-base"
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        placeholder="Address" 
                        className="w-full p-3 rounded-lg border-2 border-accent focus:border-secondary focus:outline-none text-sm md:text-base"
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                    />
                </div>
                
                <button 
                    onClick={placeOrder}
                    className="w-full text-neutral bg-secondary px-4 py-3 rounded-lg hover:bg-muted transition-all duration-300 font-semibold text-sm md:text-base"
                >
                    Place Order
                </button>
            </div>

            {/* Cart Items */}
            <div className="w-full md:max-w-[600px] space-y-4">
                {cart.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted text-lg">No items in checkout</p>
                    </div>
                ) : (
                    cart.map((item, index) => {
                        return (
                            <div key={item.productId + index} className="w-full h-auto md:h-24 rounded-xl bg-neutral shadow-md flex flex-col md:flex-row items-center justify-between p-4 relative gap-3 md:gap-0">
                                <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-20 md:w-24 h-20 md:h-24 object-cover rounded-lg"/>
                                
                                <div className="flex-1 flex flex-col justify-center items-center md:items-start pl-0 md:pl-4">
                                    <h1 className="text-base md:text-lg text-secondary font-semibold text-center md:text-left">{item.name}</h1>
                                    <h1 className="text-xs md:text-sm text-muted">{item.productId}</h1>
                                    {
                                        item.labelledPrice > item.price ?
                                        <div className="flex gap-2 flex-col md:flex-row justify-center md:justify-start text-xs md:text-sm">
                                            <span className="text-muted line-through">₨{item.labelledPrice.toFixed(2)}</span>
                                            <span className="font-bold text-secondary">₨{item.price.toFixed(2)}</span>
                                        </div>
                                        : <span className="text-xs md:text-sm font-bold text-secondary">₨{item.price.toFixed(2)}</span>
                                    }
                                </div>
                                
                                <div className="flex flex-row gap-2 items-center">
                                    <button 
                                        className="text-neutral font-bold rounded-lg p-1 bg-secondary hover:bg-muted transition text-sm md:text-base"
                                        onClick={() => changeQty(index, -1)}
                                    >
                                        <BiMinus/>
                                    </button>
                                    <span className="text-base md:text-lg font-semibold text-secondary w-8 text-center">{item.qty}</span>
                                    <button 
                                        className="text-neutral font-bold rounded-lg p-1 bg-secondary hover:bg-muted transition text-sm md:text-base"
                                        onClick={() => changeQty(index, 1)}
                                    >
                                        <BiPlus/>
                                    </button>
                                </div>
                                
                                <div className="w-full md:w-24 text-center md:text-right">
                                    <p className="text-base md:text-lg font-semibold text-secondary">₨{(item.price * item.qty).toFixed(2)}</p>
                                </div>
                                
                                <button 
                                    className="text-secondary hover:bg-accent hover:text-secondary p-2 rounded-full transition text-sm md:text-base"
                                    onClick={() => removeFromCart(index)}
                                >
                                    <BiTrash/>
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Mobile Summary Card */}
            <div className="z-40 fixed bottom-0 left-0 w-full md:hidden bg-neutral shadow-2xl flex flex-col items-start justify-start p-4 border-t border-accent">
                <h2 className="text-lg font-bold text-secondary mb-2">Order Summary</h2>
                <p className="text-base text-secondary font-bold mb-3">
                    Total: <span className="text-secondary">₨{getTotal().toFixed(2)}</span>
                </p>
                
                <div className="space-y-2 mb-3 w-full">
                    <input 
                        type="text" 
                        placeholder="Phone Number" 
                        className="w-full p-2 rounded-lg border-2 border-accent focus:border-secondary focus:outline-none text-sm"
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        placeholder="Address" 
                        className="w-full p-2 rounded-lg border-2 border-accent focus:border-secondary focus:outline-none text-sm"
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                    />
                </div>
                
                <button 
                    onClick={placeOrder}
                    className="w-full text-neutral bg-secondary px-4 py-2 rounded-lg hover:bg-muted transition-all duration-300 font-semibold text-sm"
                >
                    Place Order
                </button>
            </div>
        </div>
    );
}
