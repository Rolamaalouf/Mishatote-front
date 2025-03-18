import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectAdminRoute = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login"); // Redirect non-admins
    }
  }, [user, router]);

  return user?.role === "admin" ? children : null;
};

export default ProtectAdminRoute;
