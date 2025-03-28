"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import ImageComponent from "./imageComponent";
import CartPopup from "./CartPopup";
import { ShoppingCart, UserCircle } from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();
  const { cartCount, loading, isCartOpen, toggleCart } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <header className="top-0 z-50 w-full bg-white shadow-md fixed px-4 md:px-10 py-4 md:py-6">
      <div className="flex items-center justify-between w-full">
        {/* Left: Logo + Burger (mobile only) */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <ImageComponent
              src="https://i.ibb.co/BXqy2R2/michella-logo-4x.png"
              alt="Logo"
              width={60}
              height={60}
              className="cursor-pointer"
            />
          </Link>

          {/* Burger Icon */}
          <button
            className="md:hidden flex items-center justify-center w-8 h-8 "
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 text-lg font-semibold absolute left-1/2 transform -translate-x-1/2">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/totes">Totes</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {/* Right: Icons */}
        <div className="flex space-x-4 items-center relative">
          {!user ? (
            <Link href="/login" aria-label="Login">
              <UserCircle size={28} className="text-gray-700 hover:text-[#4A8C8C] transition-colors" />
            </Link>
          ) : (
            <div className="relative flex flex-col items-center" ref={dropdownRef}>
              <button onClick={toggleDropdown} className="focus:outline-none">
                <UserCircle size={28} className="text-gray-700 hover:text-[#4A8C8C] transition-colors" />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-[110%] right-0 w-48 bg-white border rounded shadow-md z-50">
                  <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-200">
                    Logout
                  </button>
                  {user.role === "admin" && (
                    <Link href="/admin" className="block px-4 py-2 hover:bg-gray-200">
                      Admin Panel
                    </Link>
                  )}
                  <Link href="/orderHistory" className="block px-4 py-2 hover:bg-gray-200">
                    Orders History
                  </Link>
                </div>
              )}
            </div>
          )}

          <button
            onClick={toggleCart}
            className="relative p-2 text-gray-700 hover:text-[#4A8C8C] transition-colors"
            aria-label="Open cart"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#4A8C8C] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 bg-white shadow-md rounded p-4">
          <nav className="flex flex-col space-y-4">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="block py-1">
              Home
            </Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="block py-1">
              About
            </Link>
            <Link href="/totes" onClick={() => setIsMenuOpen(false)} className="block py-1">
              Totes
            </Link>
            <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="block py-1">
              Contact
            </Link>
          </nav>
        </div>
      )}

      <CartPopup isOpen={isCartOpen} onClose={toggleCart} />
    </header>
  );
};

export default Header;
