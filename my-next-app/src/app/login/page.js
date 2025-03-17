"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password });

      if (userData) {
        toast.success('Login successful');

        // Check if the user has the "admin" role
        if (userData.role === "admin") {
          router.push("/dashboardProduct"); // Redirect admins to dashboardProduct
        } else {
          router.push("/"); // Redirect non-admins to home page
        }
      }
    } catch (err) {
      toast.error('Invalid email or password');
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="flex h-screen">
         <ToastContainer
        position="bottom-right"
        autoClose={4001}
        limit={4}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Left Side - Image Section */}
      <div className="w-1/2 flex items-center justify-center bg-[#4A8C8C]">
        <img
          src="https://i.ibb.co/k6xkcTs5/image-15.png"
          alt="Login Illustration"
          className="max-w-full h-full"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email:
              </label>
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
              <label className="block text-sm font-medium mb-1" htmlFor="password">
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border rounded w-full p-2"
              />
            </div>

            <button
              type="submit"
              className="bg-[#4A8C8C] text-white py-2 px-4 rounded w-full hover:bg-[#3a7070] transition duration-300"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-4">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-500 hover:underline font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
