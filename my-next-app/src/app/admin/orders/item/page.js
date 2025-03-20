"use client";

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from "next/navigation";
import axios from 'axios';
import OrdersHistory from '@/app/Components/itemuser';

const OrderItemsPage = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    const [orderItems, setOrderItems] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const prevOrderId = useRef(null);

    const [products, setProducts] = useState({});
 


    useEffect(() => {
        if (!orderId) return;
    
        const getOrderItems = async () => {
          try {
            const response = await axios.get(
              `http://localhost:5000/api/orders/${orderId}/items`,
              {
                withCredentials: true,
              }
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
            const response = await axios.get("http://localhost:5000/api/products");
            if (response.status === 200) {
              const productsMap = response.data.reduce((acc, product) => {
                acc[product.id] = product;
                return acc;
               
              }, {});
              console.log("response", response.data)
              setProducts(productsMap);
            }
          } catch (err) {
            console.error("Error fetching products:", err);
          }
        };
    
        getOrderItems();
        getProducts();
      }, [orderId]);
    
      return (
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Order Items for Order {orderId}</h1>
          {error && <p className="text-red-500">{error}</p>}
          {orderItems.length === 0 ? (
            <p>No items found for this order.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 shadow-md rounded-md">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="py-2 px-4 border text-center">Order ID</th>
                    <th className="py-2 px-4 border text-center">ID</th>
                    <th className="py-2 px-4 border text-center">Product ID</th>
                    <th className="py-2 px-4 border text-center">Product</th>
                    <th className="py-2 px-4 border text-center">Quantity</th>
                    <th className="py-2 px-4 border text-center">Price</th>
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
                      <td className="py-2 px-4 border text-center">{products[item.product_id]?.name || "Loading..."}</td>
                      <td className="py-2 px-4 border text-center">{item.quantity}</td>
                      <td className="py-2 px-4 border text-center">${products[item.product_id]?.price || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <OrdersHistory/>
        </div>
      );
    };
    
    export default OrderItemsPage;
    