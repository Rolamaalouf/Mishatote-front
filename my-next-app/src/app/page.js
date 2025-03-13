'use client';

// pages/index.js (Home Component)
import Head from "next/head";
import Header from "@/Components/header";
import { useAuth } from '@/context/AuthContext';  // Import the AuthContext


export default function Home() {
  const { user } = useAuth();  // Get the user from context

  return (
    <div className="relative w-full h-screen">
      <Head>
        <title>Tote Shop</title>
      </Head>

      {/* Header */}
      <Header />

      {/* Cover Image as Background */}
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

      {/* Display Welcome Message if User is Logged In */}
      {user && (
        <div className="absolute bottom-10 left-20 text-xl font-semibold text-black">
          <p>Welcome back, {user.name}!</p>
        </div>
      )}
    </div>
  );
}
