"use client"

import { createContext, useEffect, useMemo, useState } from "react"
import { candyMachineAddress } from "@/configs/dapp"
import { checkHasMinted } from "@/libs"
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
import {
  useConnection,
  useWallet,
  WalletContextState,
} from "@solana/wallet-adapter-react"
import { clusterApiUrl } from "@solana/web3.js"

interface UmiContextProps {
  umi: Umi | null
  nft: KeypairSigner | null
  candyMachine: CandyMachine | null
  candyGuard: CandyGuard<DefaultGuardSet> | null
  hasMinted: boolean
  setHasMinted: (_hasMinted: boolean) => void;
}

export const UmiContext = createContext<UmiContextProps | null>(null)

const UmiProvider = ({ children }: { children: React.ReactNode }) => {
  const wallet = useWallet()
  const [umi, setUmi] = useState<Umi | null>(null)
  const [nft, setNft] = useState<KeypairSigner | null>(null)
  const [candyMachine, setCandyMachine] = useState<CandyMachine | null>(null)
  const [candyGuard, setCandyGuard] = useState<CandyGuard | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasMinted, setHasMinted] = useState(false)
  const { connection } = useConnection()

  const getCandyMachine = async (_umi: Umi) => {
    try {
      const candyMachineApi = await fetchCandyMachine(_umi, candyMachineAddress)
      const candyGuardApi = await safeFetchCandyGuard(
        _umi,
        candyMachineApi.mintAuthority
      )
      const minted = await checkHasMinted(wallet, connection)
      setHasMinted(minted)
      setCandyMachine(candyMachineApi)
      setCandyGuard(candyGuardApi)
    } catch (err) {
      setError("Failed to get NFT data")
      console.error(err)
    }
  }

  useEffect(() => {
    if (wallet.connected) {
      const umiInstance = createUmi(clusterApiUrl("devnet"))
        .use(walletAdapterIdentity(wallet))
        .use(mplCandyMachine())
      setUmi(umiInstance)
      const nftMint = generateSigner(umiInstance)
      setNft(nftMint)

      getCandyMachine(umiInstance)
    }
  }, [wallet])

  const umiContextData = useMemo(
    () => ({
      umi,
      nft,
      candyMachine,
      candyGuard,
      hasMinted,
      setHasMinted
    }),
    [umi, nft, candyMachine, candyGuard, hasMinted]
  )

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <UmiContext.Provider value={umiContextData}>{children}</UmiContext.Provider>
  )
}

export default UmiProvider
