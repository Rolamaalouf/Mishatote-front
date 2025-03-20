"use client"

import { useRouter } from "next/navigation"
import { ToastContainer } from "react-toastify"

export default function EmptyCartState() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#f9f6f2] flex justify-center items-center p-6">
      <ToastContainer position="top-center" autoClose={5000} theme="colored" />
      <div className="max-w-md w-full p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4 text-[#4A8C8C]">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some products to your cart and come back to checkout.</p>
        <button
          onClick={() => router.push("/")}
          className="w-full bg-[#4A8C8C] text-white py-3 rounded-lg text-lg hover:bg-[#3a6f6f]"
        >
          Go and Shop
        </button>
      </div>
    </div>
  )
}

