"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/Components/sidebar";
const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");

    const getOrders = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/orders/`
            );
            console.log("API Response:", response); // Log full response
            console.log("Orders Data:", response.data); // Log data specifically
    
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
    

    useEffect(() => {
        getOrders();
    }, []);

    return (
        <div>
            <Sidebar/>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <table border="1">
                <thead>
                    <tr>
                        <th>User Name</th>
                        <th>Status</th>
                        <th>Total Price</th>
                        <th>Order Items</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.user?.name || "N/A"}</td>
                            <td>{order.status}</td>
                            <td>${order.totalPrice}</td>
                            <td>
                                <ul>
                                    {order.orderItems?.map((item) => (
                                        <li key={item.id}>{item.productName} - {item.quantity}</li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Orders;

