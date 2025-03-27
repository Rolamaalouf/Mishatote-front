"use client"; // Required for client components

import "@/styles/globals.css";
import { Belleza } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext"; // Ensure correct path
import { CartProvider } from "../context/CartContext";
import { Suspense } from "react"; // Import Suspense from React

const belleza = Belleza({ subsets: ["latin"], weight: "400" });

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <html lang="en">
          <body className={belleza.className}>
            {/* Wrap children inside Suspense */}
            <Suspense fallback={<div>Loading...</div>}>
              {children}
            </Suspense>
          </body>
        </html>
      </CartProvider>
    </AuthProvider>
  );
}
