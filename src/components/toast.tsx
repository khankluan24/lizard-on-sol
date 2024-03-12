import React from "react"
import Link from "next/link"
import { ToastContainer } from "react-toastify"

const Toast = () => {
  return (
    <ToastContainer
      position="top-left"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      // closeOnClick
      rtl={false}
      pauseOnFocusLoss
      pauseOnHover
      theme="colored"
    />
  )
}

export default Toast

export const CustomToastWithLink = (tx: string) => (
  <Link href={`https://solscan.io/tx/${tx}`} target="_blank" >
    Mint successfully with transaction {tx}
  </Link>
)
