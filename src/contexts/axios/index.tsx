"use client"

import React from "react"
import { axiosInstance } from "@/api"
import { checkWl, fetchTotalRise } from "@/api/lizard"
import useGlobalStore from "@/stores/useGlobalStore"
import useNftStore, { NftStoreState } from "@/stores/useNftStore"
import { useWallet } from "@solana/wallet-adapter-react"

const AxiosProvider = ({ children }: { children: React.ReactNode }) => {
  const wallet = useWallet()
  const { setLoadingState } = useGlobalStore((state) => state)

  const { setTotalRise } = useNftStore((state: NftStoreState) => state)
  React.useEffect(() => {
    setLoadingState(true)
    fetchTotalRise()
      .then((data) => {
        setTotalRise(data)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoadingState(false)
      })
    // if (wallet.publicKey) {
    //   checkWl(wallet.publicKey.toBase58())
    //     .then((data) => {

    //     })
    //     .catch((err) => {
    //       console.error(err)
    //     })
    // }
  }, [])

  return <React.Fragment>{children}</React.Fragment>
}

export default AxiosProvider
