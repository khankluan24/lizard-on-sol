import { FC } from "react"
import { AppProps } from "next/app"
import Head from "next/head"

import { AppBar } from "../components/AppBar"
import { ContentContainer } from "../components/ContentContainer"
import { Footer } from "../components/Footer"
import Notifications from "../components/Notification"
import { ContextProvider } from "../contexts/ContextProvider"

import "@/styles/globals.css"
import "@solana/wallet-adapter-react-ui/styles.css"

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Lizard On Sol</title>
      </Head>

      <ContextProvider>
        <div className="flex flex-col h-screen">
          <Notifications />
          <AppBar />
          <ContentContainer>
            <Component {...pageProps} />
            <Footer />
          </ContentContainer>
        </div>
      </ContextProvider>
    </>
  )
}

export default App
