"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";
import Link from "next/link";
import DeliveryFeeManager from "@/app/Components/DeliveryFeeManager";
import { ToastContainer,toast } from "react-toastify";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editOrderData, setEditOrderData] = useState({ id: "", status: "" });

    const getOrders = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                withCredentials: true,
            });

            if (response.status === 200) {
                setOrders(response.data);
            } else {
                setError(`Unexpected response status: ${response.status}`);
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError("Unable to get orders");
        }
    };
 

    const deleteOrder = async (orderId) => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/delete`, {
                withCredentials: true,
            });
    
            if (response.status === 200) {
                setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
                toast.success("Order deleted successfully");
            }
        } catch (err) { 
            const message =
                err?.response?.data?.error ||
                err?.message ||
                "Unable to delete order";
    
            toast.error(message);  
         }
    };
    

    const handleEditClick = (order) => {
        setEditOrderData(order);
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e) => {
        setEditOrderData({ ...editOrderData, [e.target.name]: e.target.value });
    };

    const submitEditOrder = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/orders/${editOrderData.id}`,
                { status: editOrderData.status },
                { withCredentials: true }
            );

            if (response.status === 200) {
                setIsEditModalOpen(false);
                getOrders();
            }
        } catch (err) {
            console.error("Error updating order:", err);
            setError("Unable to update order");
        }
    };

    useEffect(() => {
        getOrders();
    }, []);

    return (
        
        <div className="flex flex-col items-left p-4">
              <DeliveryFeeManager  />
            <h1 className="text-2xl font-bold mb-4 text-left p-8">Manage Orders</h1>
            {error && <p className="text-red-500">{error}</p>}

            <table className="min-w-full table-auto border-collapse border border-gray-300 bg-white shadow-md rounded-lg z-10">
                <thead className="bg-gray-100">
                    <tr className="bg-gray-200" style={{ backgroundColor: "#4A8C8C", color: "white" }}>
                        <th className="px-6 py-3 text-center text-xl font-semibold text-white border">User ID</th>
                        <th className="px-6 py-3 text-center text-xl font-semibold text-white border">Status</th>
                        <th className="px-6 py-3 text-center text-xl font-semibold text-white border">Total Price</th>
                        <th className="px-6 py-3 text-center text-xl font-semibold text-white border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="px-6 py-4 text-xl text-gray-900 text-center border">
                                {order.user?.name || order.user_id || "N/A"}
                            </td>
                            <td className="px-6 py-4 text-xl text-gray-700 text-center border">{order.status}</td>
                            <td className="px-6 py-4 text-xl text-gray-700 text-center border">${order.total_price}</td>
                            <td className="px-6 py-4 text-xl">
                                <div className="flex justify-center items-center space-x-4">
                                    <Link href={`/admin/orders/item?orderId=${order.id}`}>
                                        <button className="flex items-center text-blue-500 hover:text-blue-700">
                                            <FaEye className="h-5 w-5" />
                                        </button>
                                    </Link>
                                    <button
                                        className="text-yellow-700 hover:text-yellow-500"
                                        onClick={() => handleEditClick(order)}
                                    >
                                        <FaEdit className="h-5 w-5" />
                                    </button>
                                    <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => deleteOrder(order.id)}
                                        >
                                            <FaTrash className="h-5 w-5" />
                                        </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit Order Modal */}
            {isEditModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                        <h3 className="text-lg font-bold mb-4">Edit Order</h3>
                        <form onSubmit={submitEditOrder}>
                            <label className="block mb-2">
                                <span className="text-gray-700">Order Status:</span>
                                <select
                                    name="status"
                                    value={editOrderData.status}
                                    onChange={handleEditChange}
                                    className="block w-full p-2 border rounded mt-1"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="canceled">Canceled</option>
                                </select>
                            </label>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <ToastContainer position="top-center" autoClose={3000} />

        </div>
    );
};

export default Orders;
