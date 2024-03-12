import React, { useCallback, useContext } from "react"
import Image from "next/image"
import Link from "next/link"
import { treasury } from "@/configs/dapp"
import { DataContext } from "@/contexts/axios"
import useGlobalStore from "@/stores/useGlobalStore"
import useNftStore, { NftStoreState } from "@/stores/useNftStore"
import { cn } from "@/utils"
import { mintV2 } from "@metaplex-foundation/mpl-candy-machine"
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox"
import { PublicKey, some, transactionBuilder } from "@metaplex-foundation/umi"
import { useWallet } from "@solana/wallet-adapter-react"
import base58 from "bs58"
import { toast } from "react-toastify"

import { CustomToastWithLink } from "@/components/toast"

const Hero = () => {
  const wallet = useWallet()
  const dataContext = useContext(DataContext)
  const { totalMinted, wl } = useNftStore((state: NftStoreState) => state)
  const { setLoadingState } = useGlobalStore((state) => state)

  const mintNft = useCallback(async () => {
    try {
      setLoadingState(true)

      const transaction = transactionBuilder()
        .add(setComputeUnitLimit(dataContext?.umi!, { units: 900_000 }))
        .add(
          mintV2(dataContext?.umi!, {
            candyMachine: dataContext?.candyMachine?.publicKey as PublicKey,
            nftMint: dataContext?.nft!,
            candyGuard: dataContext?.candyGuard?.publicKey,
            collectionMint: dataContext?.candyMachine!
              .collectionMint as PublicKey,
            collectionUpdateAuthority: dataContext?.candyMachine!
              .authority as PublicKey,
            mintArgs: {
              solPayment: some({ destination: treasury }),
              mintLimit: some({ id: 1 }),
            },
          })
        )
      const { signature } = await transaction.sendAndConfirm(
        dataContext?.umi!,
        {
          confirm: { commitment: "confirmed" },
        }
      )

      const tx = base58.encode(signature)
      toast.success(CustomToastWithLink(tx))
      dataContext?.setHasMinted(true)
    } catch (error: any) {
      toast.error("Mint failed!")
      console.error(`Mint failed! ${error}`)
    } finally {
      setLoadingState(false)
    }
  }, [
    dataContext?.candyGuard?.publicKey,
    dataContext?.candyMachine,
    dataContext?.nft,
    dataContext?.umi,
  ])
  return (
    <div className="flex flex-col items-center mt-10 mb-12 gap-5">
      <p className="text-[#f7f6f4] text-sm md:text-xl text-center font-bold tracking-wider">
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
      <div className="flex justify-between w-full md:w-1/2">
        <div className="flex flex-col">
          <span className="font-bold">WL Mint.</span>
          <span
            className={cn(
              "text-sm",
              Object.entries(wl).length === 0 ? "text-gray-400" : "text-primary"
            )}
          >
            {Object.entries(wl).length === 0
              ? "You are not eligible"
              : "You are eligible"}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-secondary text-end">In progress</span>
          <span>2024-03-07 - 13:00:00</span>
        </div>
      </div>
      <div className="flex justify-between w-full md:w-1/2">
        <div className="flex flex-col">
          <span className="font-bold">Price</span>
          <span>1 - SOL</span>
        </div>
        <div className="flex gap-8">
          <div className="flex flex-col text-end">
            <span className="font-bold">Max Supply</span>
            <span className=" text-center">300</span>
          </div>
          <div className="flex flex-col text-center">
            <span className="font-bold">Limit</span>
            <span>1</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full md:w-1/2">
        <div className="flex justify-between text-xl leading-none font-bold mt-[25px] mb-5 text-center">
          <h3 className="">Total minted</h3>
          <span>({totalMinted}/300)</span>
        </div>
        <progress
          className="progress border border-white h-4"
          value={totalMinted}
          max="300"
        ></progress>
      </div>
      {Object.entries(wl).length === 0 && <h1>Mint is private.</h1>}
      <button
        onClick={mintNft}
        className={cn(
          "btn gradient-btn disabled:!glass disabled:bg-none rounded w-36 hover:scale-105"
        )}
        disabled={
          Object.entries(wl).length === 0 ||
          dataContext?.hasMinted ||
          !wallet.connected
        }
      >
        {dataContext?.hasMinted && wallet.connected ? "Minted" : "Mint"}
      </button>
    </div>
  )
}

export default Hero
