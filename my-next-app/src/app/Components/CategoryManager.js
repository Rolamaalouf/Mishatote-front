"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        withCredentials: true,
      });
      setCategories(data);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/categories/${editId}`, { name }, { withCredentials: true });
        toast.success("Category updated");
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { name }, { withCredentials: true });
        toast.success("Category created");
      }
      setName("");
      setEditId(null);
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving category");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, { withCredentials: true });
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  const openEditModal = (category) => {
    setName(category.name);
    setEditId(category.id);
    setModalOpen(true);
  };

  const openCreateModal = () => {
    setName("");
    setEditId(null);
    setModalOpen(true);
  };

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Manage Categories</h2>
        <button onClick={openCreateModal} className="flex items-center gap-2 px-3 py-2 bg-[#4A8C8C] text-white hover:bg-[#A68F7B] rounded shadow">
          <FaPlus /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="border p-3 rounded flex justify-between items-center">
            <span>{cat.name}</span>
            <div className="flex gap-2">
              <button onClick={() => openEditModal(cat)} className="text-[#A68F7B]"><FaEdit /></button>
              <button onClick={() => handleDelete(cat.id)} className="text-red-600"><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>
 
      {/* Modal */}
{modalOpen && (
  <div className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-6 border border-[#A68F7B] animate-fade-in-up">
      <h3 className="text-xl font-bold mb-4 text-black">
        {editId ? "Edit Category" : "Add Category"}
      </h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category name"
        className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#4A8C8C]"
      />
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setModalOpen(false)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-[#4A8C8C] hover:bg-[#3c7878] text-white rounded"
        >
          {editId ? "Update" : "Create"}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
