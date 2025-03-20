"use client";

import Head from "next/head";
import Header from "@/app/Components/header";
import Footer from "@/app/Components/footer";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaShoppingCart } from "react-icons/fa"; // Cart icon
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null); // For popup
  const [selectedSize, setSelectedSize] = useState(null);
  const router = useRouter();

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

  // Handle adding to cart
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size before adding to cart!");
      return;
    }

    // Add product to cart (dummy logic, replace with actual cart function)
    toast.success(`${selectedProduct.name} added to cart!`);
    setSelectedProduct(null); // Close popup after adding
  };

  return (
    <div className="relative w-full min-h-screen">
      <Head>
        <title>Products</title>
      </Head>

      <Header />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Green Header Block */}
      <div className="relative w-full bg-[#4A8C8C] h-[10cm] flex items-center justify-center">
        <h1 className="text-white text-4xl font-bold absolute bottom-40">Products</h1>
        <img
          src="https://i.ibb.co/qM9PD8BR/A-flat-lay-image-of-three-cotton-tote-bags-with-colorful-designs-The-first-tote-features-a-vibrant-f.png"
          alt="Tote Bag"
          className="absolute bottom-[-150px] w-[600px] h-70 border-2 border-[#A68F7B]"
        />
      </div>

      {/* Products List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-10 mt-50">
        {loading ? (
          <p>Loading products...</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-lg text-center relative">
              {/* Product Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[200px] object-cover mb-2 border-2 border-[#A68F7B] rounded"
                onError={(e) => (e.target.src = "/placeholder.jpg")} // Fallback image
              />

              <h3 className="text-lg font-bold">{product.name}</h3>
              <p className="text-gray-600">${product.price}</p>

              {/* Cart Button */}
              <button
                className="absolute top-4 right-4 text-[#4A8C8C] bg-white p-2 rounded-full shadow-md"
                onClick={() => setSelectedProduct(product)}
              >
                <FaShoppingCart size={20} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Product Details Popup */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-[200px] object-cover border-2 border-[#A68F7B] rounded my-2"
              onError={(e) => (e.target.src = "/placeholder.jpg")}
            />
            <p className="text-gray-700">{selectedProduct.description}</p>
            <p className="text-gray-600">${selectedProduct.price}</p>

            {/* Size Selection */}
            <div className="flex justify-center my-4 space-x-2">
              {["S", "M", "L"].map((size) => (
                <button
                  key={size}
                  className={`px-4 py-2 border rounded ${
                    selectedSize === size ? "bg-[#4A8C8C] text-white" : "bg-gray-200"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Add to Cart Button */}
            <button
              className="mt-4 bg-[#4A8C8C] text-white px-6 py-2 rounded w-full"
              onClick={handleAddToCart}
            >
              Add to Cart
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

