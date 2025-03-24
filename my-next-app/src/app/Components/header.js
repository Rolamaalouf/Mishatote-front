import { useState } from "react";
import { useAuth } from "@/context/AuthContext"; // Import auth hook
import Link from "next/link";
import ImageComponent from "./imageComponent";
import CartButton from "../Components/CartButton";

const Header = () => {
  const { user, logout } = useAuth(); // Get user and logout function
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <header className="top-0 z-50 w-full flex justify-between items-center px-4 md:px-10 py-4 md:py-6 bg-white shadow-md fixed">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/">
          <ImageComponent 
            src="https://i.ibb.co/BXqy2R2/michella-logo-4x.png" 
            alt="Logo" 
            width={60} 
            height={60} 
            className="cursor-pointer"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex space-x-8 text-lg font-semibold">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/totes">Totes</Link>
        <Link href="/contact">Contact</Link>
      </nav>

      {/* Mobile Navigation Button */}
      <button 
        className="md:hidden flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full" 
        onClick={toggleMenu}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <nav className="space-y-4">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/totes">Totes</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>

      {/* Icons as Buttons */}
      <div className="flex space-x-4 items-center relative">
        {!user ? (
          <Link href="/login">
            <ImageComponent 
              src="https://i.ibb.co/z04cdbb/image-13-1.png" 
              alt="User" 
              width={25} 
              height={25} 
            />
          </Link>
        ) : (
          <div className="relative flex flex-col items-center">
            {isDropdownOpen && (
              <div className="absolute top-[-120%] right-0 w-48 bg-white border rounded shadow-md z-50">
                <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Logout</button>
                {user.role === "admin" && (
                  <Link href="/admin" className="block px-4 py-2 hover:bg-gray-200">Admin Panel</Link>
                )}
                <Link href="/orderHistory" className="block px-4 py-2 hover:bg-gray-200">Orders History</Link>
              </div>
            )}
            <button onClick={toggleDropdown} className="focus:outline-none">
              <ImageComponent 
                src="https://i.ibb.co/z04cdbb/image-13-1.png" 
                alt="User" 
                width={25} 
                height={25} 
              />
            </button>
          </div>
        )}

        <Link href="/cart">
          <ImageComponent 
            src="https://i.ibb.co/3mt2BFXt/Cart.png" 
            alt="Cart" 
            width={25} 
            height={25} 
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
