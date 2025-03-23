"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X, ShoppingBag } from "lucide-react"
import { useCart } from "../context/CartContext"

export default function PopupCart() {
  const { cartItems, isCartOpen, closeCart, updateQuantity, removeFromCart, loading, error, subtotal, itemCount } =
    useCart()

  // Close cart when pressing escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeCart()
    }

    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [closeCart])

  // Prevent scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isCartOpen])

  if (!isCartOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity" onClick={closeCart} />

      {/* Cart Panel */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-[#A68F7B] text-white">
          <h2 className="text-xl font-bold flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Your Cart ({itemCount})
          </h2>
          <button onClick={closeCart} className="p-1 rounded-full hover:bg-[#8a7665] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-grow overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#A68F7B]"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <ShoppingBag size={48} className="mb-4 text-gray-300" />
              <p className="mb-4">Your cart is empty</p>
              <button onClick={closeCart} className="text-[#4A8C8C] hover:underline">
                Continue shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex border-b pb-4">
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    <Image
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3 flex-grow">
                    <div className="flex justify-between">
                      <h3 className="text-gray-700 font-medium text-sm">{item.product.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    {item.product.size && <p className="text-gray-500 text-xs">Size: {item.product.size}</p>}
                    {item.product.color && <p className="text-gray-500 text-xs">Color: {item.product.color}</p>}
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 py-1 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="font-medium text-sm">${item.product.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          {cartItems.length > 0 && (
            <>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">Shipping and taxes calculated at checkout</p>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/cart"
                  className="py-2 px-4 border border-[#A68F7B] text-[#A68F7B] rounded-md text-center font-medium hover:bg-[#f8f5f2] transition-colors"
                  onClick={closeCart}
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  className="py-2 px-4 bg-[#4A8C8C] text-white rounded-md text-center font-medium hover:bg-[#3a7070] transition-colors"
                  onClick={closeCart}
                >
                  Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

