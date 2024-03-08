"use client"

import React from "react"
import { checkWl } from "@/api/lizard"
import useGlobalStore from "@/stores/useGlobalStore"
import useNftStore, { NftStoreState } from "@/stores/useNftStore"
import { useWallet } from "@solana/wallet-adapter-react"
import { toast } from "react-toastify"

const AxiosProvider = ({ children }: { children: React.ReactNode }) => {
  const wallet = useWallet()
  const { setLoadingState } = useGlobalStore((state) => state)

  const { setWl } = useNftStore((state: NftStoreState) => state)

  React.useEffect(() => {
    const fetchData = async () => {
      setLoadingState(true)
      if (wallet.publicKey) {
        try {
          const wlData = await checkWl(wallet.publicKey.toBase58())
          if (Object.entries(wlData).length == 0) {
            toast.error("Not a whitelist user")
          }
          setWl(wlData)
        } catch (err) {
          toast.error("Not a whitelist user")
          console.error(err)
        } finally {
          setLoadingState(false)
        }
      }
    }
    fetchData()
  }, [setLoadingState, setWl, wallet])

  return <React.Fragment>{children}</React.Fragment>
}

export default AxiosProvider
