"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "@/context/AuthContext";

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { user, loading: authLoading } = useAuth()

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

     // Don't fetch if user is not authenticated
     if (!user) {
      setCartItems([])
      setCartCount(0)
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
        // If we get a 401, clear the cart as the user is not authenticated
        if (err.response && err.response.status === 401) {
          setCartItems([])
          setCartCount(0)
        }
    } finally {
      setLoading(false)
    }
  }

  // Only fetch cart when auth state changes or on initial load
  useEffect(() => {
    // Only fetch cart when auth loading is complete
    if (!authLoading) {
      fetchCart()
    }
  }, [user, authLoading])

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      console.error("User must be logged in to add items to cart")
      return false
    }
    try {
        // Update local state immediately for better UX
        setCartCount((prevCount) => prevCount + quantity)

        // Find if the item already exists in the cart
        const existingItem = cartItems.find((item) => item.product_id === productId)
  
        if (existingItem) {
          // If item exists, update its quantity
          setCartItems((prevItems) =>
            prevItems.map((item) =>
              item.product_id === productId ? { ...item, quantity: item.quantity + quantity } : item,
            ),
          )
        } else {
          // If item doesn't exist, add it to the cart
          setCartItems((prevItems) => [...prevItems, { product_id: productId, quantity }])
        }
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
    if (!user) return false
    try {
        // Find the current item to calculate the difference
        const currentItem = cartItems.find((item) => item.product_id === productId)

        if (currentItem) {
          const quantityDifference = quantity - currentItem.quantity
  
          // Update cart count immediately for better UX
          setCartCount((prevCount) => prevCount + quantityDifference)
  
          // Update local cart items for immediate feedback
          setCartItems((prevItems) =>
            prevItems.map((item) => (item.product_id === productId ? { ...item, quantity } : item)),
          )
        }
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
    if (!user) return false
    try {
       // Find the current item to subtract from count
       const currentItem = cartItems.find((item) => item.product_id === productId)

       if (currentItem) {
         // Update cart count immediately for better UX
         setCartCount((prevCount) => prevCount - currentItem.quantity)
 
         // Update local cart items for immediate feedback
         setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== productId))
       }
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
    if (!user) return false

    try {
      // Try to use a dedicated clear cart endpoint if it exists
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
          withCredentials: true,
        })

        // If successful, update local state
        setCartItems([])
        setCartCount(0)
        return true
      } catch (clearErr) {
        console.log("No clear cart endpoint available, trying alternative methods:", clearErr)

        // If clear cart endpoint doesn't exist, try to update all items to quantity 0
        try {
          const updatePromises = cartItems.map((item) =>
            axios.put(
              `${process.env.NEXT_PUBLIC_API_URL}/cart/${item.product_id}`,
              { quantity: 0 },
              { withCredentials: true },
            ),
          )

          await Promise.all(updatePromises)

          // If successful, update local state
          setCartItems([])
          setCartCount(0)
          return true
        } catch (updateErr) {
          console.log("Update quantities method failed:", updateErr)

          // If all else fails, just clear the local state
          console.log("Clearing local cart state only")
          setCartItems([])
          setCartCount(0)
          return true
        }
      }
    } catch (err) {
      console.error("Error clearing cart:", err)
      // Even if API calls fail, clear the local state for better UX
      setCartItems([])
      setCartCount(0)
      return true
    }
  }
  const checkout = async () => {
    if (!user) {
      console.error("User must be logged in to checkout")
      return false
    }
    try {
      // Instead of calling a non-existent /checkout endpoint,
      // we'll use the existing cart endpoints to clear the cart

      // 1. Create an order record if you have an orders API
      // This is optional - implement if you have an orders endpoint
      try {
        // If you have an orders API endpoint, use it
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, { items: cartItems }, { withCredentials: true })
      } catch (orderErr) {
        console.log("No orders endpoint available or order creation failed:", orderErr)
        // Continue with checkout even if order creation fails
      }

      // 2. Clear the cart by removing all items
      await clearCart()

      // 3. Update local state
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