import { AppProps } from "next/app"
import Head from "next/head"

import { ContextProvider } from "../contexts/ContextProvider"

import "@/styles/globals.css"
import "@solana/wallet-adapter-react-ui/styles.css"
import "@fontsource/creepster"
import "@fontsource/fugaz-one"
import "react-toastify/dist/ReactToastify.css"

import Header from "./(public)/_components/header"
import Toast from "@/components/toast"

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>The Lizard Solana</title>
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link
          rel="apple-touch-icon"
          href="/apple-icon.png"
          type="image/png"
          sizes="180x180"
        />
      </Head>

      <ContextProvider>
        <Header />
        <Component {...pageProps} />
        <Toast/>
      </ContextProvider>
    </>
  )
}

export default App
