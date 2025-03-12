import Head from "next/head";
import Header from "@/Components/header"; // Ensure correct path

export default function Home() {
  return (
    <div className="relative w-full h-screen">
      <Head>
        <title>Tote Shop</title>
      </Head>

      {/* Header */}
      <Header />

      {/* Cover Image as Background */}
      <div className="absolute inset-0 -z-10 aspect-[4/3]"> {/* Maintain 4:3 Aspect Ratio */}
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('https://i.ibb.co/PGvyV6vv/Group-1-2.png')",
            backgroundSize: "cover", // Ensures the image covers the entire area
            backgroundPosition: "center", // Centers the image
            backgroundRepeat: "no-repeat", // Prevents tiling
          }}
        ></div>
      </div>

      {/* Hero Content */}
      <div className="absolute top-1/3 left-20 max-w-lg">
        <h1 className="font-belleza text-[110px] leading-tight text-black">
          Carry your <br /> dreams in a <br /> tote
        </h1>
        <button className="mt-6 px-8 py-3 text-lg font-semibold bg-[#4A8C8C] text-white rounded">
          Collections
        </button>
      </div>
    </div>
  );
}
