import { ToastContainer } from "react-toastify"

export default function LoadingState() {
  return (
    <div className="min-h-screen bg-[#f9f6f2] flex justify-center items-center">
      <ToastContainer position="top-center" autoClose={5000} theme="colored" />
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#4A8C8C] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-[#4A8C8C] font-medium">Loading...</p>
      </div>
    </div>
  )
}

