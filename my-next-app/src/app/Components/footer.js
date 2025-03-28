import { FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa";  // Import icons

const Footer = () => {
  return (
    <footer className=" text-black py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

        {/* First Column - Contact Info */}
        <div>
          <center>
          <p className="text-lg font-semibold">Monday to Friday 9 AM - 9 PM GMT</p>
          <p className="text-lg font-semibold">Saturday 10 AM - 9 PM GMT</p>
          <p className="text-lg font-semibold mt-2">961 3 734 990</p>
         
          </center>
        </div>

  

        {/* Third Column - Social Icons */}
        <div className="flex justify-center md:justify-end gap-6 mr-20">
          <a href="https://wa.me/9613734990" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp className="text-3xl " />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-3xl" />
          </a>
          <a href="mailto:your-email@example.com">
            <FaEnvelope className="text-3xl" />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
