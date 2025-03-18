"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "../Components/dashboardLayout";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", image: null });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          withCredentials: true,
        });
        console.log("API Response:", data);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setNewProduct((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("image", newProduct.image);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log("New Product Response:", response.data);
      setProducts((prev) => [...prev, response.data]);
      setNewProduct({ name: "", price: "", image: null });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <Dashboard>
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {/* Add Product Form */}
      <div className="mb-6">
        <h2 className="text-xl mb-4">Add New Product</h2>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              className="border p-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              className="border p-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="border p-2 w-full"
              required
            />
          </div>

          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Add Product
          </button>
        </form>
      </div>

      {/* Products Table */}
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Image</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id} className="border">
                <td className="border p-2">
                  {product.image && (
                    <img 
                      src={product.image ? JSON.parse(product.image)[0] : ''}  // Ensure the image is properly parsed and displayed
                      alt={product.name} 
                      className="h-16" 
                    />
                  )}
                </td>
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">${product.price}</td>
                <td className="border p-2">{product.Category?.name}</td>
                <td className="border p-2">
                  <button className="bg-red-500 text-white px-4 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="border p-2 text-center">
                No products available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Dashboard>
  );
};

export default ProductsPage;

