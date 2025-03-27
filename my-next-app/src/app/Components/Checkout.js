"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { ToastContainer } from "react-toastify"
import { useCart } from "@/context/CartContext" // Add this import
import "react-toastify/dist/ReactToastify.css"

import { fetchCheckoutData } from "./checkout/utils/api"
import { notify } from "./checkout/utils/toast"
import ProgressBar from "./ProgressBar"
import CheckoutForm from "./checkout/CheckoutForm"
import OrderSummary from "./checkout/OrderSummary"
import LoadingState from "./checkout/LoadingState"
import EmptyCartState from "./checkout/EmptyCartState"
import OrderConfirmation from "./checkout/OrderConfirmation"
import BackButton from "./checkout/BackButton"

export default function Checkout() {
  const { user } = useAuth()
  const { checkout } = useCart() // Get checkout function from cart context
  const router = useRouter()
  const [state, setState] = useState({
    paymentMethod: "cod",
    cartItems: [],
    isLoading: true,
    isCartEmpty: false,
    orderPlaced: false,
    address: { phone: "", region: "", "address-direction": "", building: "", floor: "" },
    payment: { cardName: "", cardNumber: "", expDate: "", cvv: "" },
    orderSummary: { subtotal: 0, shipping: 0, total: 0 },
    orderId: null,
  })

  const updateState = (newState) => setState((prev) => ({ ...prev, ...newState }))
  const updateAddress = (newAddress) => updateState({ address: { ...state.address, ...newAddress } })
  const updatePayment = (newPayment) => updateState({ payment: { ...state.payment, ...newPayment } })

  useEffect(() => {
    // No need to check for user here since the parent component already handles that
    fetchCheckoutData()
      .then(({ cartWithDetails, userAddress, shipping, isCartEmpty }) => {
        if (isCartEmpty) {
          return updateState({ isLoading: false, isCartEmpty: true })
        }

        const subtotal = cartWithDetails.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
        updateState({
          cartItems: cartWithDetails,
          address: {
            ...userAddress,
            phone: userAddress.phone || "",
            region: userAddress.region || "",
            "address-direction": userAddress["address-direction"] || "",
            building: userAddress.building || "",
            floor: userAddress.floor || "",
          },
          orderSummary: { subtotal, shipping, total: subtotal + shipping },
          isLoading: false,
        })
      })
      .catch((err) => {
        console.error("Error loading checkout data:", err)
        notify("error", err.response?.data?.error || "Failed to load checkout data. Please try again.")
        updateState({ isLoading: false })
      })
  }, [])
  // Add this function to your Checkout component
     const placeOrder = async () => {
        try {
    // Call the checkout function to clear the cart
        await checkout()
        return true
        } catch (error) {
    console.error("Error clearing cart:", error)
        return false
  }
}

  // Conditional rendering based on state
  if (state.isLoading) return <LoadingState />
  if (state.isCartEmpty) return <EmptyCartState />
  if (state.orderPlaced) return <OrderConfirmation orderId={state.orderId} />

  return (
    <div className="min-h-screen bg-[#f9f6f2] flex justify-center p-6">
      <ToastContainer position="top-center" autoClose={5000} theme="colored" />
      <div className="max-w-5xl w-full">
        <BackButton />
        <ProgressBar currentStep="checkout" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <CheckoutForm
            paymentMethod={state.paymentMethod}
            address={state.address}
            payment={state.payment}
            updateState={updateState}
            updateAddress={updateAddress}
            updatePayment={updatePayment}
            placeOrder={placeOrder} // Pass the placeOrder function
          />
          <OrderSummary cartItems={state.cartItems} orderSummary={state.orderSummary} />
        </div>
      </div>
    </div>
  )
}

