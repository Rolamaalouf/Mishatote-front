"use client";

import Head from "next/head";
import Header from "@/app/Components/header";
import Footer from "@/app/Components/footer";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);

  // Fetch products on load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          withCredentials: true,
        });
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch cart items on load
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        withCredentials: true,
      });
      setCartItems(data);
    } catch (error) {
      console.error("Fetch Cart Error:", error);
    }
  };

  // Open Popup and Reset Quantity
  const openCartPopup = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  // Handle Add to Cart
  const handleAddToCart = async () => {
    if (!selectedProduct) return;

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/add`,
        { product_id: selectedProduct.id, quantity },
        { withCredentials: true }
      );

      toast.success(`Added ${quantity} item(s) to cart!`);
      fetchCartItems(); // Update cart in real-time
      setSelectedProduct(null); // Close popup
    } catch (error) {
      console.error("Add to Cart Error:", error);
      toast.error("Failed to add item to cart!");
    }
  };

  return (
    <div className="relative w-full min-h-screen">
      <Head>
        <title>Products</title>
      </Head>

      <Header />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <div className="relative w-full bg-[#4A8C8C] h-[10cm] flex items-center justify-center">
        <h1 className="text-white text-4xl font-bold absolute bottom-40">Products</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-10 mt-50">
        {loading ? (
          <p>Loading products...</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-lg text-center relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[200px] object-cover mb-2 border-2 border-[#A68F7B] rounded"
                onError={(e) => (e.target.src = "/placeholder.jpg")}
              />

              <h3 className="text-lg font-bold">{product.name}</h3>
              <p className="text-gray-600">${product.price}</p>

              <button
                className="mt-4 bg-[#4A8C8C] text-white px-6 py-2 rounded w-full"
                onClick={() => openCartPopup(product)}
              >
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>

      {/* Popup Modal for Quantity Selection */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-[200px] object-cover border-2 border-[#A68F7B] rounded my-2"
            />
            <p className="text-gray-700">{selectedProduct.description}</p>
            <p className="text-gray-600">${selectedProduct.price}</p>

            {/* Quantity Controls */}
            <div className="flex items-center justify-center my-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded-l"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <span className="px-6">{quantity}</span>
              <button
                className="bg-gray-300 px-4 py-2 rounded-r"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              className="mt-4 bg-[#4A8C8C] text-white px-6 py-2 rounded w-full"
              onClick={handleAddToCart}
            >
              Confirm
            </button>

            {/* Close Button */}
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setSelectedProduct(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
