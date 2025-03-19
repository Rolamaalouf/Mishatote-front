"use client";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";  // Import the AuthContext
import { toast } from "react-toastify";  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';


export default function AdminProductsPage() {
  const { user } = useAuth();  // Get the user from context
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    category_id: "",
    images: [], // Changed from single image to array
  });
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "images") {
      setNewProduct({ ...newProduct, images: [...files] }); // Store multiple images
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Destructure the state to get the necessary values
      const { name, description, price, category_id, stock, images } = newProduct;

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category_id", category_id);
      formData.append("stock", stock);

      // Append selected images
      images.forEach((image) => formData.append("images", image));

      console.log("🚀 Sending FormData:", Object.fromEntries(formData.entries()));

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true, // ✅ Ensures cookies are sent with the request
        }
      );

      console.log("✅ Product added successfully:", response.data);

      // Display success message using Toastify
      toast.success("Product added successfully!");

      // Reset the form
      setNewProduct({
        name: "",
        price: "",
        description: "",
        stock: "",
        category_id: "",
        images: [],
      });
    } catch (error) {
      console.error("❌ Error adding product:", error.response?.data || error.message);

      // Display error message using Toastify
      toast.error("Error adding product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <form onSubmit={handleAddProduct} encType="multipart/form-data">
        <div className="mb-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <input
            type="number"
            name="price"
            placeholder="Product Price"
            value={newProduct.price}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <textarea
            name="description"
            placeholder="Product Description"
            value={newProduct.description}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={newProduct.stock}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <input
            type="number"
            name="category_id"
            placeholder="Category ID"
            value={newProduct.category_id}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <input
            type="file"
            name="images"
            onChange={handleInputChange}
            multiple
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#A68F7B] text-white rounded hover:bg-[#8b7c64] focus:outline-none"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

