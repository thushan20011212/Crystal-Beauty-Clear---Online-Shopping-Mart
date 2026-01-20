import { Link } from "react-router-dom";
import { Route, Routes , useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import AdminProductPage from "./admin/productPage";
import AddProductPage from "./admin/addProductPage";
import EditProductPage from "./admin/editProductPage";
import AdminOrderPage from "./admin/adminOrderPage";
import AdminReviewPage from "./admin/adminReviewPage";
import toast from "react-hot-toast";
import Loading from "../components/loading";


export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname;
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("unauthenticated");
      window.location.href = "/login";
    }else{
      axios.get(import.meta.env.VITE_BACKEND_URL + "/api/user/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        if (response.data.role !== "admin") {
          setStatus("unauthorized");
          toast.error("You are not authorized to access this page.");
          window.location.href = "/";
        } else {
          setStatus("authenticated");
        }
      }).catch((error) => {
        console.error("Error fetching user data:", error);
        setStatus("unauthenticated");
        toast.error("You are not authorized to access this page.");
        window.location.href = "/login";
      });
    }
  }, []);

  function getClass(name){
    if(path.includes(name)){
      return "bg-accent text-white p-4"
    }
    return "text-accent p-4"
  }

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-accent">
        {status == "loading" || status == "unauthenticated" ?
        <Loading />:
        <>
        {/* Mobile Header */}
        <div className="md:hidden w-full h-16 bg-white flex items-center justify-between px-4 border-b border-accent">
          <GiHamburgerMenu 
            className="text-2xl text-accent cursor-pointer" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
          <h1 className="text-lg font-bold text-secondary">Admin Panel</h1>
          <div className="w-8"></div>
        </div>

        {/* Sidebar - Mobile Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
        )}

        {/* Sidebar */}
        <div className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 fixed md:static left-0 top-0 h-screen md:h-auto w-[250px] md:w-[250px] lg:w-[300px] flex flex-col text-accent font-bold px-2 md:px-4 gap-2 md:gap-6 py-4 md:py-0 text-sm md:text-lg bg-white overflow-y-auto z-50 md:z-auto`}>
            <Link to="/admin/products" className={`${getClass("products")} whitespace-nowrap`} onClick={() => setSidebarOpen(false)}>Products</Link>
            <Link to="/admin/orders" className={`${getClass("orders")} whitespace-nowrap`} onClick={() => setSidebarOpen(false)}>Orders</Link>
            <Link to="/admin/users" className={`${getClass("users")} whitespace-nowrap`} onClick={() => setSidebarOpen(false)}>Users</Link>
            <Link to="/admin/reviews" className={`${getClass("reviews")} whitespace-nowrap`} onClick={() => setSidebarOpen(false)}>Reviews</Link>
        </div>
        
        {/* Content Area */}
        <div className="h-auto md:h-screen w-full md:w-[calc(100%-250px)] lg:w-[calc(100%-300px)] border-accent border-0 md:border-4 rounded-none md:rounded-xl bg-white overflow-y-auto">
          <Routes path="/*">
            <Route path="/products" element={<AdminProductPage />} />
            <Route path="/orders" element={<AdminOrderPage />} />
            <Route path="/users" element={<h1>Admin Users</h1>} />
            <Route path="/reviews" element={<AdminReviewPage />} />
            <Route path="/addProductPage" element={<AddProductPage />} />
            <Route path="/editProductPage/:id" element={<EditProductPage />} />
          </Routes>
        </div>
        </>
        }
    </div>
  );
}
