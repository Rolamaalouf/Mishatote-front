"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Link from "next/link"
import { Minus, Plus, X, ShoppingBag, Trash2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function CartPopup({ isOpen, onClose }) {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch cart items with product details
  useEffect(() => {
    const fetchCart = async () => {
      // Only fetch if popup is open and user is logged in
      if (!isOpen || !user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        console.log("Fetching cart from:", `${process.env.NEXT_PUBLIC_API_URL}/cart`)

        // First, get the basic cart items
        const cartResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
          withCredentials: true,
        })

        // Then, for each cart item, get the product details
        const cartItemsWithProducts = await Promise.all(
          cartResponse.data.map(async (item) => {
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

        setCartItems(cartItemsWithProducts || [])
      } catch (err) {
        console.error("Error fetching cart:", err)
        setError("Failed to load cart items.")
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [isOpen, user])

  // Update quantity
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return

    try {
      // Update locally first for better UX
      setCartItems((prevItems) =>
        prevItems.map((item) => (item.product_id === productId ? { ...item, quantity: newQuantity } : item)),
      )

      // Then update on server
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/${productId}`,
        {
          quantity: newQuantity,
        },
        {
          withCredentials: true,
        },
      )
    } catch (err) {
      console.error("Error updating quantity:", err)
    }
  }

  // Remove from cart
  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cart/${productId}`, {
        withCredentials: true,
      })

      // Update local state
      setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== productId))
    } catch (err) {
      console.error("Error removing item:", err)
    }
  }

  // Clear entire cart
  const clearCart = async () => {
    try {
      // Delete items one by one
      const deletePromises = cartItems.map((item) =>
        axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cart/${item.product_id}`, {
          withCredentials: true,
        }),
      )

      // Wait for all delete operations to complete
      await Promise.all(deletePromises)

      // Update local state
      setCartItems([])
    } catch (err) {
      console.error("Error clearing cart:", err)
    }
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.Product?.price || 0
    return sum + price * item.quantity
  }, 0)

  // Format price to 2 decimal places
  const formatPrice = (price) => {
    return (Math.round(price * 100) / 100).toFixed(2)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop - darkened background */}
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

      {/* Cart panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <ShoppingBag className="mr-2" size={20} />
                Your Cart
              </h2>
              <button type="button" className="text-gray-400 hover:text-gray-500" onClick={onClose}>
                <span className="sr-only">Close panel</span>
                <X size={24} aria-hidden="true" />
              </button>
            </div>

            {/* Cart content */}
            <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4A8C8C]"></div>
                </div>
              ) : !user ? (
                <div className="text-center py-8">
                  <p className="mb-4 text-lg">Please log in to view your cart</p>
                  <Link href="/login" className="text-[#4A8C8C] hover:underline font-medium" onClick={onClose}>
                    Log in
                  </Link>
                </div>
              ) : error ? (
                <p className="text-center text-red-500 py-8">{error}</p>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="mb-4 text-lg">Your cart is empty</p>
                  <Link href="/totes" className="text-[#4A8C8C] hover:underline font-medium" onClick={onClose}>
                    Continue shopping
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base font-medium text-gray-900">Cart Items</h3>
                    <button
                      onClick={clearCart}
                      className="flex items-center text-sm text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Clear Cart
                    </button>
                  </div>

                  <div className="flow-root">
                    <ul className="-my-6 divide-y divide-gray-200">
                      {cartItems.map((item) => (
                        <li key={item.product_id} className="py-6 flex">
                          {/* Product Image */}
                          {item.Product?.image && (
                            <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden">
                              <img
                                src={item.Product.image || "/placeholder.svg"}
                                alt={item.Product.name || "Product"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{item.Product?.name || "Product unavailable"}</h3>
                                <p className="ml-4">${formatPrice(item.Product?.price || 0)}</p>
                              </div>
                              {item.Product?.description && (
                                <p className="mt-1 text-sm text-gray-500 line-clamp-1">{item.Product.description}</p>
                              )}
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm">
                              <div className="flex items-center border rounded-md">
                                <button
                                  onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                  className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="px-2 py-1">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                  className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>

                              <div className="flex">
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.product_id)}
                                  className="font-medium text-[#4A8C8C] hover:text-[#3a7070]"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Footer with total and checkout button */}
            {user && cartItems.length > 0 && (
              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                  <p>Subtotal</p>
                  <p>${formatPrice(subtotal)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6 space-y-3">
                  <Link
                    href="/checkout"
                    className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#4A8C8C] hover:bg-[#3a7070] w-full"
                    onClick={onClose}
                  >
                    Checkout
                  </Link>
                  <Link
                    href="/cart"
                    className="flex justify-center items-center px-6 py-3 border border-[#4A8C8C] rounded-md shadow-sm text-base font-medium text-[#4A8C8C] bg-white hover:bg-gray-50 w-full"
                    onClick={onClose}
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

