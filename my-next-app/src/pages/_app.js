import "@/styles/globals.css";
import { Belleza } from "next/font/google";

const belleza = Belleza({ subsets: ["latin"], weight: "400" });

export default function App({ Component, pageProps }) {
  return (
    <main className={belleza.className}>
      <Component {...pageProps} />
    </main>
  );
}
