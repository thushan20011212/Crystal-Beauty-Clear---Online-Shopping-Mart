import { Link } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import AdminProductPage from "../pages/admin/adminProductPage";
import AddProdeuctPage from "./admin/addProductPage";


export default function AdminPage() {
  return (
    <div className="w-full h-screen flex">
        <div className="h-full w-[300px]  flex flex-col">
            <Link to="/admin/products" className="p-4 border-b">Products</Link>
            <Link to="/admin/orders" className="p-4 border-b">Orders</Link>
            <Link to="/admin/users" className="p-4 border-b">Users</Link>
            <Link to="/admin/reviews" className="p-4 border-b">Reviews</Link>
        </div>
        <div className="h-full w-[calc(100%-300px)]">
          <Routes path="/*">
            <Route path="/products" element={<AdminProductPage />} />
            <Route path="/orders" element={<h1>Admin Orders</h1>} />
            <Route path="/users" element={<h1>Admin Users</h1>} />
            <Route path="/reviews" element={<h1>Admin Reviews</h1>} />
            <Route path="/addProduct" element={<AddProdeuctPage/>} />
          </Routes>
        </div>
    </div>
  );
}
