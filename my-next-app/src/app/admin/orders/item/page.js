"use client";

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from "next/navigation";
import axios from 'axios';
import { FaEdit, FaTrash } from "react-icons/fa";

const OrderItemsPage = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    const [orderItems, setOrderItems] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const prevOrderId = useRef(null);
    const [products, setProducts] = useState({});
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editItemData, setEditItemData] = useState({ id: "", quantity: "" });

    useEffect(() => {
        if (!orderId) return;
    
        const getOrderItems = async () => {
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/items`,
              { withCredentials: true }
            );
    
            if (response.status === 200) {
              setOrderItems(response.data);
            } else {
              setError(`Unexpected response status: ${response.status}`);
            }
          } catch (err) {
            console.error("Error fetching order items:", err);
            setError("Unable to get order items");
          }
        };
    
        const getProducts = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
            if (response.status === 200) {
              const productsMap = response.data.reduce((acc, product) => {
                acc[product.id] = product;
                return acc;
              }, {});
              setProducts(productsMap);
            }
          } catch (err) {
            console.error("Error fetching products:", err);
          }
        };
    
        getOrderItems();
        getProducts();
      }, [orderId]);

 
   // Open Edit Modal
   const handleEditClick = (item) => {
    const productPrice = products[item.product_id]?.price || 0;
    setEditItemData({
        id: item.id,
        quantity: item.quantity,
        product_id: item.product_id,
        price: item.quantity * productPrice,
    });
    setIsEditModalOpen(true);
};

// Handle Edit Form Change
const handleEditChange = (e) => {
    const { name, value } = e.target;
    let newQuantity = name === "quantity" ? parseInt(value, 10) || 1 : editItemData.quantity;

    // Update price based on quantity change
    const productPrice = products[editItemData.product_id]?.price || 0;
    const updatedPrice = newQuantity * productPrice;

    setEditItemData((prev) => ({
        ...prev,
        [name]: value,
        price: updatedPrice,
    }));
};


    // Submit Edit
    const submitEditOrder = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/orders/item/${editItemData.id}`,
                { quantity: parseInt(editItemData.quantity, 10) },
                { withCredentials: true }
            );

            if (response.status === 200) {
                setIsEditModalOpen(false);
                setOrderItems((prevItems) =>
                    prevItems.map((item) =>
                        item.id === editItemData.id ? { ...item, quantity: editItemData.quantity } : item
                    )
                );
            }
        } catch (err) {
            console.error("Error updating order item:", err);
            setError("Unable to update order item");
        }
    };

    // Delete Order Item
    const deleteOrderItem = async (orderItemId) => {
        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/item/${orderItemId}`,
                { withCredentials: true }
            );

            if (response.status === 200) {
                setOrderItems((prevItems) => prevItems.filter((item) => item.id !== orderItemId));
            }
        } catch (err) {
            console.error("Error deleting order item:", err);
            setError("Unable to delete order item");
        }
    };

    return (
      <div className={`p-4 ${isEditModalOpen ? "opacity-50" : ""}`}>

            <h1 className="text-2xl font-bold mb-4">Order Items for Order {orderId}</h1>
            {error && <p className="text-red-500">{error}</p>}
            
            {orderItems.length === 0 ? (
                <p>No items found for this order.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 shadow-md rounded-md">
                        <thead>
                        <tr className="bg-gray-200" style={{ backgroundColor: "#4A8C8C", color: "white" }}>
                                <th className="py-2 px-4 border text-center">Order ID</th>
                                <th className="py-2 px-4 border text-center">ID</th>
                                <th className="py-2 px-4 border text-center">Product ID</th>
                                <th className="py-2 px-4 border text-center">Product</th>
                                <th className="py-2 px-4 border text-center">Quantity</th>
                                <th className="py-2 px-4 border text-center">Price</th>
                                <th className="py-2 px-4 border text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.map((item, index, array) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    {index === 0 || item.order_id !== array[index - 1].order_id ? (
                                        <td
                                            rowSpan={array.filter((i) => i.order_id === item.order_id).length}
                                            className="py-2 px-4 border text-center"
                                        >
                                            {item.order_id}
                                        </td>
                                    ) : null}
                                    <td className="py-2 px-4 border text-center">{item.id}</td>
                                    <td className="py-2 px-4 border text-center">{item.product_id}</td>
                                    <td className="py-2 px-4 border text-center">
                                        {products[item.product_id]?.name || "Loading..."}
                                    </td>
                                    <td className="py-2 px-4 border text-center">{item.quantity}</td>
                                    <td className="py-2 px-4 border text-center">${products[item.product_id]?.price || "-"}</td>
                                    <td className="py-2 px-4 border text-center">
                                        <button 
                                            className="text-yellow-500 hover:text-yellow-700 mx-2" 
                                            onClick={() => handleEditClick(item)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            className="text-red-500 hover:text-red-700" 
                                            onClick={() => deleteOrderItem(item.id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-xl font-semibold mb-4">Edit Order Item</h2>
                        <form onSubmit={submitEditOrder}>
                            <label className="block mb-2">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={editItemData.quantity}
                                onChange={handleEditChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                            <p className="mt-2 text-gray-700">
    Updated Price: <strong>${editItemData.price}</strong>
</p>

                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 mr-2 bg-gray-500 text-white rounded-md"
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderItemsPage;
