"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { AuthProvider } from "@/context/AuthContext";
import { FiTrash } from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [newUser, setNewUser] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    address: "", 
    role: "customer" 
  });
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [roleFilter, users]);

  // ✅ Check admin status from localStorage
  const checkAdminStatus = () => {
    const storedRole = localStorage.getItem("role");
    
    if (storedRole === "admin") {
      setIsAdmin(true);
      fetchUsers();
    } else {
      setIsAdmin(false);
      toast.error("Access denied. Admins only.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: {
          backgroundColor: "#e74c3c",
          color: "#ecf0f1",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        }
      });
      setTimeout(() => {
        if (!isAdmin) {
          window.location.href = "/"; 
        }
      }, 3000);
    }
  };

  // ✅ Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/users`, { withCredentials: true });
      setUsers(res.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error fetching users.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: {
          backgroundColor: "#e74c3c",
          color: "#ecf0f1",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filter users by role
  const filterUsers = () => {
    setFilteredUsers(
      users.filter(user => roleFilter === "all" || user.role === roleFilter)
    );
  };

  // ✅ Handle new user registration
  const handleAddUser = async (e) => {
    e.preventDefault();
    setFormErrors({});
    
    try {
      await axios.post(
        `${API_URL}/users/register`,
        { ...newUser },
        { withCredentials: true }
      );

      fetchUsers();
      setNewUser({ 
        name: "", 
        email: "", 
        password: "", 
        address: "", 
        role: "customer" 
      });
      toast.success("User added successfully!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: {
          backgroundColor: "#2c3e50",
          color: "#ecf0f1",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        }
      });
    } catch (error) {
      if (error.response) {
        const data = error.response.data;
        console.error("API Error:", data);
        
        if (data?.errors) {
          setFormErrors(data.errors);
        } else if (data?.message) {
          toast.error(data.message, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            style: {
              backgroundColor: "#e74c3c",
              color: "#ecf0f1",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }
          });
        } else {
          toast.error("Unknown API error. Please try again.", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            style: {
              backgroundColor: "#e74c3c",
              color: "#ecf0f1",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }
          });
        }
      } else {
        console.error("Network Error:", error.message);
        toast.error("Network error. Please check your connection.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          style: {
            backgroundColor: "#e74c3c",
            color: "#ecf0f1",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }
        });
      }
    }
  };

  // ✅ Handle User Deletion
  const handleDeleteUser = async (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_URL}/users/${userId}`, { withCredentials: true });
  
        // ✅ Update the state immediately
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  
        toast.success("User deleted successfully!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
  
        // ✅ Optionally fetch the latest users
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete user", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    }
  };
  

  return (
    <AuthProvider>
      <div className="p-4">
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <h1 className="text-2xl font-bold">Manage Users</h1>

        {isAdmin ? (
          <>
            <div className="my-4">
              <label>Filter by role:</label>
              <select 
                onChange={(e) => setRoleFilter(e.target.value)} 
                className="ml-2 p-1 border"
              >
                <option value="all">All</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            {loading ? (
              <div>Loading users...</div>
            ) : (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Role</th>
                    <th className="border p-2">Address</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center p-2">No users found</td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td className="border p-2">{user.id}</td>
                        <td className="border p-2">{user.name}</td>
                        <td className="border p-2">{user.email}</td>
                        <td className="border p-2">{user.role}</td>
                        <td className="border p-2">
                          {user.address && typeof user.address === 'object' 
                            ? `${user.address.region}, ${user.address.building}`
                            : user.address || 'N/A'}
                        </td>
                        <td className="border p-2 text-center">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiTrash className="inline-block h-5 w-5" aria-label="Delete" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            <div className="my-4">
              <h2 className="text-xl font-bold">Add User</h2>
              <form onSubmit={handleAddUser} className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <label className="mb-1">Name</label>
                  <input 
                    type="text" 
                    placeholder="Name" 
                    value={newUser.name} 
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} 
                    required 
                    className={`border p-2 ${formErrors?.name ? 'border-red-500' : ''}`}
                  />
                  {formErrors?.name && <div className="text-red-500 mt-1">{formErrors.name}</div>}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1">Email</label>
                  <input 
                    type="email" 
                    placeholder="Email" 
                    value={newUser.email} 
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} 
                    required 
                    className={`border p-2 ${formErrors?.email ? 'border-red-500' : ''}`}
                  />
                  {formErrors?.email && <div className="text-red-500 mt-1">{formErrors.email}</div>}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1">Password</label>
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={newUser.password} 
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} 
                    required 
                    className={`border p-2 ${formErrors?.password ? 'border-red-500' : ''}`}
                  />
                  {formErrors?.password && <div className="text-red-500 mt-1">{formErrors.password}</div>}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1">Address</label>
                  <input 
                    type="text" 
                    placeholder="Address" 
                    value={newUser.address} 
                    onChange={(e) => setNewUser({ ...newUser, address: e.target.value })} 
                    required 
                    className={`border p-2 ${formErrors?.address ? 'border-red-500' : ''}`}
                  />
                  {formErrors?.address && <div className="text-red-500 mt-1">{formErrors.address}</div>}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1">Role</label>
                  <select 
                    value={newUser.role} 
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} 
                    className={`border p-2 ${formErrors?.role ? 'border-red-500' : ''}`}
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                  {formErrors?.role && <div className="text-red-500 mt-1">{formErrors.role}</div>}
                </div>

                <button 
                  type="submit" 
                  className="bg-[#A68F7B] text-white p-2"
                >
                  Add User
                </button>
              </form>
            </div>
          </>
        ) : (
          <p className="text-red-500">Access denied. Only admins can view this page.</p>
        )}
      </div>
    </AuthProvider>
  );
};

export default UsersPage;
