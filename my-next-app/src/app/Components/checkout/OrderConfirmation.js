"use client"

import { useRouter } from "next/navigation"
import { FaHome } from "react-icons/fa"
import { ToastContainer } from "react-toastify"
import ProgressBar from "../ProgressBar"

export default function OrderConfirmation({ orderId }) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#f9f6f2] flex justify-center p-6">
      <ToastContainer position="top-center" autoClose={5000} theme="colored" />
      <div className="max-w-5xl w-full">
        <ProgressBar currentStep="confirmation" />
        <div className="p-8 rounded-lg shadow-lg text-center mt-6">
          <h2 className="text-5xl font-bold mb-6 text-[#4A8C8C]">Your order is currently being prepared with care!</h2>
           <p className="text-3xl text-gray-600 mb-6">Thank you for your purchase!</p>
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center gap-2 mx-auto bg-[#4A8C8C] text-white py-3 px-6 rounded-lg text-lg hover:bg-[#3a6f6f]"
          >
            <FaHome /> Go and see what we have more
          </button>
        </div>
      </div>
    </div>
  )
}

