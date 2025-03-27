"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  const fetchCart = async () => {
    //Don't fetch if there's no API URL configured
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("API URL not configured")
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        withCredentials: true,
      })

      // Calculate cart count
      const count = response.data.reduce((sum, item) => sum + item.quantity, 0)
      setCartCount(count)
      setCartItems(response.data)
    } catch (err) {
      console.error("Error fetching cart:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const addToCart = async (productId, quantity = 1) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart`,
        {
          product_id: productId,
          quantity,
        },
        {
          withCredentials: true,
        },
      )

      // Refresh cart after adding
      fetchCart()
      return true
    } catch (err) {
      console.error("Error adding to cart:", err)
      return false
    }
  }

  const updateCartItem = async (productId, quantity) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/${productId}`,
        {
          quantity,
        },
        {
          withCredentials: true,
        },
      )

      // Refresh cart after updating
      fetchCart()
      return true
    } catch (err) {
      console.error("Error updating cart item:", err)
      return false
    }
  }

  const removeCartItem = async (productId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cart/${productId}`, {
        withCredentials: true,
      })

      // Refresh cart after removing
      fetchCart()
      return true
    } catch (err) {
      console.error("Error removing cart item:", err)
      return false
    }
  }

  const clearCart = async () => {
    try {
      // Delete items one by one
      const deletePromises = cartItems.map(item => 
        axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cart/${item.product_id}`, {
          withCredentials: true,
        })
      )
   
      
      // Wait for all delete operations to complete
      await Promise.all(deletePromises)
      
      // Update local state
      setCartItems([])
      setCartCount(0)
      return true
    } catch (err) {
      console.error("Error clearing cart:", err)
      return false
    }
  }
  const checkout = async () => {
    try {
      // Here you would normally make an API call to process the checkout
      // For example:
      // await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {}, { withCredentials: true })
      
      // After successful checkout, clear the cart
      setCartItems([])
      setCartCount(0)
      
      return true
    } catch (err) {
      console.error("Error during checkout:", err)
      return false
    }
  }

  const value = {
    cartItems,
    cartCount,
    loading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    checkout, // Now this will be defined
    isCartOpen,
    toggleCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)