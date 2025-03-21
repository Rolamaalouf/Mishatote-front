"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const CartContext = createContext(undefined)

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0)

  // Cart visibility functions
  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)
  const toggleCart = () => setIsCartOpen((prev) => !prev)

  // Fetch cart items
  const fetchCart = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if user is logged in
      const token = localStorage.getItem("token")
      if (!token) {
        // Handle guest cart or redirect to login
        setCartItems([])
        setLoading(false)
        return
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setCartItems(response.data)
    } catch (err) {
      console.error("Error fetching cart:", err)
      setError("Failed to load cart items")
    } finally {
      setLoading(false)
    }
  }

  // Add to cart
  const addToCart = async (productId, quantity) => {
    try {
      setLoading(true)

      const token = localStorage.getItem("token")
      if (!token) {
        setError("Please login to add items to cart")
        return
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart`,
        {
          product_id: productId,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Fetch updated cart
      await fetchCart()

      // Open cart when item is added
      openCart()
    } catch (err) {
      console.error("Error adding to cart:", err)
      setError("Failed to add item to cart")
    } finally {
      setLoading(false)
    }
  }

  // Update quantity
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return

    try {
      // Update locally first for better UX
      setCartItems((prevItems) =>
        prevItems.map((item) => (item.product_id === productId ? { ...item, quantity: newQuantity } : item)),
      )

      const token = localStorage.getItem("token")
      if (!token) return

      // Then update on server
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart`,
        {
          product_id: productId,
          quantity: newQuantity - cartItems.find((item) => item.product_id === productId)?.quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
    } catch (err) {
      console.error("Error updating quantity:", err)
      // Revert on failure
      fetchCart()
    }
  }

  // Remove from cart
  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Update local state
      setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== productId))
    } catch (err) {
      console.error("Error removing item:", err)
      fetchCart()
    }
  }

  // Fetch cart on initial load
  useEffect(() => {
    fetchCart()
  }, [])

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        loading,
        error,
        subtotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

