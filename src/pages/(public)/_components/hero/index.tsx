import React, { useCallback, useContext } from "react"
import Image from "next/image"
import Link from "next/link"
import { treasury } from "@/configs/dapp"
import { UmiContext } from "@/contexts/umi"
import useGlobalStore from "@/stores/useGlobalStore"
import useNftStore, { NftStoreState } from "@/stores/useNftStore"
import { mintV2 } from "@metaplex-foundation/mpl-candy-machine"
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox"
import { PublicKey, some, transactionBuilder } from "@metaplex-foundation/umi"
import { useWallet } from "@solana/wallet-adapter-react"
import base58 from "bs58"
import { toast } from "react-toastify"

const Hero = () => {
  const wallet = useWallet()
  const umiContext = useContext(UmiContext)
  const { totalMinted, wl } = useNftStore((state: NftStoreState) => state)
  const { setLoadingState } = useGlobalStore((state) => state)

  const mintNft = useCallback(async () => {
    try {
      setLoadingState(true)

      const transaction = transactionBuilder()
        .add(setComputeUnitLimit(umiContext?.umi!, { units: 900_000 }))
        .add(
          mintV2(umiContext?.umi!, {
            candyMachine: umiContext?.candyMachine?.publicKey as PublicKey,
            nftMint: umiContext?.nft!,
            candyGuard: umiContext?.candyGuard?.publicKey,
            collectionMint: umiContext?.candyMachine!
              .collectionMint as PublicKey,
            collectionUpdateAuthority: umiContext?.candyMachine!
              .authority as PublicKey,
            mintArgs: {
              solPayment: some({ destination: treasury }),
              mintLimit: some({ id: 1 }),
            },
          })
        )
      const { signature } = await transaction.sendAndConfirm(umiContext?.umi!, {
        confirm: { commitment: "confirmed" },
      })
      const tx = base58.encode(signature)
      toast.success(`Mint successfully with transaction ${tx}`)
      umiContext?.setHasMinted(true)
    } catch (error: any) {
      toast.error("Mint failed!")
      console.error(`Mint failed! ${error}`)
    } finally {
      setLoadingState(false)
    }
  }, [
    umiContext?.candyGuard?.publicKey,
    umiContext?.candyMachine,
    umiContext?.nft,
    umiContext?.umi,
  ])

  return (
    <div className="flex flex-col items-center mt-10 mb-12 gap-5">
      <Image
        src="/logo-trans.png"
        alt="logo transparent"
        width={250}
        height={250}
      />
      <p className="text-[#f7f6f4] text-xl text-center font-bold tracking-wider">
        Welcome to The Solana Lizard - 300 highly detailed hand drawn cute,
        crazy, and loveable Lizards. Every Lizard and trait are hand drawn by
        the talented artist. Making each and every Lizard unique and valuable.
      </p>
      <div className="flex gap-4">
        <Link
          href="https://twitter.com/LIZAonSol"
          target="_blank"
          className="w-12 h-12 p-3 bg-white border-2 border-black rounded-xl hover:opacity-70 transition-all duration-300 cursor-pointer"
        >
          <Image src="/twitter.svg" alt="twitter" width={23} height={23} />
        </Link>
        <Link
          href="https://t.me/LIZAOnSol"
          target="_blank"
          className="w-12 h-12 p-3 bg-white border-2 border-black rounded-xl hover:opacity-70 transition-all duration-300 cursor-pointer"
        >
          <Image src="/telegram.svg" alt="telegram" width={23} height={23} />
        </Link>
      </div>
      <h3 className="text-3xl leading-none font-bold mt-[25px] mb-5 text-center">
        Total Minted : {totalMinted}/300
      </h3>
      {Object.entries(wl).length === 0 && <h1>Mint is private.</h1>}
      <button
        onClick={mintNft}
        className="btn glass rounded"
        disabled={
          Object.entries(wl).length === 0 ||
          umiContext?.hasMinted ||
          !wallet.connected
        }
      >
        Mint button
      </button>
    </div>
  )
}

export default Hero
