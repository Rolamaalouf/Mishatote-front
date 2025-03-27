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
            <div key={product.id} className="p-4 shadow-lg text-center">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-[200px] object-cover mb-2 rounded"
                onClick={() => router.push(`/totes?modal=${product.id}`)}
              />
              <h3 className="text-lg font-bold">{product.name}</h3>
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
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
            <img
              src={selectedProduct.image || "/placeholder.svg"}
              alt={selectedProduct.name}
              className="w-full h-[200px] object-cover rounded my-2"
            />
            <p className="text-gray-700">{selectedProduct.description}</p>
            <p className="text-gray-600">${selectedProduct.price}</p>

            <div className="flex items-center justify-center my-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded-l"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <span className="px-6">{quantity}</span>
              <button className="bg-gray-300 px-4 py-2 rounded-r" onClick={() => setQuantity((prev) => prev + 1)}>
                +
              </button>
            </div>

            <button className="mt-4 bg-[#4A8C8C] text-white px-6 py-2 rounded w-full" onClick={handleAddToCart}>
              Confirm
            </button>
            <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded" onClick={() => setSelectedProduct(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

