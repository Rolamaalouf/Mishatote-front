"use client"; // Required for client components

import "@/styles/globals.css";
import { Belleza } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext"; // Ensure correct path
//import { CartProvider } from "../context/CartContext";
//import PopupCart from "../Components/PopupCart";

const belleza = Belleza({ subsets: ["latin"], weight: "400" });

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={belleza.className}>{children}</body>
      </html>
    </AuthProvider>
  );
}
