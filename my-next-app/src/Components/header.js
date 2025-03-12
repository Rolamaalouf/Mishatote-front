import Link from "next/link";
import ImageComponent from "./imageComponent"; // Import the new ImageComponent

const Header = () => {
  return (
    <header className="absolute top-0 left-0 w-full flex justify-between items-center px-10 py-6">
      {/* Logo */}
      <div>
        <ImageComponent 
          src="https://i.ibb.co/BXqy2R2/michella-logo-4x.png" 
          alt="Logo" 
          width={80} 
          height={80} 
        />
      </div>

      {/* Navigation */}
      <nav className="flex space-x-8 text-lg font-semibold">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/totes">Totes</Link>
        <Link href="/contact">Contact</Link>
      </nav>

      {/* Icons */}
      <div className="flex space-x-4">
        <ImageComponent 
          src="https://i.ibb.co/z04cdbb/image-13-1.png" 
          alt="User" 
          width={25} 
          height={25} 
        />
        <ImageComponent 
          src="https://i.ibb.co/spm9LYcK/Vector.png" 
          alt="Wishlist" 
          width={25} 
          height={25} 
        />
        <ImageComponent 
          src="https://i.ibb.co/3mt2BFXt/Cart.png" 
          alt="Cart" 
          width={25} 
          height={25} 
        />
      </div>
    </header>
  );
};

export default Header;
