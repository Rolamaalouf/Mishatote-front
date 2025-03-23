"use client"; // Ensure it's a client component

import { useRouter } from "next/navigation";

const ContinueShopping = () => {
  const router = useRouter();

  const handleNavigation = () => {
    router.push("/totes"); // Navigate to /totes
  };

  return (
    <button
      onClick={handleNavigation}
      className="text-[#4A8C8C] hover:underline font-medium"
    >
      Continue shopping
    </button>
  );
};

export default ContinueShopping;
