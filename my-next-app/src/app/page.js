"use client";

import Head from "next/head";
import Header from "@/app/Components/header";
import { useAuth } from '@/context/AuthContext';
import Footer from "@/app/Components/footer";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const parseProductImage = (imageData) => {
    try {
      if (Array.isArray(imageData) && imageData.length > 0) {
        return imageData[0];
      }
      return '';
    } catch (error) {
      console.error("Error parsing image:", error);
      return '';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`, { withCredentials: true });
        const categoryRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { withCredentials: true });
        setProducts(productRes.data);
        setCategories(categoryRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (categoryId) => {
    router.push(`/totes?category=${categoryId}`);
  };

  const handleProductClick = (productId) => {
    router.push(`/totes?modal=${productId}`);
  };

  const latestProducts = [...products].slice(-4).reverse();

  return (
    <div className="relative w-full min-h-screen">
      <div className="relative z-50">
        <Header />
      </div>

      <div className="relative w-full h-screen min-h-[700px]">
  {/* Background Image */}
  <div className="absolute inset-0 -z-10">
    <div
      className="w-full h-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('https://i.ibb.co/ds9Yxb11/Group-5.png')",
      }}
    ></div>
  </div>

  {/* Hero Content */}
  <div className="absolute left-[5%] md:left-20 top-1/2 transform -translate-y-1/2 flex flex-col items-start space-y-6 px-4">
    <h1 className="font-belleza text-[12vw] md:text-[100px] leading-tight text-black">
      Carry your DREAMS <br />
      <span className="whitespace-nowrap">in a tote</span>
    </h1>
    <button
        onClick={() => router.push("/totes")}
        className="px-6 py-3 text-xl md:text-3xl font-semibold bg-[#4A8C8C] text-white rounded-lg cursor-pointer transform transition-transform duration-300 hover:scale-105"
      >
        Collections
      </button>
  </div>
</div>


<div className="relative z-20 w-full flex flex-col items-center text-center">
  <p className="text-[6vw] md:text-[70px] text-black leading-tight max-w-7xl mb-12 md:mb-20 px-4">
    Elevate your style and sustainability with our chic tote bags—perfect for any occasion and designed to carry your essentials with flair!
  </p>

  <div className="relative mt-6 w-full flex items-center px-4 md:px-0">
    <span className="text-[6vw] md:text-[55px] font-semibold text-black ml-[3vw] md:ml-120">Everyday</span>
    <div className="flex-1 h-[10vw] md:h-[146px] bg-[#4A8C8C] flex items-center px-4 md:px-6 ml-2 md:ml-0">
      <span className="text-[6vw] md:text-[55px] font-semibold text-white">or Not</span>
    </div>
  </div>

  <div className="relative mt-6 w-full flex items-center px-4 md:px-0">
    <div className="flex-1 h-[10vw] md:h-[146px] bg-[#4A8C8C] flex items-center justify-end px-4 md:pr-6">
      <span className="text-[6vw] md:text-[55px] font-semibold text-white">Customer</span>
    </div>
    <span className="text-[6vw] md:text-[55px] font-semibold text-black mr-[3vw] md:mr-120 ml-2 md:ml-0">Favorites</span>
  </div>
</div>

 
     { /* Category Boxes */}
<h2 className="text-3xl font-bold text-center mt-20 mb-6">Explore by Category</h2>
<div className="flex flex-wrap justify-center gap-6 px-6">
  {categories.map((category, index) => (
    <div
      key={category.id}
      className={`cursor-pointer rounded-2xl p-6 w-40 h-40 text-white text-center font-semibold shadow-xl hover:scale-[1.15] transition-all duration-300 flex items-center justify-center transform hover:rotate-2 hover:shadow-2xl ${index % 2 === 0 ? 'bg-[#A68F7B]' : 'bg-[#4A8C8C]'}`}
      onClick={() => handleCategoryClick(category.id)}
    >
      <h3 className="text-2xl drop-shadow-lg">{category.name}</h3>
    </div>
  ))}
</div>

{/* Latest Products */}
<h2 className="text-3xl font-bold text-center mt-20 mb-6">Newest</h2>
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6">
  {latestProducts.map((product) => {
    const imageUrl = parseProductImage(product.image);
    return (
      <div
      key={product.id}
      className="cursor-pointer group border-none"
      onClick={() => handleProductClick(product.id)}
    >
      <div className="relative w-full overflow-hidden border-none">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-[220px] object-cover transition-all duration-500 ease-in-out group-hover:h-[400px]"
        />
      </div>
    </div>
    );
  })}
</div>

{user && (
  <div className="absolute top-30 right-0 transform -translate-x-1/2 text-center text-xl font-semibold text-black z-50">
    <p>Welcome back, {user.name}!</p>
  </div>
)}


      <Footer />
    </div>
  );
}