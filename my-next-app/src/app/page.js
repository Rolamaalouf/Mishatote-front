'use client';

// pages/index.js (Home Component)
import Head from "next/head";
import Header from "@/Components/header";
import { useAuth } from '@/context/AuthContext';  // Import the AuthContext

export default function Home() {
  const { user } = useAuth();  // Get the user from context

  return (
    <div className="relative w-full" style={{ maxWidth: "1600px", margin: "0 auto" }}>
      <Head>
        <title>Tote Shop</title>
      </Head>

      {/* Header */}
      <Header />

      {/* Hero Section with Background - Using the original structure */}
      <div className="relative w-full h-screen mb-150"> {/* Added margin bottom to create more space */}
        {/* Cover Image as Background - Using original aspect ratio approach */}
        <div className="absolute inset-0 -z-10 aspect-[4/3]">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('https://i.ibb.co/PGvyV6vv/Group-1-2.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        </div>

        {/* Hero Content */}
        <div className="absolute top-1/3 left-20 max-w-lg">
          <h1 className="font-belleza text-[110px] leading-tight text-black">
            Carry your <br /> dreams in a <br /> tote
          </h1>
          <button className="mt-6 px-8 py-3 text-lg font-semibold bg-[#4A8C8C] text-white rounded">
            Collections
          </button>
        </div>
      </div>

      {/* New Section Below Background - Now with more separation from the hero section */}
      <div className="w-full flex flex-col items-center text-center mt-32"> {/* Increased top margin */}
        <p className="text-[70px] font-semibold text-black leading-tight max-w-8xl">
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