'use client'
import React, { useState } from 'react';
import ImageComponent from "./imageComponent"; 
import Link from 'next/link';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-[#A68F7B] text-white 
                    fixed h-screen transition-all 
                    duration-300 z-10 
                    ${isOpen ? 'w-64' : 'w-0 overflow-hidden'}`}
      >
        {/* Sidebar content */}
        <div className="p-4">
          <ImageComponent 
            src="https://i.ibb.co/BXqy2R2/michella-logo-4x.png" 
            alt="Logo" 
            width={80} 
            height={80} 
            className="w-10 h-10"
          />
          <h2 className="text-lg font-semibold mt-2">Mishatotebag</h2>
        </div>

        {/* Sidebar Links */}
        <div className="flex flex-col items-start mt-10 gap-6 text-lg px-6">
          <Link href="/" className="hover:text-gray-300">🏠 Home</Link>
          <Link href="/admin" className="hover:text-gray-300">📊 Dashboard</Link>
          <Link href="/admin/users" className="hover:text-gray-300">👥 Users</Link>
          <Link href="/admin/products" className="hover:text-gray-300">🛍 Products</Link>
          <Link href="/admin/orders" className="hover:text-gray-300">📦 Orders</Link>
          <Link href="/admin/reports" className="hover:text-gray-300">📑 Reports</Link>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 p-4 ${isOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Toggle Button */}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Close' : 'Open'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
