// pages/_app.js
import "@/styles/globals.css";
import { Belleza } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext"; // Adjust path as necessary

const belleza = Belleza({ subsets: ["latin"], weight: "400" });

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <main className={belleza.className}>
        <Component {...pageProps} />
      </main>
    </AuthProvider>
  );
}
