"use client"

import { useState } from "react"
import { FaMoneyBillWave, FaCreditCard } from "react-icons/fa"
import axios from "axios"
import { validateAddress, validatePayment } from "./utils/validation"
import { notify } from "./utils/toast"
import PaymentForm from "./PaymentForm"
import AddressForm from "./AddressForm"

export default function CheckoutForm({ paymentMethod, address, payment, updateState, updateAddress, updatePayment }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCheckout = async () => {
    try { 
      if (!validateAddress(address)) return
 
      if (paymentMethod === "paytab" && !validatePayment(payment)) return

      setIsSubmitting(true)

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
        updateState({ orderPlaced: true, orderId: res.data.order_id })
        notify("success", "Your order has been placed successfully!")
      }
    } catch (err) {
      notify("error", err.response?.data?.error || "Failed to place your order. Please try again.")
      console.error("Checkout error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Payment Method Selection */}
      <h2 className="text-lg font-semibold mb-4">Payment method</h2>
      <div className="flex gap-4 mb-6">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border w-full ${
            paymentMethod === "cod" ? "bg-[#4A8C8C] text-white" : "bg-gray-100"
          }`}
          onClick={() => updateState({ paymentMethod: "cod" })}
        >
          <FaMoneyBillWave /> Cash on Delivery
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border w-full ${
            paymentMethod === "paytab" ? "bg-[#4A8C8C] text-white" : "bg-gray-100"
          }`}
          onClick={() => updateState({ paymentMethod: "paytab" })}
        >
          <FaCreditCard /> PayTabs
        </button>
      </div>
 
      {paymentMethod === "paytab" && <PaymentForm payment={payment} updatePayment={updatePayment} />}
 
      <AddressForm address={address} updateAddress={updateAddress} />
 
      <button
        onClick={handleCheckout}
        disabled={isSubmitting}
        className="mt-6 w-full bg-[#4A8C8C] text-white py-3 rounded-lg text-lg hover:bg-[#3a6f6f] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting
          ? "Processing..."
          : paymentMethod === "cod"
            ? "Place Order (Cash on Delivery)"
            : "Pay Now (PayTabs)"}
      </button>
    </div>
  )
}

