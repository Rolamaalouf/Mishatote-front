'use client';

// pages/index.js (Home Component)
import Head from "next/head";
import Header from "@/Components/header";
import { useAuth } from '@/context/AuthContext';  // Import the AuthContext

export default function Home() {
  const { user } = useAuth();  // Get the user from context

  return (
<div className="relative w-full min-h-screen">
  <div className="relative z-50">
    <Header />
  </div>

  {/* Hero Section with Background */}
  <div className="relative w-full h-screen mb-120">
    {/* Background Image as Cover */}
    <div className="absolute inset-0 -z-10">
  <div
    className="w-full h-screen min-h-screen bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: "url('https://i.ibb.co/gMq6XGrT/Group-2-1.png')",
      height: "150vh", // Ensures full viewport height
      minHeight: "700px", // Fallback for smaller screens
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  ></div>
</div>


    {/* Hero Content - Placed on Top of Image */}
    <div className="absolute top-4/4 left-20 transform -translate-y-1/2 flex flex-col items-center space-y-6">
  <h1 className="font-belleza text-[10vw] md:text-[110px] leading-tight text-black">
    Carry your <br /> DREAMS <br/>  
    <span className="whitespace-nowrap">in a tote</span>
  </h1>
  <button className="mr-50 px-10 py-4 text-3xl font-semibold bg-[#4A8C8C] text-white rounded">
    Collections
  </button>
</div>

  </div>



      {/* New Section Below Background */}
      <div className="relative z-20 w-full flex flex-col items-center text-center">
        <p className="text-[70px] text-black leading-tight max-w-8xl mb-20">
          Elevate your style and sustainability with our chic tote bags—perfect for any occasion and designed to carry your essentials with flair!
        </p>

        {/* Rectangle with Text - Positioned to touch right border */}
        <div className="relative mt-6 w-full flex justify-between items-center">
          <span className="text-[55px] font-semibold text-black ml-120">Everyday</span>
          
          {/* Rectangle that touches right border with "or Not" at left edge */}
          <div className="relative h-[146px] bg-[#4A8C8C] flex items-center" style={{ width: "calc(100% - 700px)" }}>
            <span className="text-[55px] font-semibold text-white ml-6">or Not</span>
          </div>
        </div>

        {/* Two Rectangles - Left (Customer Favorites) & Right (Everyday or Not) */}
        <div className="relative mt-6 w-full flex justify-between items-center">
          <div className="relative h-[146px] bg-[#4A8C8C] flex items-center justify-end pr-6" style={{ width: "calc(100% - 700px)" }}>
            <span className="text-[55px] font-semibold text-white">Customer</span>
          </div>

          {/* Right Rectangle - Everyday or Not */}
          <div className="flex items-center">
            <span className="text-[55px] font-semibold text-black mr-120">Favorites</span>
          </div>
        </div>
      </div>

      {/* Display Welcome Message if User is Logged In */}
      {user && (
        <div className="text-center mt-12 mb-6 text-xl font-semibold text-black">
          <p>Welcome back, {user.name}!</p>
        </div>
      )}
    </div>
  );
}
