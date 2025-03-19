import axios from "axios"

export const fetchCheckoutData = async () => {
  try {
    const [shippingRes, userRes, cartRes] = await Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/shipping`),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, { withCredentials: true }),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart`, { withCredentials: true }),
    ])

    const shipping = shippingRes.data.delivery_fee || 0
    const userAddress = userRes.data.user?.address || {}
    const cart = cartRes.data || []

    if (cart.length === 0) {
      return { isCartEmpty: true }
    }

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

    return { cartWithDetails, userAddress, shipping, isCartEmpty: false }
  } catch (error) {
    console.error("Error in fetchCheckoutData:", error)
    throw error
  }
}

