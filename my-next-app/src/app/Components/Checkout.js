"use client"

import { useEffect, useState } from "react"
import { FaCreditCard, FaMoneyBillWave, FaArrowLeft, FaHome } from "react-icons/fa"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useAuth } from "@/context/AuthContext"
import ProgressBar from "@/app/Components/ProgressBar"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function Checkout() {
  const { user } = useAuth()
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

  const { paymentMethod, cartItems, address, payment, orderSummary, isLoading, isCartEmpty, orderPlaced, orderId } =
    state
  const updateState = (newState) => setState((prev) => ({ ...prev, ...newState }))
  const updateAddress = (newAddress) => updateState({ address: { ...address, ...newAddress } })
  const updatePayment = (newPayment) => updateState({ payment: { ...payment, ...newPayment } })

  // Improved toast notification with consistent styling
  const notify = (type, message) =>
    toast[type](message, {
      position: "top-center",
      autoClose: type === "error" ? 5000 : 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    })

  useEffect(() => {
    if (!user) return router.push("/login?redirect=/checkout")

    const fetchData = async () => {
      try {
        const [shippingRes, userRes, cartRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/shipping`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, { withCredentials: true }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart`, { withCredentials: true }),
        ])

        const shipping = shippingRes.data.delivery_fee || 0
        const userAddress = userRes.data.user?.address || {}
        const cart = cartRes.data || []

        if (cart.length === 0) return updateState({ isLoading: false, isCartEmpty: true })

        const cartWithDetails = await Promise.all(
          cart.map(async (item) => {
            try {
              const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${item.product_id}`)
              return { ...item, name: data.name, price: data.price, image: data.image?.[0] || "/placeholder.jpg" }
            } catch (err) {
              console.error(`Error fetching product ${item.product_id}:`, err)
              return { ...item, name: "Product unavailable", price: 0, image: "/placeholder.jpg" }
            }
          }),
        )

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
      } catch (err) {
        console.error("Error loading checkout data:", err)
        notify("error", err.response?.data?.error || "Failed to load checkout data. Please try again.")
        updateState({ isLoading: false })
      }
    }
    fetchData()
  }, [user, router])

  // Separated validation functions for address and payment
  const validateAddress = () => {
    const addressFields = [
      {
        key: "phone",
        label: "Phone number",
        regex: /^\+[0-9]{10,15}$/,
        errorMessages: {
          empty: "Phone number is required",
          invalid: "Phone number must start with + and contain 10-15 digits",
        },
      },
      { key: "region", label: "Region", errorMessages: { empty: "Please select your region" } },
      {
        key: "address-direction",
        label: "Address directions",
        errorMessages: { empty: "Please provide detailed address directions for delivery" },
      },
      { key: "building", label: "Building", errorMessages: { empty: "Building name/number is required for delivery" } },
      {
        key: "floor",
        label: "Floor number",
        regex: /^[0-9]{1,3}$/,
        errorMessages: { empty: "Floor number is required", invalid: "Floor number must be a valid number (1-999)" },
      },
    ]

    let isValid = true
    let allEmpty = true

    for (const field of addressFields) {
      if (!address[field.key]) {
        allEmpty = allEmpty && true
        isValid = false
      } else {
        allEmpty = false
      }

      if (field.regex && address[field.key] && !field.regex.test(address[field.key])) {
        notify("error", field.errorMessages.invalid)
        return false // Return early on first validation error for better UX
      }
    }

    if (allEmpty) {
      notify("error", "Please add your address details.")
      return false
    }

    return isValid
  }

  // Separate validation for payment information
  const validatePayment = () => {
    // Skip validation if not using PayTabs
    if (paymentMethod !== "paytab") return true

    const paymentFields = [
      { key: "cardName", label: "Card name", errorMessages: { empty: "Cardholder name is required" } },
      {
        key: "cardNumber",
        label: "Card number",
        regex: /^[0-9]{16}$/,
        errorMessages: {
          empty: "Card number is required",
          invalid: "Card number must be 16 digits with no spaces or dashes",
        },
      },
      {
        key: "expDate",
        label: "Expiration date",
        regex: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
        errorMessages: {
          empty: "Card expiration date is required",
          invalid: "Expiration date must be in MM/YY format (e.g., 05/25)",
        },
      },
      {
        key: "cvv",
        label: "CVV",
        regex: /^[0-9]{3,4}$/,
        errorMessages: {
          empty: "Security code (CVV) is required",
          invalid: "CVV must be 3-4 digits found on the back of your card",
        },
      },
    ]

    let isValid = true
    let allEmpty = true

    for (const field of paymentFields) {
      if (!payment[field.key]) {
        allEmpty = allEmpty && true
        isValid = false
      } else {
        allEmpty = false
      }

      if (field.regex && payment[field.key] && !field.regex.test(payment[field.key])) {
        notify("error", field.errorMessages.invalid)
        return false // Return early on first validation error for better UX
      }
    }

    if (allEmpty) {
      notify("error", "Please add your payment details.")
      return false
    }

    return isValid
  }

  const handleCheckout = async () => {
    try {
      // First validate address - required for both payment methods
      if (!validateAddress()) return

      // Only validate payment if using PayTabs
      if (paymentMethod === "paytab" && !validatePayment()) return

      updateState({ isLoading: true })
 
      const payload = {
        address,
        paymentMethod, 
        ...(paymentMethod === "paytab"
          ? {
              payment: {
                cardName: payment.cardName,
                lastFour: payment.cardNumber.slice(-4),
              },
            }
          : {}),
      }

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders/checkout`, payload, {
        withCredentials: true,
      })

      if (res.status === 201) {
        updateState({ orderPlaced: true, orderId: res.data.order_id, isLoading: false })
        notify("success", "Your order has been placed successfully!")
      }
    } catch (err) {
      updateState({ isLoading: false })
      notify("error", err.response?.data?.error || "Failed to place your order. Please try again.")
      console.error("Checkout error:", err)
    }
  }

  // Render loading state
  if (isLoading)
    return (
      <div className="min-h-screen bg-[#f9f6f2] flex justify-center items-center">
        <ToastContainer position="top-center" autoClose={5000} theme="colored" />
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#4A8C8C] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#4A8C8C] font-medium">Loading...</p>
        </div>
      </div>
    )

  // Render empty cart state
  if (isCartEmpty)
    return (
      <div className="min-h-screen bg-[#f9f6f2] flex justify-center items-center p-6">
        <ToastContainer position="top-center" autoClose={5000} theme="colored" />
        <div className="max-w-md w-full  p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4 text-[#4A8C8C]">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to your cart and come back to checkout.</p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-[#4A8C8C] text-white py-3 rounded-lg text-lg hover:bg-[#3a6f6f]"
          >
            Go and Shop
          </button>
        </div>
      </div>
    )

  // Render order confirmation
  if (orderPlaced)
    return (
      <div className="min-h-screen bg-[#f9f6f2] flex justify-center p-6">
        <ToastContainer position="top-center" autoClose={5000} theme="colored" />
        <div className="max-w-5xl w-full">
          <ProgressBar currentStep="confirmation" />
          <div className=" p-8 rounded-lg shadow-lg text-center mt-6">
            <h2 className="text-3xl font-bold mb-6 text-[#4A8C8C]">
              Your order is currently being prepared with care!
            </h2>
            <p className="text-gray-600 mb-2">Order ID: #{orderId}</p>
            <p className="text-gray-600 mb-6">Thank you for your purchase!</p>
            <button
              onClick={() => router.push("/")}
              className="flex items-center justify-center gap-2 mx-auto bg-[#4A8C8C] text-white py-3 px-6 rounded-lg text-lg hover:bg-[#3a6f6f]"
            >
              <FaHome /> Go and see what we have more
            </button>
          </div>
        </div>
      </div>
    )

  // Main checkout form
  return (
    <div className="min-h-screen bg-[#f9f6f2] flex justify-center p-6">
      <ToastContainer position="top-center" autoClose={5000} theme="colored" />
      <div className="max-w-5xl w-full">
        <div
          className="flex items-center gap-2 mb-4 cursor-pointer text-[#4A8C8C]"
          onClick={() => router.push("/cart")}
        >
          <FaArrowLeft className="text-lg" />
          <span className="text-sm font-medium">Back to Cart</span>
        </div>
        <ProgressBar currentStep="checkout" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {/* Payment Method Selection */}
            <h2 className="text-lg font-semibold mb-4">Payment method</h2>
            <div className="flex gap-4 mb-6">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border w-full ${paymentMethod === "cod" ? "bg-[#4A8C8C] text-white" : "bg-gray-100"}`}
                onClick={() => updateState({ paymentMethod: "cod" })}
              >
                <FaMoneyBillWave /> Cash on Delivery
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border w-full ${paymentMethod === "paytab" ? "bg-[#4A8C8C] text-white" : "bg-gray-100"}`}
                onClick={() => updateState({ paymentMethod: "paytab" })}
              >
                <FaCreditCard /> PayTabs
              </button>
            </div>

            {/* Payment Form - Only shown for PayTabs */}
            {paymentMethod === "paytab" && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Card Information</h3>
                <input
                  type="text"
                  className="w-full border p-2 rounded mb-2"
                  placeholder="Card Name"
                  value={payment.cardName}
                  onChange={(e) => updatePayment({ cardName: e.target.value })}
                />
                <input
                  type="text"
                  className="w-full border p-2 rounded mb-2"
                  placeholder="Card Number"
                  value={payment.cardNumber}
                  onChange={(e) => updatePayment({ cardNumber: e.target.value.replace(/\D/g, "").slice(0, 16) })}
                />
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    placeholder="Exp Date (MM/YY)"
                    value={payment.expDate}
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^\d/]/g, "")
                      if (value.length === 2 && !value.includes("/") && payment.expDate.length === 1) value += "/"
                      updatePayment({ expDate: value.slice(0, 5) })
                    }}
                  />
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    placeholder="CVV"
                    value={payment.cvv}
                    onChange={(e) => updatePayment({ cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                  />
                </div>
              </div>
            )}

            {/* Address Form - Always shown */}
            <div>
              <h3 className="text-lg font-semibold mt-6">Address</h3>
              <div className="grid gap-4 mt-4">
                <input
                  type="text"
                  className="border p-2 rounded"
                  placeholder="Region"
                  value={address.region}
                  onChange={(e) => updateAddress({ region: e.target.value })}
                />
                <input
                  type="text"
                  className="border p-2 rounded"
                  placeholder="Address Directions"
                  value={address["address-direction"]}
                  onChange={(e) => updateAddress({ "address-direction": e.target.value })}
                />
                <input
                  type="text"
                  className="border p-2 rounded"
                  placeholder="Phone Number (e.g., +1234567890)"
                  value={address.phone}
                  onChange={(e) => {
                    const value = e.target.value
                    const sanitizedValue = value.replace(/[^+\d]/g, "")
                    if (sanitizedValue.startsWith("+") && sanitizedValue.length <= 16) {
                      updateAddress({ phone: sanitizedValue })
                    }
                  }}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    className="border p-2 rounded"
                    placeholder="Building"
                    value={address.building}
                    onChange={(e) => updateAddress({ building: e.target.value })}
                  />
                  <input
                    type="text"
                    className="border p-2 rounded"
                    placeholder="Floor Number"
                    value={address.floor}
                    onChange={(e) => updateAddress({ floor: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                  />
                </div>
              </div>
            </div>

            {/* Checkout Button - Text changes based on payment method */}
            <button
              onClick={handleCheckout}
              className="mt-6 w-full bg-[#4A8C8C] text-white py-3 rounded-lg text-lg hover:bg-[#3a6f6f]"
            >
              {paymentMethod === "cod" ? "Place Order (Cash on Delivery)" : "Pay Now (PayTabs)"}
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="max-h-[300px] overflow-y-auto mb-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 py-3 px-3">
                  <div className="w-16 h-16 relative">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute -top-2 -left-2 bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600">${(item.price || 0).toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 px-3">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${orderSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">${orderSummary.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-bold text-lg text-[#4A8C8C]">${orderSummary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

