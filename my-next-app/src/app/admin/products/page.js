"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Dashboard from "@/app/admin/layout";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        console.log("Fetched Products:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Dashboard>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
        {loading ? (
          <p>Loading products...</p>
        ) : products.length > 0 ? (
          <ul>
            {products.map((product) => (
              <li key={product.id} className="border p-2 mb-2">
                {product.name} - ${product.price}
              </li>
            ))}
          </ul>
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </Dashboard>
  );
};

export default ProductsPage;
