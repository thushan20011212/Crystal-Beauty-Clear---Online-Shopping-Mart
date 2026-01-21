import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Modal from "react-modal";
import Loading from "../../components/loading.jsx";
import { FaUser, FaTrash, FaUserShield, FaUserCog, FaEnvelope, FaCalendar, FaSearch } from "react-icons/fa";

Modal.setAppElement("#root");

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeUser, setActiveUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    // Fetch users from backend
    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter users when search or role filter changes
    useEffect(() => {
        let filtered = users;

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(user => 
                user.firstName?.toLowerCase().includes(query) ||
                user.lastName?.toLowerCase().includes(query) ||
                user.email?.toLowerCase().includes(query)
            );
        }

        // Filter by role
        if (roleFilter !== "all") {
            filtered = filtered.filter(user => user.role === roleFilter);
        }

        setFilteredUsers(filtered);
    }, [searchQuery, roleFilter, users]);

    async function fetchUsers() {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login first");
                setIsLoading(false);
                return;
            }

            const response = await axios.get(
                import.meta.env.VITE_BACKEND_URL + "/api/user/admin/all",
                {
                    headers: { Authorization: "Bearer " + token }
                }
            );

            setUsers(response.data.users || []);
            setFilteredUsers(response.data.users || []);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error(error.response?.data?.message || "Failed to fetch users");
            setUsers([]);
            setFilteredUsers([]);
        } finally {
            setIsLoading(false);
        }
    }

    function openUserModal(user) {
        setActiveUser(user);
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
        setActiveUser(null);
    }

    async function updateUserRole(userId, newRole) {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                import.meta.env.VITE_BACKEND_URL + "/api/user/admin/" + userId + "/role",
                { role: newRole },
                {
                    headers: { Authorization: "Bearer " + token }
                }
            );

            toast.success(`User role updated to ${newRole}`);
            await fetchUsers();
            
            // Update active user if modal is open
            if (activeUser && activeUser._id === userId) {
                setActiveUser(prev => ({ ...prev, role: newRole }));
            }
        } catch (error) {
            console.error("Error updating user role:", error);
            toast.error(error.response?.data?.message || "Failed to update user role");
        }
    }

    async function deleteUser(userId) {
        if (!window.confirm("⚠️ WARNING: Are you sure you want to delete this user?\n\nThis will also delete:\n• All orders placed by this user\n• All reviews written by this user\n\nThis action cannot be undone!")) {
            return
        }

        try {
            const token = localStorage.getItem("token")
            const response = await axios.delete(
                import.meta.env.VITE_BACKEND_URL + "/api/user/admin/" + userId,
                {
                    headers: { Authorization: "Bearer " + token }
                }
            )

            // Show detailed feedback
            const deletedData = response.data.deletedData
            if (deletedData) {
                toast.success(
                    `User deleted successfully!\n` +
                    `Orders deleted: ${deletedData.ordersDeleted}\n` +
                    `Reviews deleted: ${deletedData.reviewsDeleted}`,
                    { duration: 5000 }
                )
            } else {
                toast.success("User deleted successfully")
            }

            await fetchUsers()
            closeModal()
        } catch (error) {
            console.error("Error deleting user:", error)
            toast.error(error.response?.data?.message || "Failed to delete user")
        }
    }

    // Get user stats
    const totalUsers = users.length;
    const adminCount = users.filter(u => u.role === "admin").length;
    const customerCount = users.filter(u => u.role === "customer").length;

    return (
        <div className="w-full h-full p-4 md:p-6 overflow-y-auto">

            {/* Header */}
            <div className="mb-4 md:mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-secondary">
                    User Management
                </h1>
                <p className="text-gray-500 text-sm mt-1">Manage all registered users</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 md:p-4">
                    <div className="flex items-center gap-2 md:gap-3">
                        <FaUser className="text-blue-500 text-lg md:text-2xl" />
                        <div>
                            <p className="text-lg md:text-2xl font-bold text-blue-600">{totalUsers}</p>
                            <p className="text-xs md:text-sm text-blue-500">Total Users</p>
                        </div>
                    </div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 md:p-4">
                    <div className="flex items-center gap-2 md:gap-3">
                        <FaUserShield className="text-purple-500 text-lg md:text-2xl" />
                        <div>
                            <p className="text-lg md:text-2xl font-bold text-purple-600">{adminCount}</p>
                            <p className="text-xs md:text-sm text-purple-500">Admins</p>
                        </div>
                    </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 md:p-4">
                    <div className="flex items-center gap-2 md:gap-3">
                        <FaUser className="text-green-500 text-lg md:text-2xl" />
                        <div>
                            <p className="text-lg md:text-2xl font-bold text-green-600">{customerCount}</p>
                            <p className="text-xs md:text-sm text-green-500">Customers</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-accent text-sm md:text-base"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-accent text-sm md:text-base bg-white"
                >
                    <option value="all">All Roles</option>
                    <option value="admin">Admins Only</option>
                    <option value="customer">Customers Only</option>
                </select>
            </div>

            {/* Loading */}
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    {/* USER DETAILS MODAL */}
                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        className="bg-white max-w-2xl mx-auto mt-10 rounded-2xl outline-none shadow-2xl overflow-hidden w-[calc(100%-2rem)] md:w-auto max-h-[90vh]"
                        overlayClassName="fixed inset-0 bg-black/60 flex justify-center items-start py-5 md:py-10 px-4 md:px-0"
                    >
                        {activeUser && (
                            <div className="max-h-[90vh] overflow-y-auto">
                                {/* Header */}
                                <div className="bg-secondary p-4 md:p-6 flex justify-between items-start gap-4">
                                    <div className="flex items-center gap-3 md:gap-4">
                                        {activeUser.img ? (
                                            <img 
                                                src={activeUser.img} 
                                                alt={activeUser.firstName}
                                                className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-white"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-accent flex items-center justify-center text-white text-xl md:text-2xl font-bold">
                                                {activeUser.firstName?.charAt(0)}{activeUser.lastName?.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <h2 className="text-xl md:text-2xl font-bold text-white">
                                                {activeUser.firstName} {activeUser.lastName}
                                            </h2>
                                            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                                activeUser.role === "admin" 
                                                    ? "bg-purple-500 text-white" 
                                                    : "bg-green-500 text-white"
                                            }`}>
                                                {activeUser.role?.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={closeModal}
                                        className="text-white hover:bg-white/20 rounded-full p-2 transition text-xl w-10 h-10 flex items-center justify-center shrink-0"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-4 md:p-6 space-y-4 md:space-y-5">
                                    
                                    {/* User Info */}
                                    <div className="bg-gray-50 p-4 md:p-5 rounded-xl space-y-3">
                                        <div className="flex items-center gap-3">
                                            <FaEnvelope className="text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-500">Email</p>
                                                <p className="text-sm md:text-base font-medium text-secondary break-all">{activeUser.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaCalendar className="text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-500">Member Since</p>
                                                <p className="text-sm md:text-base font-medium text-secondary">
                                                    {new Date(activeUser.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Role Management */}
                                    <div>
                                        <h3 className="text-sm md:text-base font-bold text-secondary mb-3 flex items-center gap-2">
                                            <FaUserCog className="text-accent" />
                                            Change User Role
                                        </h3>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => updateUserRole(activeUser._id, "customer")}
                                                className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                                                    activeUser.role === "customer"
                                                        ? "bg-green-500 text-white"
                                                        : "bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600"
                                                }`}
                                            >
                                                Customer
                                            </button>
                                            <button
                                                onClick={() => updateUserRole(activeUser._id, "admin")}
                                                className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                                                    activeUser.role === "admin"
                                                        ? "bg-purple-500 text-white"
                                                        : "bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600"
                                                }`}
                                            >
                                                Admin
                                            </button>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200">
                                        <button
                                            onClick={closeModal}
                                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2.5 px-4 rounded-lg transition duration-300 text-sm md:text-base"
                                        >
                                            Close
                                        </button>
                                        <button
                                            onClick={() => deleteUser(activeUser._id)}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-lg transition duration-300 text-sm md:text-base flex items-center justify-center gap-2"
                                        >
                                            <FaTrash className="text-sm" />
                                            Delete User
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Modal>

                    {/* Users Table */}
                    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-left p-3 md:p-4 text-xs md:text-sm font-semibold text-secondary">User</th>
                                    <th className="text-left p-3 md:p-4 text-xs md:text-sm font-semibold text-secondary hidden md:table-cell">Email</th>
                                    <th className="text-center p-3 md:p-4 text-xs md:text-sm font-semibold text-secondary">Role</th>
                                    <th className="text-center p-3 md:p-4 text-xs md:text-sm font-semibold text-secondary hidden md:table-cell">Joined</th>
                                    <th className="text-center p-3 md:p-4 text-xs md:text-sm font-semibold text-secondary">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-12 text-gray-500">
                                            {searchQuery || roleFilter !== "all" 
                                                ? "No users found matching your filters" 
                                                : "No users found"}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr 
                                            key={user._id} 
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                                            onClick={() => openUserModal(user)}
                                        >
                                            <td className="p-3 md:p-4">
                                                <div className="flex items-center gap-3">
                                                    {user.img ? (
                                                        <img 
                                                            src={user.img} 
                                                            alt={user.firstName}
                                                            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs md:text-sm font-bold">
                                                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-secondary text-sm md:text-base">
                                                            {user.firstName} {user.lastName}
                                                        </p>
                                                        <p className="text-xs text-gray-500 md:hidden">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3 md:p-4 text-sm text-gray-600 hidden md:table-cell">
                                                {user.email}
                                            </td>
                                            <td className="p-3 md:p-4 text-center">
                                                <span className={`inline-block px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${
                                                    user.role === "admin" 
                                                        ? "bg-purple-100 text-purple-600" 
                                                        : "bg-green-100 text-green-600"
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-3 md:p-4 text-center text-xs md:text-sm text-gray-500 hidden md:table-cell">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-3 md:p-4 text-center">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openUserModal(user);
                                                    }}
                                                    className="bg-secondary hover:bg-secondary/90 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition-all"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Results count */}
                    {filteredUsers.length > 0 && (
                        <p className="text-sm text-gray-500 mt-4 text-center">
                            Showing {filteredUsers.length} of {totalUsers} users
                        </p>
                    )}
                </>
            )}
        </div>
    );
}
