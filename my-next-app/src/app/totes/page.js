"use client";

import Head from "next/head";
import Header from "@/app/Components/header";
import Footer from "@/app/Components/footer";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa"; // Magnifier icon
import { useRouter } from "next/navigation";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null); // For popup
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

  // Function to handle image parsing
  const parseProductImage = (imageData) => {
    try {
      if (typeof imageData === "string") {
        return imageData; // If it's a string, return directly
      } else if (Array.isArray(imageData) && imageData.length > 0) {
        return imageData[0]; // Return first image if it's an array
      }
      return "/placeholder.jpg"; // Fallback image if no valid image found
    } catch (error) {
      console.error("Error parsing image:", error);
      return "/placeholder.jpg"; // Fallback image
    }
  };

  return (
    <div className="relative w-full min-h-screen">
      <Head>
        <title>Products</title>
      </Head>

      <Header />

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
            <div key={product.id} className="border p-4 rounded-lg shadow-lg text-center">
              {/* Product Image */}
              <img
                src={parseProductImage(product.image)}
                alt={product.name}
                className="w-full h-[200px] object-cover mb-2 border-2 border-[#A68F7B] rounded"
                onError={(e) => (e.target.src = "/placeholder.jpg")} // Show placeholder if broken
              />

              <h3 className="text-lg font-bold">{product.name}</h3>
              <p className="text-gray-600">${product.price}</p>

              {/* Magnifier Icon for Product Details */}
              <button
                className="text-[#4A8C8C] mt-2"
                onClick={() => setSelectedProduct(product)}
              >
                <FaSearch size={20} />
              </button>

              {/* Add to Cart Button */}
              <button
                className="block w-full mt-4 bg-[#4A8C8C] text-white py-2 rounded"
                onClick={() => router.push("/cart")}
              >
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>

      {/* Product Details Popup */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
            <img
              src={parseProductImage(selectedProduct.image)}
              alt={selectedProduct.name}
              className="w-full h-[200px] object-cover border-2 border-[#A68F7B] rounded my-2"
              onError={(e) => (e.target.src = "/placeholder.jpg")}
            />
            <p className="text-gray-700">{selectedProduct.description}</p>
            <p className="text-gray-600">Size: {selectedProduct.size}</p>
            <p className="text-gray-600">Color: {selectedProduct.color}</p>
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
