"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Link from "next/link"
import { Minus, Plus, X, ArrowLeft, Trash2 } from "lucide-react"
import Header from "@/app/Components/header"
import ContinueShopping from "@/app/Components/ContinueShopping"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext" 

export default function CartPage() {
  const { user } = useAuth()
  const { setCartCount } = useCart() 

  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const updateCartCount = (items) => {
    const total = items.reduce((sum, i) => sum + i.quantity, 0)
    setCartCount(total)
  }

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setLoading(false)
        return
      }
      try {
        setLoading(true)

        const cartResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
          withCredentials: true,
        })

        const cartItemsWithProducts = await Promise.all(
          cartResponse.data.map(async (item) => {
            try {
              const productResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/products/${item.product_id}`,
                { withCredentials: true }
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
          })
        )

        setCartItems(cartItemsWithProducts || [])
        updateCartCount(cartItemsWithProducts || []) 
      } catch (err) {
        console.error("Error fetching cart:", err)
        setError("Failed to load cart items. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [user])

  //  UPDATE QUANTITY
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return

    const item = cartItems.find((item) => item.product_id === productId)
    const stock = item?.Product?.stock ?? 0

    if (newQuantity > stock) {
      alert(`Only ${stock} item(s) available in stock.`)
      return
    }

    try {
      const updated = cartItems.map((item) =>
        item.product_id === productId ? { ...item, quantity: newQuantity } : item
      )
      setCartItems(updated)
      updateCartCount(updated) 

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/${productId}`,
        { quantity: newQuantity },
        { withCredentials: true }
      )
    } catch (err) {
      console.error("Error updating quantity:", err)
    }
  }

  // REMOVE
  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cart/${productId}`, {
        withCredentials: true,
      })

      const updated = cartItems.filter((item) => item.product_id !== productId)
      setCartItems(updated)
      updateCartCount(updated) 
    } catch (err) {
      console.error("Error removing item:", err)
    }
  }

  // CLEAR
  const clearCart = async () => {
    try {
      const deletePromises = cartItems.map((item) =>
        axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cart/${item.product_id}`, {
          withCredentials: true,
        })
      )
      await Promise.all(deletePromises)
      setCartItems([])
      setCartCount(0) // 
    } catch (err) {
      console.error("Error clearing cart:", err)
    }
  }

  //  ALL REMAINING CODE (HTML + JSX) CAN STAY THE SAME

// More efficient approach using your existing endpoint
/*const clearCart = async () => {
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cart/clear`, {
      withCredentials: true,
    })
    
    // Update local state
    setCartItems([])
  } catch (err) {
    console.error("Error clearing cart:", err)
  }
}*/

  
  const displayItems = cartItems;
  const displaySubtotal = cartItems.reduce((sum, item) => {
    const price = item.Product?.price || 0;
    return sum + price * item.quantity;
  }, 0);
  const displayTotal = displaySubtotal;
 
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
        <div className="inline-flex items-center text-gray-600 mb-6 bg-white px-4 py-2 rounded-lg shadow-sm">
          <ArrowLeft size={16} className="mr-2" />
          <ContinueShopping />
        </div>

        {/* Cart Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 bg-white rounded-lg p-6 shadow-lg">
          {loading ? (
             <p className="text-center py-8">Loading your cart...</p>
          ) : !user ? (
            <div className="text-center py-8">
              <p className="mb-4 text-lg">Please log in to view your cart</p>
              <Link href="/login" className="text-[#4A8C8C] hover:underline font-medium">
                Log in
              </Link>
            </div>
            ) : error ? (
              <p className="text-center text-red-500 py-8">{error}</p>
            ) : displayItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="mb-4 text-lg">Your cart is empty</p>
                <Link href="/totes">
                <button className="text-[#4A8C8C] hover:underline font-medium">
                Continue shopping
                </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b">
                  <h2 className="text-xl font-semibold">Cart Items</h2>
              <button 
                onClick={clearCart}
                className="flex items-center text-red-500 hover:text-red-700 transition-colors"
              >
              <Trash2 size={16} className="mr-1" />
              Clear Cart
              </button>
              </div>
                
                {displayItems.map((item) => (
                  <div key={item.product_id} className="flex items-center border-b pb-6">
                     {/* Product Image */}
                     {item.Product?.image && (
                      <div className="w-20 h-20 flex-shrink-0 mr-4">
                        <img
                          src={item.Product.image || "/placeholder.svg"}
                          alt={item.Product.name || "Product"}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                    )}
                    
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-gray-700 font-medium">
                            {item.Product?.name || "Product name unavailable"}
                          </h3>
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
                        <span className="font-medium">
                          ${item.Product?.price || "0.00"}
                        </span>
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
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span>${displayTotal}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link href='/checkout'>
                <button className="w-full bg-[#4A8C8C] text-white py-3 rounded-md hover:bg-[#3a7070] transition mt-6 font-medium text-lg">
                  Checkout
                </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
