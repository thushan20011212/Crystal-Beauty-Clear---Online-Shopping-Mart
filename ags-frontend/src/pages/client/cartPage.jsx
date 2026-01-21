import { useState } from "react";
import { BiMinus, BiPlus, BiTrash } from "react-icons/bi";
import { BsCart3 } from "react-icons/bs";
import { addToCart, getCart, getTotal, removeFromCart } from "../../utils/cart.js";
import { Link } from "react-router-dom";

export default function CartPage() {
    const [cart, setCart] = useState(getCart());

    return (
        <div className="w-full min-h-screen flex flex-col items-center bg-primary">
            {/* Header Section with Cart Summary */}
            <div className="w-full bg-neutral shadow-md border-b-2 border-accent sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Page Title */}
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl md:text-3xl font-bold text-secondary">Shopping Cart</h1>
                            <span className="bg-secondary text-neutral px-3 py-1 rounded-full text-sm font-semibold">
                                {cart.length} {cart.length === 1 ? 'item' : 'items'}
                            </span>
                        </div>

                        {/* Checkout Summary */}
                        <div className="flex items-center gap-4 bg-primary px-6 py-3 rounded-lg shadow-sm">
                            <div className="text-right">
                                <p className="text-sm text-muted font-medium">Total Amount</p>
                                <p className="text-2xl md:text-3xl text-secondary font-bold">
                                    ₨{getTotal().toFixed(2)}
                                </p>
                            </div>
                            <Link 
                                to="/checkout" 
                                state={{ cart: cart }}
                                className="text-neutral bg-secondary px-6 py-3 rounded-lg hover:bg-muted transition-all duration-300 text-base font-semibold shadow-md whitespace-nowrap"
                            >
                                Proceed to Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cart Items Section */}
            <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-4">
            {
                cart.map(
                    (item) => {
                        return (
                            <div key={item.productId} className="w-full md:max-w-4xl h-auto rounded-xl bg-neutral shadow-md hover:shadow-lg transition-shadow flex flex-col md:flex-row items-center gap-4 p-4 mx-auto relative">
                                {/* Product Image */}
                                <img src={item.image} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" alt={item.name}/>
                                
                                {/* Product Details */}
                                <div className="flex-1 flex flex-col justify-center items-center md:items-start min-w-0">
                                    <h1 className="text-base md:text-lg text-secondary font-semibold text-center md:text-left truncate w-full">{item.name}</h1>
                                    <h1 className="text-xs md:text-sm text-muted font-medium">{item.productId}</h1>
                                    {
                                        item.labelledPrice > item.price ?
                                        <div className="flex gap-2 items-center mt-1">
                                            <span className="text-sm text-muted line-through">₨{item.labelledPrice.toFixed(2)}</span>
                                            <span className="text-sm md:text-base font-bold text-secondary">₨{item.price.toFixed(2)}</span>
                                        </div>
                                        : <span className="text-sm md:text-base font-bold text-secondary mt-1">₨{item.price.toFixed(2)}</span>
                                    }
                                </div>
                                
                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <button 
                                        className="text-neutral font-bold rounded-lg hover:bg-muted p-2 text-lg cursor-pointer bg-secondary transition-colors"
                                        onClick={() => {
                                            addToCart(item, -1)
                                            setCart(getCart())
                                        }}
                                        aria-label="Decrease quantity"
                                    >
                                        <BiMinus/>
                                    </button>
                                    <span className="text-base md:text-lg text-secondary font-semibold min-w-[2rem] text-center">{item.qty}</span>
                                    <button 
                                        className="text-neutral font-bold rounded-lg hover:bg-muted p-2 text-lg cursor-pointer bg-secondary transition-colors"
                                        onClick={() => {
                                            addToCart(item, 1)
                                            setCart(getCart())
                                        }}
                                        aria-label="Increase quantity"
                                    >
                                        <BiPlus/>
                                    </button>
                                </div>
                                
                                {/* Item Total */}
                                <div className="flex items-center gap-4 flex-shrink-0">
                                    <h1 className="text-lg md:text-xl text-secondary font-bold min-w-[6rem] text-center md:text-right">
                                        ₨{(item.price * item.qty).toFixed(2)}
                                    </h1>
                                    
                                    {/* Delete Button */}
                                    <button 
                                        className="text-secondary hover:text-neutral hover:bg-secondary p-2.5 rounded-lg transition-all duration-200 border border-accent hover:border-secondary"
                                        onClick={() => {
                                            removeFromCart(item.productId)
                                            setCart(getCart())
                                        }}
                                        aria-label="Remove item"
                                    >
                                        <BiTrash className="text-xl"/>
                                    </button>
                                </div>
                            </div>
                        );
                    }
                )
            }
            </div>

            {/* Empty Cart Message */}
            {cart.length === 0 && (
                <div className="w-full max-w-7xl mx-auto px-4 py-20 text-center">
                    <div className="bg-neutral rounded-xl shadow-md p-12">
                        <BsCart3 className="text-6xl text-muted mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-secondary mb-2">Your cart is empty</h2>
                        <p className="text-muted mb-6">Add some products to get started!</p>
                        <Link 
                            to="/products" 
                            className="inline-block text-neutral bg-secondary px-6 py-3 rounded-lg hover:bg-muted transition-all duration-300 font-semibold"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
