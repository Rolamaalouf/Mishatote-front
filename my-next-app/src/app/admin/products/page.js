"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function AdminProductsPage() {
  const { user } = useAuth();
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    category_id: "",
    images: [],
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  // ✅ **Fetch products from API**
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        withCredentials: true,
      });
      console.log("📦 Products fetched:", data);
      setProducts(data);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ **Handle Input Change**
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setNewProduct({ ...newProduct, images: [...files] });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  // ✅ **Handle Add Product**
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(newProduct).forEach((key) => {
        if (key === "images") {
          newProduct.images.forEach((image) => formData.append("images", image));
        } else {
          formData.append(key, newProduct[key]);
        }
      });

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("✅ Product added successfully!");
      setNewProduct({ name: "", price: "", description: "", stock: "", category_id: "", images: [] });
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error("❌ Error adding product:", error);
      toast.error("Error adding product. Please try again.");
    }
  };

  // ✅ **Handle Update Product**
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(newProduct).forEach((key) => {
        if (key === "images") {
          newProduct.images.forEach((image) => formData.append("images", image));
        } else {
          formData.append(key, newProduct[key]);
        }
      });

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${editProductId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("✅ Product updated successfully!");
      setNewProduct({ name: "", price: "", description: "", stock: "", category_id: "", images: [] });
      setEditMode(false);
      setEditProductId(null);
      fetchProducts();
    } catch (error) {
      console.error("❌ Error updating product:", error);
      toast.error("Error updating product. Please try again.");
    }
  };

  // ✅ **Handle Delete Product**
  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
        withCredentials: true,
      });

      toast.success("✅ Product deleted successfully!");
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error("❌ Error deleting product:", error.response?.data || error.message);
      toast.error("Error deleting product. Please try again.");
    }
  };

  // ✅ **Handle Edit Mode**
  const handleEditProduct = (product) => {
    setNewProduct({
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
      category_id: product.category_id,
      images: [],
    });
    setEditMode(true);
    setEditProductId(product.id);
  };

  // ✅ **Parse Product Image**
  const parseProductImage = (imageData) => {
    if (Array.isArray(imageData) && imageData.length > 0) {
      return imageData[0]; // Return first image URL
    }
    return "";
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Admin - Manage Products</h1>

      {/* ✅ **Add or Edit Product Form** */}
      <h2 className="text-xl font-bold mb-3">{editMode ? "Edit Product" : "Add New Product"}</h2>
      <form onSubmit={editMode ? handleUpdateProduct : handleAddProduct} className="mb-6 grid gap-4">
        <input type="text" name="name" placeholder="Product Name" value={newProduct.name} onChange={handleInputChange} className="border p-2 rounded" required />
        <input type="number" name="price" placeholder="Price" value={newProduct.price} onChange={handleInputChange} className="border p-2 rounded" required />
        <textarea name="description" placeholder="Description" value={newProduct.description} onChange={handleInputChange} className="border p-2 rounded" required />
        <input type="number" name="stock" placeholder="Stock" value={newProduct.stock} onChange={handleInputChange} className="border p-2 rounded" required />
        <input type="number" name="category_id" placeholder="Category ID" value={newProduct.category_id} onChange={handleInputChange} className="border p-2 rounded" required />
        <input type="file" name="images" multiple onChange={handleInputChange} className="border p-2 rounded" />

        <button type="submit" className="px-4 py-2 rounded transition" style={{ backgroundColor: "#A68F7B", color: "white" }}>
          {editMode ? "Update Product" : "Add Product"}
        </button>
        {editMode && (
          <button type="button" className="px-4 py-2 rounded transition bg-gray-500 text-white" onClick={() => { setEditMode(false); setNewProduct({ name: "", price: "", description: "", stock: "", category_id: "", images: [] }); }}>
            Cancel
          </button>
        )}
      </form>

      {/* ✅ **Display Existing Products** */}
      <h2 className="text-xl font-bold mt-4 mb-2">Product List</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-gray-100 p-4 rounded-md shadow">
              <img src={parseProductImage(product.image)} alt={product.name} className="h-32 mx-auto" />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p>${product.price}</p>
              <button className="px-3 py-1 mt-2 rounded transition" style={{ backgroundColor: "#A68F7B", color: "white" }} onClick={() => handleEditProduct(product)}>
                Edit
              </button>
              <button
  className="px-3 py-1 mt-2 ml-5 rounded text-white"
  style={{ backgroundColor: '#A68F7B' }}
  onClick={() => handleDeleteProduct(product.id)}
>
  Delete
</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}
