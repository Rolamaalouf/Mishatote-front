"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "@/app/Components/dashboardLayout";

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
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="container mx-auto text-black p-6 bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-bold mb-4 text-center">Products</h1>
          
          {/* Add New Product Form */}
          <div className="mb-6">
            <h2 className="text-xl mb-4 text-center">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} className="border p-2 w-full rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Price</label>
                <input type="number" name="price" value={newProduct.price} onChange={handleInputChange} className="border p-2 w-full rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Image</label>
                <input type="file" name="image" onChange={handleImageChange} className="border p-2 w-full rounded" required />
              </div>
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">Add Product</button>
            </form>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-center">
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
                        {product.image && (() => {
                          let parsedImage;
                          try {
                            parsedImage = JSON.parse(product.image);
                          } catch (error) {
                            console.error("Error parsing image:", error);
                            parsedImage = [];
                          }
                          return parsedImage.length > 0 ? (
                            <img src={parsedImage[0]} alt={product.name} className="h-16 mx-auto" />
                          ) : (
                            "No Image"
                          );
                        })()}
                      </td>
                      <td className="border p-2">{product.name}</td>
                      <td className="border p-2">${product.price}</td>
                      <td className="border p-2">{product.Category?.name}</td>
                      <td className="border p-2">
                        <button className="bg-red-500 text-white px-4 py-1 rounded">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="border p-2 text-center">No products available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductsPage;

