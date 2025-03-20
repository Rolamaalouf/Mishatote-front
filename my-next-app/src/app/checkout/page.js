"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Checkout from "../Components/Checkout";
import Header from "../Components/header";

export default function CheckoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user === undefined) return;  
    if (user === null) {
      router.push(`/login?redirect=${pathname}`);
    }
  }, [user, router, pathname]);

  if (user === undefined || user === null) return null;  

  return (
    <>
      <Header />
      <div className="mt-30"></div>
      <Checkout />
    </>
  );
}
