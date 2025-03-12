// context/AuthContext.js
"use client"; // Mark this file as a Client Component

import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user data including role

  const login = async (credentials) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, credentials);
        const userData = response.data.user; // Accessing user data directly
        setUser(userData); // Store user data in context
        return userData; // Return user data for further processing
    } catch (error) {
        console.error('Login failed:', error);
        throw error; // Rethrow error for handling in LoginPage
    }
};


  const logout = () => {
    setUser(null); // Clear user data from context
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
