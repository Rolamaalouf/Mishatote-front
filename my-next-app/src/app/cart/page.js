"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X, ArrowLeft, Tag } from "lucide-react"
import Header from "@/app/Components/header"

export default function CartPage() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL); // Debugging line
      try {
        setLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
          withCredentials: true, // Enable credentials
        })

        // Assuming the backend returns cart items with product details
        setCartItems(response.data)

        // For demo purposes, set a discount
        setDiscount(20) // 20% discount
      } catch (err) {
        console.error("Error fetching cart:", err)
        setError("Failed to load cart items")
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [])

  // Update quantity
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return

    try {
      // Update locally first for better UX
      setCartItems((prevItems) =>
        prevItems.map((item) => (item.product_id === productId ? { ...item, quantity: newQuantity } : item)),
      )

      // Then update on server using axios
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart`,
        {
          product_id: productId,
          quantity: newQuantity - cartItems.find((item) => item.product_id === productId)?.quantity,
        },
        {
          withCredentials: true, // Enable credentials
        },
      )
    } catch (err) {
      console.error("Error updating quantity:", err)
      // Revert on failure
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        withCredentials: true, // Enable credentials
      })
      setCartItems(response.data)
    }
  }

  // Remove from cart
  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cart/${productId}`, {
        withCredentials: true, // Enable credentials
      })

      // Update local state
      setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== productId))
    } catch (err) {
      console.error("Error removing item:", err)
    }
  }

  // Apply promo code
  const applyPromoCode = () => {
    // This would typically validate with the backend
    // For demo purposes, we'll just show an alert
    alert(`Promo code "${promoCode}" applied!`)
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)
  const discountAmount = (subtotal * discount) / 100
  const deliveryFee = 3
  const total = subtotal - discountAmount + deliveryFee

  // Mock data for demonstration
  const mockCartItems = [
    {
      id: 1,
      product_id: 1,
      user_id: 1,
      quantity: 2,
      product: {
        id: 1,
        name: "tote",
        price: 10,
        image: "/placeholder.svg?height=100&width=100",
        size: "Large",
        color: "black",
      },
    },
    {
      id: 2,
      product_id: 2,
      user_id: 1,
      quantity: 1,
      product: {
        id: 2,
        name: "tote",
        price: 10,
        image: "/placeholder.svg?height=100&width=100",
        size: "Medium",
        color: "white",
      },
    },
    {
      id: 3,
      product_id: 3,
      user_id: 1,
      quantity: 1,
      product: {
        id: 3,
        name: "tote",
        price: 10,
        image: "/placeholder.svg?height=100&width=100",
        size: "Large",
        color: "beige",
      },
    },
    {
      id: 4,
      product_id: 4,
      user_id: 1,
      quantity: 1,
      product: {
        id: 4,
        name: "tote",
        price: 10,
        image: "/placeholder.svg?height=100&width=100",
        size: "Large",
        color: "beige",
      },
    },
    {
      id: 5,
      product_id: 5,
      user_id: 1,
      quantity: 1,
      product: {
        id: 5,
        name: "Skinny Fit Jeans",
        price: 10,
        image: "/placeholder.svg?height=100&width=100",
        size: "Large",
        color: "beige",
      },
    },
  ]

  // Use mock data for demonstration
  const displayItems = cartItems.length > 0 ? cartItems : mockCartItems
  const displaySubtotal = subtotal > 0 ? subtotal : 50
  const displayDiscount = discountAmount > 0 ? discountAmount : 10
  const displayTotal = total > 0 ? total : 43

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Component */}
      <Header />

      {/* Page Title Banner */}
      <div className="bg-[#A68F7B] h-[30vh] flex items-center justify-center mt-20">
        <h1 className="text-white text-5xl sm:text-6xl font-bold text-center">Your Cart</h1>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 -mt-10">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-gray-600 mb-6 bg-white px-4 py-2 rounded-lg shadow-sm">
          <ArrowLeft size={16} className="mr-2" />
          <span>Continue Shopping</span>
        </Link>

        {/* Checkout Progress */}
        <div className="mb-10 mt-6">
          <div className="flex justify-between items-center relative">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-[#4A8C8C] flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-sm mt-1 text-[#4A8C8C] font-medium">Cart</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
              <span className="text-sm mt-1 text-gray-500">Checkout</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
              <span className="text-sm mt-1 text-gray-500">Confirmation</span>
            </div>
            <div className="absolute top-3 left-0 right-0 h-[1px] bg-gray-200 -z-10"></div>
          </div>
        </div>

        {/* Cart Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 bg-white rounded-lg p-6 shadow-lg">
            {loading ? (
              <p className="text-center py-8">Loading your cart...</p>
            ) : error ? (
              <p className="text-center text-red-500 py-8">{error}</p>
            ) : displayItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="mb-4 text-lg">Your cart is empty</p>
                <Link href="/products" className="text-[#4A8C8C] hover:underline font-medium">
                  Continue shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {displayItems.map((item) => (
                  <div key={item.id} className="flex items-center border-b pb-6">
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-gray-700 font-medium">{item.product.name}</h3>
                          <p className="text-gray-500 text-sm">Size: {item.product.size}</p>
                          <p className="text-gray-500 text-sm">Color: {item.product.color}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-3 py-1">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <span className="font-medium">${item.product.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${displaySubtotal}</span>
                </div>
                <div className="flex justify-between text-red-500">
                  <span>Discount ({discount}%)</span>
                  <span>-${displayDiscount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">${deliveryFee}</span>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span>${displayTotal}</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mt-6 flex items-center">
                  <div className="flex items-center border rounded-l-md px-3 py-2 bg-gray-50 flex-grow">
                    <Tag size={16} className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      placeholder="Add promo code"
                      className="bg-transparent outline-none w-full"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={applyPromoCode}
                    className="bg-white border border-l-0 rounded-r-md px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    Apply
                  </button>
                </div>

                {/* Checkout Button */}
                <button className="w-full bg-[#4A8C8C] text-white py-3 rounded-md hover:bg-[#3a7070] transition mt-6 font-medium text-lg">
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

