"use client";

import Head from "next/head";
import Header from "@/app/Components/header";
import Footer from "@/app/Components/footer";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "@/context/CartContext";

export default function Products() {
  const { fetchCartCount } = useCart(); 
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sortOrder, setSortOrder] = useState("lowToHigh");
  const [showModal, setShowModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch products based on selected category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/products`;
        const { data } = await axios.get(url, { withCredentials: true });

        const filtered =
          selectedCategory === "all"
            ? data
            : data.filter((product) => product.category_id === Number.parseInt(selectedCategory));

        setProducts(filtered);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
          withCredentials: true,
        });
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Check user authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          withCredentials: true,
        });
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // Open product details modal
  const openProductDetailsModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Open cart popup
  const openCartPopup = (product) => {
    if (!isAuthenticated) {
      toast.error("Log in first to add items to the cart!");
      setTimeout(() => router.push("/login"), 2000);
      return;
    }
    setSelectedProduct(product);
    setQuantity(1); // Reset quantity each time
    setShowCartModal(true);
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedProduct) return;
  
    const availableStock = selectedProduct.stock ?? 0;
  
    if (quantity < 1) {
      toast.error("Quantity must be at least 1.");
      return;
    }
  
    if (quantity > availableStock) {
      toast.error(`Only ${availableStock} item(s) available in stock.`);
      return;
    }
  
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/add`,
        { product_id: selectedProduct.id, quantity },
        { withCredentials: true }
      );
      
      await fetchCartCount();
      toast.success(`Added ${quantity} item(s) to cart!`);
      setShowCartModal(false);
    } catch (error) {
      console.error("Add to Cart Error:", error);
  
      // Optional: log exact backend response
      console.log("Backend said:", error.response?.data);
  
      if (error.response?.status === 400) {
        const msg = error.response?.data?.message || "Stock error. Please reduce quantity.";
        toast.error(msg);
      } else {
        toast.error("Something went wrong. Try again.");
      }
    }
  };
  

  // Sort products by price
  const sortedProducts = [...products].sort((a, b) =>
    sortOrder === "lowToHigh" ? a.price - b.price : b.price - a.price
  );

  return (
    <div className="relative w-full min-h-screen mt-20 max-w-full overflow-x-hidden">
      <Head>
        <title>Products</title>
      </Head>

      <Header />
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Hero Section */}
      <div className="relative w-full h-[7cm] flex flex-col items-center justify-end bg-[#A68F7B]">
        <h1 className="text-white text-4xl font-bold mb-5">Products</h1>
        <img
          src="https://i.ibb.co/6JYgYPSH/Whats-App-Image-2025-03-22-at-10-02-39-AM.jpg"
          alt="Products"
          className="w-[1000px] h-[400px] object-contain mb-[-6cm]"
        />
      </div>

      {/* Filters */}
      <div className="flex justify-center gap-4 my-6 mt-70">
        <select
          className="p-2 border rounded"
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select className="p-2 border rounded" onChange={(e) => setSortOrder(e.target.value)}>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-10">
        {loading ? (
          <p>Loading products...</p>
        ) : sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <div key={product.id} className="p-4 shadow-lg text-center group">
              {/* Image Click for Modal */}
              <div
                className="relative w-full h-[250px] overflow-hidden rounded-lg shadow group"
                onClick={() => openProductDetailsModal(product)}
              >
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:translate-y-[-10px] cursor-pointer"
                />
              </div>

              {/* Product Details */}
              <h3 className="text-lg font-bold mt-2">{product.name}</h3>
              <p className="text-gray-600">${product.price}</p>

              {/* Add to Cart Button */}
              <button
                className="mt-4 bg-[#4A8C8C] text-white px-6 py-2 rounded w-full"
                onClick={() => openCartPopup(product)}
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center">No products found in this category</p>
        )}
      </div>
{/* Product Details Modal */}
{showModal && selectedProduct && (
  <div className="fixed top-0 left-0 w-full h-full z-50 backdrop-blur-sm bg-black/40 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-screen overflow-y-auto flex flex-col items-center relative">
      {/* Close Button (X) */}
      <button 
        className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
        onClick={() => setShowModal(false)}
      >
        &times;
      </button>

      <h2 className="text-xl font-bold mb-4">{selectedProduct.name}</h2>
      <img 
        src={selectedProduct.image} 
        alt={selectedProduct.name} 
        className="w-full max-h-[60vh] object-contain mb-4"
      />
      <p>{selectedProduct.description}</p>
      <p>${selectedProduct.price}</p>
    </div>
  </div>
)}

{/* Cart Modal */}
{showCartModal && selectedProduct && (
  <div className="fixed top-0 left-0 w-full h-full z-50 backdrop-blur-sm bg-black/40 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-screen overflow-y-auto flex flex-col items-center relative">
      {/* Close Button (X) */}
      <button 
        className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
        onClick={() => setShowCartModal(false)}
      >
        &times;
      </button>

      <h2 className="text-xl font-bold mb-4">{selectedProduct.name}</h2>
      <img 
        src={selectedProduct.image} 
        alt={selectedProduct.name} 
        className="w-full max-h-[60vh] object-contain mb-4"
      />
      <p>{selectedProduct.description}</p>
      <p>${selectedProduct.price}</p>

      <div className="flex items-center gap-4 my-4">
        <button 
          className="bg-gray-300 px-4 py-2 rounded-l" 
          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
        >
          -
        </button>
        <span>{quantity}</span>
        <button 
          className="bg-gray-300 px-4 py-2 rounded-r" 
          onClick={() => setQuantity((prev) => prev + 1)}
        >
          +
        </button>
      </div>

      <button 
        className="bg-[#4A8C8C] text-white px-6 py-2 rounded w-full mb-2" 
        onClick={handleAddToCart}
      >
        Confirm
      </button>
    </div>
  </div>
)}


      <Footer />
    </div>
  );
}
