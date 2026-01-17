import { Routes, Route } from "react-router-dom";
import Header from "../components/header.jsx";
import ProductPage from "./client/productPage.jsx";
import ProductOverviewPage from "./client/productOverview.jsx";
import CartPage from "./client/cartPage.jsx";
import CheckOutPage from "./client/CheckOut.jsx";


export default function HomePage() {
  return (
    <div className="w-full h-screen flex flex-col items-center">
        <Header/>
        <div className="w-full h-[calc(100vh-80px)] flex flex-col items-center">
            <Routes>
                <Route path="/" element={<h1>Home </h1>} />
                <Route path="/products" element={<ProductPage />} />
                <Route path="/about" element={<h1>About </h1>} />
                <Route path="/contact" element={<h1>Contact </h1>} />
                <Route path="/overview/:id" element={<ProductOverviewPage />} />
                <Route path="/checkout" element={<CheckOutPage/>} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="*" element={<h1>404 not found</h1>} />
            </Routes>
        </div>
    </div>
  );
}
