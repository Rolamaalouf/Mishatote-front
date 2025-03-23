"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const OrdersHistory = ({ user }) => {
  const [orders, setOrders] = useState([]); 
  const [products, setProducts] = useState({});
  const [error, setError] = useState(""); 
  const [selectedMonth, setSelectedMonth] = useState(""); // Month filter state

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/my-orders`, {
        withCredentials: true,
      });
      console.log("Orders Response:", response.data);
      setOrders(response.data); 
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Unable to get user's order items.");
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
      if (response.status === 200) {
        const productsMap = response.data.reduce((acc, product) => {
          acc[product.id] = product;
          return acc;
        }, {});
        console.log("Products Response:", response.data);
        setProducts(productsMap);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // Filter orders based on selected month
  const filteredOrders = selectedMonth
    ? orders.filter(order => new Date(order.createdAt).getMonth() + 1 === Number(selectedMonth))
    : orders;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Orders History</h1>
      
      {error && <div className="text-red-500 text-center">{error}</div>} 

      {/* Month Filter Dropdown */}
      <div className="flex justify-center mb-4">
        <select 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(e.target.value)} 
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">All Months</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>

        {/* Clear Button */}
        {selectedMonth && (
          <button 
            onClick={() => setSelectedMonth("")} 
            className="ml-3 px-3 py-2 bg-red-500 text-white rounded-md"
          >
            Clear
          </button>
        )}
      </div>

      <div className="max-w-xl mx-auto space-y-6">
        {filteredOrders.length === 0 ? (
          <p className="text-center text-gray-600">No orders found</p>
        ) : (
          filteredOrders.map((order) => {
            const product = products[order.product_id] || {}; // Get product details
            
            return (
              <div key={order.id} className="bg-gray-200 rounded-lg p-4 shadow-md flex items-center justify-around">
                <img 
                  src={product.image || "https://via.placeholder.com/100"} 
                  alt={product.name || "Unknown Product"} 
                  className="w-24 h-24 object-cover rounded-lg ml-6"
                />
                <div className="flex flex-col space-y-1">
                  <div className="text-lg font-semibold text-gray-900">{product.name || "Unknown Product"}</div>
                  <div className="text-gray-700">Status: <span className="text-blue-500 font-medium">{order.status}</span></div>
                  <div className="text-gray-700">Total Price: <span className="font-semibold">${order.total_price}</span></div>
                  <div className="text-gray-500 text-sm">Ordered On: {new Date(order.createdAt).toLocaleDateString()}</div>
                </div>

              
              
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OrdersHistory;
