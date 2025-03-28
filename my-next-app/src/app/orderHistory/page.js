"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Components/header";
import Footer from "../Components/footer";

const OrdersHistory = () => {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState(""); // Start Date filter
  const [endDate, setEndDate] = useState(""); // End Date filter
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Fetch Orders for Logged-in User
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/my-orders`, { withCredentials: true });
      console.log("Orders Fetched:", response.data);
      setOrders(response.data);
      setFilteredOrders(response.data); // Show all orders 
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Unable to fetch orders.");
      setLoading(false);
    }
  };

  // Apply Date Filter
  const handleSearch = () => {
    if (!startDate && !endDate) {
      setFilteredOrders(orders); // If no date selected, show all orders
      return;
    }

    const filtered = orders.filter(order => {
      if (!order.createdAt) return false; // Handle missing `createdAt`
      
      const orderDate = new Date(order.createdAt).toISOString().split("T")[0]; // Convert to YYYY-MM-DD
      console.log(`Order Date: ${orderDate}, Start Date: ${startDate}, End Date: ${endDate}`);

      if (startDate && endDate) {
        return orderDate >= startDate && orderDate <= endDate;
      } else if (startDate) {
        return orderDate >= startDate;
      } else if (endDate) {
        return orderDate <= endDate;
      }
      return true;
    });

    setFilteredOrders(filtered);
  };

  // Fetch Order Items for Each Order
  const fetchOrderItems = async () => {
    try {
      const itemPromises = orders.map((order) =>
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}/items`, { withCredentials: true })
      );
      const itemResponses = await Promise.all(itemPromises);
      const allItems = itemResponses.flatMap((res) => res.data);
      console.log("Order Items Fetched:", allItems);
  
      const processedItems = allItems.map(item => {
        if (item.Product) {
          return {
            ...item,
            productName: item.Product.name,
            productPrice: item.Product.price,
            productImage: item.Product.image 
          };
        }
        return {
          ...item,
          productName: "Unknown Product",
          productPrice: 0,
          productImage: null
        };
      });
  
      setOrderItems(processedItems);
    } catch (err) {
      console.error("Error fetching order items:", err);
      setError("Unable to fetch order items.");
      setLoading(false);
    }
  };

  // Fetch Product Data
  const fetchProducts = async () => {
    if (orderItems.length === 0) return; 
  
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/`);
      console.log("Products Fetched:", response.data); //  Debugging Log
      const productMap = response.data.reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {});
      setProducts(productMap);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Unable to fetch products.");
    } finally {
      setLoading(false); // Ensure loading stops
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      fetchOrderItems();
      setFilteredOrders(orders); //  Update filtered list when orders change
    }
  }, [orders]);

  useEffect(() => {
    if (orderItems.length > 0) {
      fetchProducts();
    }
  }, [orderItems]);

  if (loading) return <div className="text-center text-xl">Loading...</div>;

  return (
    <div className="px-6 py-12 bg-gray-100">
      <Header />
      <div className="bg-[#A68F7B] h-[20vh] flex items-center justify-center mt-20">
        <h1 className="text-white text-5xl sm:text-6xl font-bold text-center">Orders History</h1>
      </div>
      {error && <div className="text-red-500 text-center">{error}</div>}

      {/* Date Range Filter */}
      <div className="flex justify-center items-center flex-wrap gap-4 mb-6 mt-6">
  <label className="flex flex-col text-sm text-gray-700">
    Start Date
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="p-2 border border-gray-300 rounded-md mt-1"
    />
  </label>

  <label className="flex flex-col text-sm text-gray-700">
    End Date
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      className="p-2 border border-gray-300 rounded-md mt-1"
    />
  </label>

  {/* Search Button */}
  <button
    onClick={handleSearch}
    disabled={!startDate && !endDate}
    className={`px-4 py-2 rounded-md text-white mt-6 ${startDate || endDate ? "bg-[#4A8C8C] hover:bg-[#357474]" : "bg-gray-400 cursor-not-allowed"}`}
  >
    Search
  </button>

  {/* Clear Filter Button */}
  {(startDate || endDate) && (
    <button
      onClick={() => {
        setStartDate("");
        setEndDate("");
        setFilteredOrders(orders);
      }}
      className="px-4 py-2 bg-red-500 text-white rounded-md mt-6"
    >
      Clear
    </button>
  )}
</div>



      {/* Orders List (Now Uses `filteredOrders`) */}
      <div className="max-w-4xl mx-auto space-y-6">
        {filteredOrders.length === 0 ? (
          <p className="text-center text-gray-600">No orders found</p>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Order ID: {order.id} - {order.status}
              </h2>

              <div className="space-y-4">
                {orderItems.filter(item => item.order_id === order.id).map((item) => {
                  const product = products[item.product_id] || {};

                  return (
                    <div key={item.id} className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                      <img
                        src={product.image ? product.image[0] : "https://via.placeholder.com/100"}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1 ml-4">
                        <div className="text-lg font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">Price: ${product.price}</div>
                        <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                      </div>
                      <div className="text-lg font-semibold text-gray-800">
                        Total: ${(product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 text-gray-500">
                Ordered On: {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrdersHistory;
