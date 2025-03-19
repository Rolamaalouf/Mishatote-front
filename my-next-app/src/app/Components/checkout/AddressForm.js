"use client"

export default function AddressForm({ address, updateAddress }) {
  return (
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
  )
}

