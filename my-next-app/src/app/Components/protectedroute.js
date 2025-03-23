'use client'

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProtectAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") {
        router.replace("/login?redirect=/admin");  
      } else {
        setChecked(true);  
      }
    }
  }, [user, loading, router]);

  if (loading || !checked) {
    return <div className="text-center py-10">Verifying access...</div>;
  }

  return children;
};

export default ProtectAdminRoute;
