"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Link from "next/link"
import Image from "next/image"
import { X, ShoppingCart, Minus, Plus } from "lucide-react"
import { useCart } from "../../context/CartContext"

export default function PopupCart({ isOpen, onClose }) {
  const { cartItems, fetchCart, updateCartItem, removeCartItem } = useCart()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [localCartItems, setLocalCartItems] = useState([])

  // Fetch cart items with product details when opened
  useEffect(() => {
    const getCartWithProducts = async () => {
      if (!isOpen) return // Only fetch when cart is open

      try {
        setLoading(true)

        // Fetch product details for each cart item
        const cartItemsWithProducts = await Promise.all(
          cartItems.map(async (item) => {
            try {
              const productResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/products/${item.product_id}`,
                { withCredentials: true },
              )
              return {
                ...item,
                Product: productResponse.data,
                subtotal: productResponse.data.price * item.quantity,
              }
            } catch (err) {
              console.error(`Error fetching product ${item.product_id}:`, err)
              return {
                ...item,
                Product: null,
                subtotal: 0,
              }
            }
          }),
        )

        setLocalCartItems(cartItemsWithProducts || [])
      } catch (err) {
        console.error("Error fetching cart:", err)
        setError("Failed to load cart items")
      } finally {
        setLoading(false)
      }
    }

    getCartWithProducts()
  }, [isOpen, cartItems])

  // Update quantity
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return

    try {
      // Update locally first for better UX
      setLocalCartItems((prevItems) =>
        prevItems.map((item) => (item.product_id === productId ? { ...item, quantity: newQuantity } : item)),
      )

      // Then update on server
      await updateCartItem(productId, newQuantity)
    } catch (err) {
      console.error("Error updating quantity:", err)
    }
  }

  // Remove from cart
  const handleRemoveFromCart = async (productId) => {
    try {
      // Update local state first for better UX
      setLocalCartItems((prevItems) => prevItems.filter((item) => item.product_id !== productId))

      // Then remove on server
      await removeCartItem(productId)
    } catch (err) {
      console.error("Error removing item:", err)
    }
  }

  // Calculate total
  const subtotal = localCartItems.reduce((sum, item) => {
    const price = item.Product?.price || 0
    return sum + price * item.quantity
  }, 0)

  // Format price
  const formatPrice = (price) => {
    return (Math.round(price * 100) / 100).toFixed(2)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Cart panel */}
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <ShoppingCart className="mr-2" size={20} />
            Your Cart
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* Cart content */}
        <div className="flex flex-col h-[calc(100%-8rem)]">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <p>Loading your cart...</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : localCartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <ShoppingCart size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
              <Link href="/totes" className="text-[#4A8C8C] hover:underline" onClick={onClose}>
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4">
              {localCartItems.map((item) => (
                <div key={item.product_id} className="flex py-4 border-b">
                  {item.Product?.image && (
                    <div className="w-16 h-16 mr-4 flex-shrink-0">
                      <Image
                        src={item.Product.image || "/placeholder.svg"}
                        alt={item.Product.name || "Product"}
                        width={64}
                        height={64}
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.Product?.name || "Product unavailable"}</h3>
                      <button
                        onClick={() => handleRemoveFromCart(item.product_id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2 py-1 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-medium text-sm">
                        ${formatPrice((item.Product?.price || 0) * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with total and buttons */}
        <div className="border-t p-4 bg-gray-50">
          {localCartItems.length > 0 && (
            <>
              <div className="flex justify-between mb-4">
                <span className="font-medium">Subtotal:</span>
                <span className="font-bold">${formatPrice(subtotal)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/cart"
                  className="bg-white border border-[#4A8C8C] text-[#4A8C8C] py-2 px-4 rounded text-center hover:bg-gray-50"
                  onClick={onClose}
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  className="bg-[#4A8C8C] text-white py-2 px-4 rounded text-center hover:bg-[#3a7070]"
                  onClick={onClose}
                >
                  Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

