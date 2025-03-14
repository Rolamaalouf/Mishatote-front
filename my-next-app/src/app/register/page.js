"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
        { name, address, email, password },
        { withCredentials: true }  // Ensures cookies are sent with the request
      );

      if (response.status === 201) {
        toast.success('Login successful');
        router.push("/login"); // Redirect to login page after successful registration
      }
    } catch (err) {
      toast.error('Invalid email or password');
      setError("Unable to sign up");
    }
  };

  return (
    <div className="flex h-screen">
       <ToastContainer
        position="top-left"
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
      {/* Left Side - Register Form */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border rounded w-full p-2"
              />
            </div>

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

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="address">
                Address:
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="border rounded w-full p-2"
              />
            </div>

            <button
  type="submit"
  className="bg-[#A68F7B] text-white py-2 px-4 rounded w-full hover:bg-[#8C7260] transition duration-300"
>
              Sign up
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Image Section */}
      <div className="w-1/2 flex items-center justify-center bg-[#A68F7B]">
        <img
          src="https://i.ibb.co/N2Rj5mV1/7e0a7f2e-c735-4fad-b385-ab6dbc5a67d8-removalai-preview.png"
          alt="Register Illustration"
          className="max-w-full h-auto"
        />
      </div>
    </div>
  );
};

export default RegisterPage;

