import { FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa";  // Import icons

const Footer = () => {
  return (
    <footer className="text-black py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-4 text-center">

        {/* Contact Info & Hours */}
        <p className="text-lg font-semibold">Monday to Saturday 9 AM - 9 PM GMT</p>

        {/* Social Icons */}
        <div className="flex gap-6">
          <a href="https://wa.me/9613734990" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp className="text-3xl text-black" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-3xl text-black" />
          </a>
          <a href="mailto:your-email@example.com">
            <FaEnvelope className="text-3xl text-black" />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-600">© 2025 Mishatoteshop. All rights reserved.</p>

      </div>
    </footer>
  );
};

export default Footer;
