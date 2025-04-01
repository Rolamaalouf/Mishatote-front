"use client"

import Head from "next/head"
import Header from "@/app/Components/header"
import Footer from "@/app/Components/footer"
import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter, useSearchParams } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sortOrder, setSortOrder] = useState("lowToHigh")

  const router = useRouter()
  const searchParams = useSearchParams()

  const categoryFromURL = searchParams.get("category")
  const modalProductId = searchParams.get("modal")

  useEffect(() => {
    if (categoryFromURL) {
      setSelectedCategory(categoryFromURL)
    }
  }, [categoryFromURL])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/products`
        const { data } = await axios.get(url, { withCredentials: true })

        const filtered =
          selectedCategory === "all"
            ? data
            : data.filter((product) => product.category_id === Number.parseInt(selectedCategory))

        setProducts(filtered)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [selectedCategory, categoryFromURL])

  useEffect(() => {
    if (modalProductId && products.length > 0) {
      const selected = products.find((p) => p.id === Number.parseInt(modalProductId))
      if (selected) {
        setSelectedProduct(selected)
        const params = new URLSearchParams(window.location.search)
        params.delete("modal")
        const newPath = `${window.location.pathname}?${params.toString()}`
        router.replace(newPath)
      }
    }
  }, [modalProductId, products, router])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
          withCredentials: true,
        })
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          withCredentials: true,
        })
        setIsAuthenticated(true)
      } catch {
        setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [])

  const openCartPopup = (product) => {
    if (!isAuthenticated) {
      toast.error("Log in first to add items to the cart!")
      setTimeout(() => router.push("/login"), 2000)
      return
    }
    setSelectedProduct(product)
    setQuantity(1)
  }

  const handleAddToCart = async () => {
    if (!selectedProduct) return

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/add`,
        { product_id: selectedProduct.id, quantity },
        { withCredentials: true },
      )

      toast.success(`Added ${quantity} item(s) to cart!`)
      setSelectedProduct(null)
    } catch (error) {
      console.error("Add to Cart Error:", error)
      toast.error("Failed to add item to cart!")
    }
  }

  const sortedProducts = [...products].sort((a, b) =>
    sortOrder === "lowToHigh" ? a.price - b.price : b.price - a.price,
  )

  return (
    <div className="relative w-full min-h-screen mt-20  max-w-full overflow-x-hidden">
      <Head>
        <title>Products</title>
      </Head>

      <Header />
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="relative w-full h-[7cm] flex flex-col items-center justify-end bg-[#A68F7B]">
        <h1 className="text-white text-4xl font-bold mb-5">Products</h1>
        <img
          src="https://i.ibb.co/6JYgYPSH/Whats-App-Image-2025-03-22-at-10-02-39-AM.jpg"
          alt="Products"
          className="w-[1000px] h-[400px] object-contain mb-[-6cm]"
        />
      </div>

      <div className="flex justify-center gap-4 my-6 mt-70">
        <select
          className="p-2 border rounded"
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select className="p-2 border rounded" onChange={(e) => setSortOrder(e.target.value)}>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-10">
        {loading ? (
          <p>Loading products...</p>
        ) : sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <div
            key={product.id}
            className="p-4 shadow-lg text-center group"
          >
           <div className="relative w-full h-[250px] overflow-hidden rounded-lg shadow group">
  <img
    src={product.image || "/placeholder.svg"}
    alt={product.name}
    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:translate-y-[-10px] cursor-pointer"
    onClick={() => router.push(`/totes?modal=${product.id}`)}
  />
</div>
          
            <h3 className="text-lg font-bold mt-2">{product.name}</h3>
            <p className="text-gray-600">${product.price}</p>
            <button
              className="mt-4 bg-[#4A8C8C] text-white px-6 py-2 rounded w-full"
              onClick={() => openCartPopup(product)}
            >
              Add to Cart
            </button>
          </div>
          
          ))
        ) : (
          <p className="col-span-full text-center">No products found in this category</p>
        )}
      </div>

      {selectedProduct && (
  <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/40 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full flex flex-col md:flex-row overflow-hidden">
      {/* Image on the left */}
      <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center p-4">
        <img
          src={selectedProduct.image || "/placeholder.svg"}
          alt={selectedProduct.name}
          className="max-h-[90vh] w-auto object-contain rounded"
        />
      </div>

      {/* Info on the right */}
      <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
          <p className="text-gray-700 mb-4">{selectedProduct.description}</p>
          <p className="text-gray-600 font-semibold mb-4">${selectedProduct.price}</p>

          <div className="flex items-center justify-start gap-4 my-4">
            <button
              className="bg-gray-300 px-4 py-2 rounded-l"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              -
            </button>
            <span className="px-4">{quantity}</span>
            <button
              className="bg-gray-300 px-4 py-2 rounded-r"
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-6">
          <button
            className="bg-[#4A8C8C] text-white px-6 py-2 rounded w-full mb-2"
            onClick={handleAddToCart}
          >
            Confirm
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded w-full"
            onClick={() => setSelectedProduct(null)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}


      <Footer />
    </div>
  )
}

