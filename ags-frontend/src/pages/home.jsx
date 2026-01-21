import { Routes, Route } from "react-router-dom";
import Header from "../components/header.jsx";
import ProductPage from "./client/productPage.jsx";
import SearchProductPage from "./client/searchProduct.jsx";
import ProductOverviewPage from "./client/productOverview.jsx";
import CartPage from "./client/cartPage.jsx";
import CheckOutPage from "./client/checkOut.jsx";
import LandingPage from "./client/landingPage.jsx";
import AboutPage from "./client/aboutPage.jsx";
import ContactPage from "./client/contactPage.jsx";


export default function HomePage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center">
        <Header/>
        <div className="w-full flex flex-col items-center">
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/products" element={<ProductPage />} />
                <Route path="/search" element={<SearchProductPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/overview/:id" element={<ProductOverviewPage />} />
                <Route path="/checkout" element={<CheckOutPage/>} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="*" element={<h1 className="text-secondary text-3xl font-bold mt-10">404 not found</h1>} />
            </Routes>
        </div>
    </div>
  );
}
