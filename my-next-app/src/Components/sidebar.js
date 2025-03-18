
import React, { useState } from 'react';
import ImageComponent from "./imageComponent"; 
const Sidebar = () => {
  // State to manage the open/close state of the sidebar
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        // Conditional class based on isOpen 
        // state to control width and visibility
        className={`bg-[#A68F7B] text-white 
                    fixed h-screen transition-all 
                    duration-300 z-10 
                    ${isOpen ? 'w-64' : 'w-0 overflow-hidden'
          }`}>
        {/* Sidebar content */}
        <div>
<ImageComponent 
          src="https://i.ibb.co/BXqy2R2/michella-logo-4x.png" 
          alt="Logo" 
          width={80} 
          height={80} 
          className="w-10 h-10"
        />
        <h2>Mishatotebag</h2>
        </div>
        <div className="flex flex-col items-center mt-40 gap-10 text-2xl">
          <div className="mt-4">
            <a href="#"
              className="text-white 
                          hover:text-gray-300">
              Users
            </a>
          </div>
          <div className="mt-4">
            <a href="#"
              className="text-white 
                          hover:text-gray-300">
              Products
            </a>
          </div>
          <div className="mt-4">
            <a href="#"
              className="text-white 
                          hover:text-gray-300">
             Orders
            </a>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className={`flex-1 p-4 
                        ${isOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Button to toggle sidebar */}
        <div className="ml-auto">
          <button
            className="bg-blue-500 hover:bg-blue-700 
                       text-white font-bold py-2 px-4 rounded"
            onClick={() => setIsOpen(!isOpen)}>
            {/* Toggle icon based on isOpen state */}
            {isOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;