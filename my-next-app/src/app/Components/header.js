import { useState, useEffect, useRef } from "react"; 
import { useAuth } from "@/context/AuthContext"; // Import auth hook
import Link from "next/link";
import ImageComponent from "./imageComponent";
import { ShoppingCart } from "lucide-react"
import CartPopup from "./CartPopup"
import { useCart } from "../../context/CartContext"
//import CartPopup from "@/Components/CartPopup";


const Header = () => {
  const { user, logout } = useAuth(); // Get user and logout function
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // State for cart popup
  const { cartCount, loading } = useCart();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Reference to dropdown

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen); // Toggle cart visibility
  if (loading) {
    return <div>Loading...</div>; // You can add a loading spinner or something similar
  }

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
     {/* Mobile Menu */}
{/* Mobile Menu */}
<div className={`md:hidden ${isMenuOpen ? "absolute top-full left-0 w-full bg-white shadow-md z-50" : "hidden"}`}>
  <nav className="flex flex-col space-y-4 p-4">
    <Link href="/" className="block py-2">Home</Link>
    <Link href="/about" className="block py-2">About</Link>
    <Link href="/totes" className="block py-2">Totes</Link>
    <Link href="/contact" className="block py-2">Contact</Link>
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
          <div className="relative flex flex-col items-center" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="focus:outline-none">
              <ImageComponent 
                src="https://i.ibb.co/z04cdbb/image-13-1.png" 
                alt="User" 
                width={25} 
                height={25} 
              />
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

        <Link href="/wishlist">
          <ImageComponent 
            src="https://i.ibb.co/spm9LYcK/Vector.png" 
            alt="Wishlist" 
            width={25} 
            height={25} 
          />
        </Link>

  {/* Cart Button */}
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

      {/* Cart Popup */}
      <CartPopup isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}
export default Header;
