import { toast } from "react-toastify"

export const notify = (type, message) =>
  toast[type](message, {
    position: "top-center",
    autoClose: type === "error" ? 5000 : 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  })

