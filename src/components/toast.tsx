import React from "react"
import { ToastContainer } from "react-toastify"

const Toast = () => {
  return (
    <ToastContainer
      position="top-left"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      pauseOnHover
      theme="colored"
    />
  )
}

export default Toast
