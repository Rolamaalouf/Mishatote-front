"use client"

export default function PaymentForm({ payment, updatePayment }) {
  return (
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
  )
}

