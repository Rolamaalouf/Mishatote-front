"use client"
import { ShoppingBag } from "lucide-react"
import { useCart } from "../../context/CartContext"

export default function CartButton() {
  const { toggleCart, itemCount } = useCart()

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 text-gray-700 hover:text-[#A68F7B] transition-colors"
      aria-label="Open cart"
    >
      <ShoppingBag size={24} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#4A8C8C] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  )
}

