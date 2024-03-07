import React, { useCallback, useContext } from "react"
import Image from "next/image"
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
      <p className="text-[#f7f6f4] font-creepster text-3xl text-center font-bold tracking-wider">
        6942 Rejected f00kers here to f00k shit up. 3 mints max per wallet.
        Free. f00k f00k Mother f00kers.
      </p>
      <h3 className="text-3xl leading-none font-bold mt-[25px] mb-5">
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
