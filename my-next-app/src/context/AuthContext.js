"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // Start with undefined to differentiate between loading & not logged in
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      console.log("Fetching user...");
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          method: "GET",
          credentials: "include",
        });
  
        console.log(" Response:", response.status);
  
        if (response.ok) {
          const userData = await response.json();
          console.log("User fetched:", userData.user);
          setUser(userData.user);
        } else {
          console.warn("Failed to fetch user");
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, []);
  

  // Login function
  const login = async ({ email, password }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Ensure cookies are sent
      });

      if (!response.ok) throw new Error("Login failed");

      const userData = await response.json();
      setUser(userData.user);

      // Redirect after login if `redirect` exists in URL
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get("redirect") || "/checkout"; // Default to checkout if no redirect param
      router.push(redirectTo);

      return userData.user;
    } catch (err) {
      throw new Error("Login failed. Check credentials.");
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null);
        router.push("/login");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout,loading}}>
      {children}
    </AuthContext.Provider>
  );
};
