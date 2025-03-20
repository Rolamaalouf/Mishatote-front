import React, { useState, useEffect } from "react";
import axios from "axios";

const OrdersHistory = ({ user }) => {
  const [orders, setOrders] = useState([]); 
  const [products, setProducts] = useState({});
  const [error, setError] = useState(""); 

  // Fetch orders
  const items = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders/my-order", {
        withCredentials: true,
      });
      console.log("Orders Response:", response.data);
      setOrders(response.data); // Store orders in state
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Unable to get orders item of user");
    }
  };

  // Fetch products
  const getProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      if (response.status === 200) {
        const productsMap = response.data.reduce((acc, product) => {
          acc[product.id] = product;
          return acc;
        }, {});
        console.log("Products Response:", response.data);
        setProducts(productsMap); // Store products in state
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    getProducts();
    items();
  }, []);

  return (
    <div className="flex p-4">
      <h1>Orders History </h1>
      {error && <div className="error">{error}</div>} 
      <div className="flex-1 p-6 bg-white">
        {orders.length === 0 ? (
          <p>No orders found</p> 
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-item">
              <div>{order.image}</div>
              <div>{products[order.product_id]?.name || "Loading..."}</div>
              <div>{order.quantity}</div>
              <div>{order.price}</div>
              <div>{order.date}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersHistory;
