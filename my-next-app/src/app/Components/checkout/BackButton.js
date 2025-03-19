"use client"

import { useRouter } from "next/navigation"
import { FaArrowLeft } from "react-icons/fa"

export default function BackButton() {
  const router = useRouter()

  return (
    <div className="flex items-center gap-2 mb-4 cursor-pointer text-[#4A8C8C]" onClick={() => router.push("/cart")}>
      <FaArrowLeft className="text-lg" />
      <span className="text-sm font-medium">Back to Cart</span>
    </div>
  )
}

