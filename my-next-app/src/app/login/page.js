"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams(); // Correctly used inside a client component
  const [redirect, setRedirect] = useState("/"); // Default redirect

  const [error, setError] = useState("");

  // Use effect to set redirect URL from search params
  useEffect(() => {
    const redirectUrl = searchParams.get("redirect");
    if (redirectUrl) setRedirect(redirectUrl);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password });

      if (userData) {
        router.push(redirect); // Redirect back to checkout or intended page
      }
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block mb-1" htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border rounded w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border rounded w-full p-2"
          />
        </div>
        <button type="submit" className="bg-[#4A8C8C] text-white py-2 px-4 rounded">
          Login
        </button>
      </form>
      <p className="text-sm text-gray-600">
        Don't have an account?{" "}
        <Link href="/register" className="text-blue-500 hover:underline font-medium">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
