"use client"

import React, { createContext, useEffect, useMemo, useState } from "react"
import { checkWl } from "@/api/lizard"
import { candyMachineAddress } from "@/configs/dapp"
import { checkHasMinted } from "@/libs"
import useGlobalStore from "@/stores/useGlobalStore"
import useNftStore, { NftStoreState } from "@/stores/useNftStore"
import useUserSOLBalanceStore from "@/stores/useUserSOLBalanceStore"
import {
  CandyGuard,
  CandyMachine,
  DefaultGuardSet,
  fetchCandyMachine,
  mplCandyMachine,
  safeFetchCandyGuard,
} from "@metaplex-foundation/mpl-candy-machine"
import { generateSigner, KeypairSigner, Umi } from "@metaplex-foundation/umi"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { toast } from "react-toastify"

interface DataContextProps {
  umi: Umi | null
  nft: KeypairSigner | null
  candyMachine: CandyMachine | null
  candyGuard: CandyGuard<DefaultGuardSet> | null
  hasMinted: boolean
  setHasMinted: (_hasMinted: boolean) => void
}

export const DataContext = createContext<DataContextProps | null>(null)

const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { connection } = useConnection()
  const wallet = useWallet()
  const { setBalance } = useUserSOLBalanceStore((state) => state)
  const { setLoadingState } = useGlobalStore((state) => state)
  const { setTotalMinted } = useNftStore((state: NftStoreState) => state)

  const { setWl } = useNftStore((state: NftStoreState) => state)
  const [umi, setUmi] = useState<Umi | null>(null)
  const [nft, setNft] = useState<KeypairSigner | null>(null)
  const [candyMachine, setCandyMachine] = useState<CandyMachine | null>(null)
  const [candyGuard, setCandyGuard] = useState<CandyGuard | null>(null)
  const [hasMinted, setHasMinted] = useState(false)

  useEffect(() => {
    if (!wallet.publicKey) return
    const fetchData = async () => {
      setLoadingState(true)
      try {
        const wlData = await checkWl(wallet.publicKey!.toBase58())
        if (Object.entries(wlData).length === 0) {
          toast.error("Not a whitelist user")
        }
        setWl(wlData)
      } catch (err) {
        toast.error("Failed to get whitelist users")
        console.error(err)
      } finally {
        setLoadingState(false)
      }
    }
    fetchData()
  }, [wallet])

  useEffect(() => {
    if (!wallet.publicKey) return
    const fetchNftData = async () => {
      setLoadingState(true)
      try {
        let balance = await connection.getBalance(wallet.publicKey!)
        balance = parseFloat((balance / LAMPORTS_PER_SOL).toFixed(4))
        setBalance(balance)
        const umiInstance = createUmi(process.env.NEXT_PUBLIC_ENDPOINT_JSON_RPC as string)
          .use(walletAdapterIdentity(wallet))
          .use(mplCandyMachine())
        const nftMint = generateSigner(umiInstance)
        setUmi(umiInstance)
        setNft(nftMint)
        const candyMachineApi = await fetchCandyMachine(
          umiInstance,
          candyMachineAddress
        )
        const candyGuardApi = await safeFetchCandyGuard(
          umiInstance,
          candyMachineApi.mintAuthority
        )
        const minted = await checkHasMinted(wallet, connection)
        setHasMinted(minted)
        setCandyMachine(candyMachineApi)
        setCandyGuard(candyGuardApi)
        setTotalMinted(Number(candyMachineApi.itemsRedeemed))
      } catch (error) {
        toast.error("Failed to get NFT data")
        console.error(error)
      } finally {
        setLoadingState(false)
      }
    }
    fetchNftData()
  }, [wallet, connection])

  const DataContextData = useMemo(
    () => ({
      umi,
      nft,
      candyMachine,
      candyGuard,
      hasMinted,
      setHasMinted,
    }),
    [umi, nft, candyMachine, candyGuard, hasMinted]
  )

  return (
    <DataContext.Provider value={DataContextData}>
      {children}
    </DataContext.Provider>
  )
}

export default DataProvider
