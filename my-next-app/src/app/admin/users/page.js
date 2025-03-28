"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "@/context/AuthContext";
import { FiTrash, FiEdit } from "react-icons/fi";
import { validateAddress } from "@/app/Components/checkout/utils/validation";
import AddressForm from "@/app/Components/checkout/AddressForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useRef } from "react";

const UsersPage = () => {
  const formRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [editUserId, setEditUserId] = useState(null);
  const [newUser, setNewUser] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    address: {
      region: "",
      "address-direction": "",
      phone: "",
      building: "",
      floor: "",
    },
    role: "customer",
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

  const checkAdminStatus = () => {
    const storedRole = localStorage.getItem("role");

    if (storedRole === "admin") {
      setIsAdmin(true);
      fetchUsers();
    } else {
      setIsAdmin(false);
      toast.error("Access denied. Admins only.");
      setTimeout(() => {
        if (!isAdmin) {
          window.location.href = "/";
        }
      }, 3000);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/users`, { withCredentials: true });
      setUsers(res.data.users || []);
    } catch (error) {
      toast.error("Error fetching users.");
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    setFilteredUsers(users.filter((user) => roleFilter === "all" || user.role === roleFilter));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setFormErrors({});

    if (!validateAddress(newUser.address)) {
      return;
    }

    try {
      await axios.post(`${API_URL}/users/register`, newUser, { withCredentials: true });
      fetchUsers();
      resetForm();
      toast.success("User added successfully!");
    } catch (error) {
      toast.error("Failed to add user.");
    }
  };

  const handleDeleteUser = (userId, userName) => {
    confirmAlert({
      title: "Confirm Delete",
      message: (
        <div>
          Are you sure you want to delete user <strong>"{userName}"</strong>?
        </div>
      ),
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await axios.delete(`${API_URL}/users/${userId}`, {
                withCredentials: true,
              });
              setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
              setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
              toast.success("User deleted successfully!");
            } catch (error) {
              const errMsg = error.response?.data?.error || "Error deleting product. Please try again.";
              toast.error(` ${errMsg}`);
            }
          },
        },
        {
          label: "No",
        },
      ],
    });
  };
  

  const handleEditUser = (user) => {
    const address = {
      region: user.address?.region || "",
      "address-direction": user.address?.["address-direction"] || "",
      phone: user.address?.phone || "",
      building: user.address?.building || "",
      floor: user.address?.floor || "",
    };
  
    setEditUserId(user.id);
    setNewUser({
      id: user.id,
      name: user.name || "",
      email: user.email || "",
      password: "",
      address,
      role: user.role || "customer",
    });
  
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setFormErrors({});

    if (!validateAddress(newUser.address)) {
      return;
    }

    try {
      await axios.put(`${API_URL}/users/${editUserId}`, newUser, { withCredentials: true });
      fetchUsers();
      resetForm();
      toast.success("User updated successfully!");
    } catch (error) {
      toast.error("Failed to update user.");
    }
  };

  const resetForm = () => {
    setEditUserId(null);
    setNewUser({
      id: null,
      name: "",
      email: "",
      password: "",
      address: {
        region: "",
        "address-direction": "",
        phone: "",
        building: "",
        floor: "",
      },
      role: "customer",
    });
  };

  return (
    <AuthProvider>
      <div className="p-4 max-w-4xl mx-auto"> 

<ToastContainer position="top-center" />        <h1 className="text-2xl font-bold text-center">Manage Users</h1>
        {isAdmin ? (
          <>
            {/* Role Filter */}
            <div className="my-4 flex flex-col sm:flex-row items-center gap-4">
              <label className="text-lg font-medium">Filter by role:</label>
              <select
                onChange={(e) => setRoleFilter(e.target.value)}
                className="p-2 border rounded-md w-full sm:w-auto"
              >
                <option value="all">All</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            {/* Users Table */}
            {loading ? (
              <div className="text-center">Loading users...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 text-sm sm:text-base">
                  <thead>
                    <tr className="bg-[#4A8C8C] text-white">
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
                        <td colSpan="6" className="text-center p-2">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="text-center">
                          <td className="border p-2">{user.id}</td>
                          <td className="border p-2">{user.name}</td>
                          <td className="border p-2">{user.email}</td>
                          <td className="border p-2">{user.role}</td>
                          <td className="border p-2">
                            {user.address
                              ? `${user.address.region}, ${user.address["address-direction"]}, ${user.address.building}, ${user.address.floor}, ${user.address.phone}`
                              : "N/A"}
                          </td>
                          <td className="border p-2">
                          <button onClick={() => handleDeleteUser(user.id, user.name)} className="text-red-700">
                          <FiTrash className="inline-block h-5 w-5 text-red-700 hover:scale-105 transition " />
                            </button>
                            <button onClick={() => handleEditUser(user)} className="text-[#A68F7B]">
                              <FiEdit className="inline-block h-5 w-5 hover:scale-105 transition " />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Add or Edit User Form */}
            <div className="my-6 bg-gray-100 p-4 rounded-md">
              {editUserId ? (
                <>
                  <h2  ref={formRef} className="text-xl font-bold mb-2">Edit User</h2>
                  <form onSubmit={handleUpdateUser} className="flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="Name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      required
                      className="border p-2 rounded-md"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      required
                      className="border p-2 rounded-md"
                    />
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="border p-2 rounded-md"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                    {/* Address Form */}
                    <AddressForm
                      address={newUser.address}
                      updateAddress={(updatedAddress) =>
                        setNewUser({ ...newUser, address: { ...newUser.address, ...updatedAddress } })
                      }
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                      Update User
                    </button>
                    <button type="button" onClick={resetForm} className="bg-gray-400 text-white p-2 rounded-md">
                      Cancel
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-2">Add User</h2>
                  <form onSubmit={handleAddUser} className="flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="Name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      required
                      className="border p-2 rounded-md"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      required
                      className="border p-2 rounded-md"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      required
                      className="border p-2 rounded-md"
                    />

                    {/* Address Form */}
                    <AddressForm
                      address={newUser.address}
                      updateAddress={(updatedAddress) =>
                        setNewUser({ ...newUser, address: { ...newUser.address, ...updatedAddress } })
                      }
                    />
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="border p-2 rounded-md"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button type="submit" className="bg-[#4A8C8C] text-white p-2 rounded-md">
                      Add User
                    </button>
                  </form>
                </>
              )}
            </div>
          </>
        ) : (
          <p className="text-red-500 text-center">Access denied. Admins only.</p>
        )}
      </div>
    </AuthProvider>
  );
};

export default UsersPage;
