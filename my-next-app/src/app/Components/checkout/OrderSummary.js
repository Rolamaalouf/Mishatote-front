import CartItem from "./CartItem"

export default function OrderSummary({ cartItems, orderSummary }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      <div className="max-h-[300px] overflow-y-auto mb-4">
        {cartItems.map((item, index) => (
          <CartItem key={index} item={item} />
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
  )
}

