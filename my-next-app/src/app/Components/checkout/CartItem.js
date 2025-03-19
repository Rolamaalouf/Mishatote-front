export default function CartItem({ item }) {
  return (
    <div className="flex items-center gap-4 py-3 px-3">
      <div className="w-16 h-16 relative">
        <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover rounded-lg" />
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
  )
}

