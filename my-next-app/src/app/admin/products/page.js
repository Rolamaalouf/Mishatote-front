"use client";

import CategoryManager from "@/app/Components/CategoryManager";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FiTrash, FiEdit } from "react-icons/fi";
import { FiFilter } from "react-icons/fi";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';  
import { useRef } from "react";



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
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState([]);

  const formRef = useRef(null);
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        withCredentials: true,
      });
      setProducts(data);
    } catch (error) {
      console.error(" Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        withCredentials: true,
      });
      setCategories(data);
    } catch (error) {
      console.error(" Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [categoryFilter, products, categories]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setNewProduct({ ...newProduct, images: [...files] });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

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
      fetchProducts();
      fetchCategories();
    } catch (error) {
      console.error("❌ Error adding product:", error);
      toast.error("Error adding product. Please try again.");
    }
  };

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
      fetchCategories();
    } catch (error) {
      console.error(" Error updating product:", error);
      toast.error("Error updating product. Please try again.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
        withCredentials: true,
      });
  
      toast.success(" Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      const errMsg = error.response?.data?.error || "Error deleting product. Please try again.";
      toast.error(` ${errMsg}`);
    }
  };
  
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
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const parseProductImage = (imageData) => {
    if (Array.isArray(imageData) && imageData.length > 0) {
      return imageData[0];
    }
    return "";
  };

  const filterProducts = () => {
    if (categoryFilter === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((product) => product.category_id === parseInt(categoryFilter)));
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <ToastContainer position="top-center" />
      <h1 className="text-2xl font-bold mb-4">Admin - Manage Products</h1>

      <CategoryManager />

      <h2  ref={formRef} className="text-xl font-bold mb-3">{editMode ? "Edit Product" : "Add New Product"}</h2>
      <form onSubmit={editMode ? handleUpdateProduct : handleAddProduct} className="mb-6 grid gap-4 md:grid-cols-2">       
         <input type="text" name="name" placeholder="Product Name" value={newProduct.name} onChange={handleInputChange} className="border p-2 rounded" required />
        <div className="relative">
          <input type="number" name="price" placeholder="Price" min="0" value={newProduct.price} onChange={handleInputChange} className="border p-2 rounded w-full pr-10" required />
          <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500">$</span>
        </div>
        <textarea name="description" placeholder="Description" value={newProduct.description} onChange={handleInputChange} className="border p-2 rounded md:col-span-2" required />
        <input type="number" name="stock" placeholder="Stock" min="0" value={newProduct.stock} onChange={handleInputChange} className="border p-2 rounded" required />

        <select name="category_id" value={newProduct.category_id} onChange={handleInputChange} className="border p-2 rounded" required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <input type="file" name="images" multiple onChange={handleInputChange} className="border p-2 rounded md:col-span-2" />

        <div className="md:col-span-2 flex gap-4">
          <button type="submit" className="px-4 py-2 rounded transition bg-[#4A8C8C] hover:bg-[#A68F7B] text-white">
            {editMode ? "Update Product" : "Add Product"}
          </button>
          {editMode && (
            <button type="button" className="px-4 py-2 rounded transition bg-gray-500 text-white" onClick={() => {
              setEditMode(false);
              setNewProduct({ name: "", price: "", description: "", stock: "", category_id: "", images: [] });
            }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2">
        <label className="mr-2">Filter by Category:</label>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="border p-2 rounded">
          <option value="all">All</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <FiFilter className="text-lg" />
      </div>

      <h2 className="text-xl font-bold mt-4 mb-2">Product List</h2>
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-gray-100 p-4 rounded-md shadow">
              <img src={parseProductImage(product.image)} alt={product.name} className="h-32 mx-auto object-contain" />
              <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
              <p className="text-sm text-gray-700">{product.price} $</p>
              <div className="flex justify-end gap-2 mt-2">
                <button className="p-2  text-[#A68F7B] hover:scale-105 transition" onClick={() => handleEditProduct(product)}>
                  <FiEdit />
                </button>
                <button
                  className="p-2 text-red-700 hover:scale-105 transition"
                  onClick={() =>
                    confirmAlert({
                      title: "Confirm Delete",
                      message:(
                        <div>
                          Are you sure you want to delete  <strong> "{product.name}" </strong> product?
                        </div>
                      ),
                      buttons: [
                        {
                          label: "Yes",
                          onClick: () => handleDeleteProduct(product.id),
                        },
                        {
                          label: "No",
                        },
                      ],
                    })
                  }
                >
                  <FiTrash />
                </button>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}
