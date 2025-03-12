// context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, credentials);
      setToken(response.data.token); // Assuming the token is returned in response.data.token
      localStorage.setItem('token', response.data.token); // Store token in local storage
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token'); // Clear token from local storage
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
