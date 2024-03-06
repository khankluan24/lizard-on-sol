import React, { useCallback } from "react"
import Image from "next/image"
import { keypairIdentity, Metaplex } from "@metaplex-foundation/js"
import {
  fetchCandyGuard,
  fetchCandyMachine,
  getMerkleRoot,
  mintV2,
  mplCandyMachine,
  safeFetchCandyGuard,
} from "@metaplex-foundation/mpl-candy-machine"
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox"
import {
  generateSigner,
  publicKey,
  some,
  transactionBuilder,
} from "@metaplex-foundation/umi"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters"
import { useWallet } from "@solana/wallet-adapter-react"
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js"

const CANDY_MACHINE_ID = "FQatJTLee4XsRg5AM2QCkj7WmmjDwdcX6SvJQayZF9Y5"
const allowList = [
  "4s6rNxhiLQ1VJbDSi1JsNE9Eoo845r1rT4MWuUnZetHA",
  "ATEPjBj4j36wA1XB12X1crvbXMpj3D3q9HgKgXuY9MFM",
]
const treasury = publicKey("HEKx4kKe3GMmEnFk7joddscwW4EGRq6BM8ne2KwX7GWr")

const Hero = () => {
  const wallet = useWallet()
  const umi = createUmi(clusterApiUrl("devnet"))
    .use(walletAdapterIdentity(wallet))
    .use(mplCandyMachine())

  const onClick = useCallback(async () => {
    const candyMachineAddress = publicKey(CANDY_MACHINE_ID)
    const candyMachine = await fetchCandyMachine(umi, candyMachineAddress)
    const candyGuard = await safeFetchCandyGuard(
      umi,
      candyMachine.mintAuthority
    )

    try {
      const nftMint = generateSigner(umi)
      const transaction = await transactionBuilder()
        .add(setComputeUnitLimit(umi, { units: 800_000 }))
        .add(
          mintV2(umi, {
            candyMachine: candyMachine.publicKey,
            candyGuard: candyGuard?.publicKey,
            nftMint,
            collectionMint: candyMachine.collectionMint,
            collectionUpdateAuthority: candyMachine.authority,
            group: some("WL"),
            mintArgs: {
              solPayment: some({ destination: treasury }),
              allowList: some({
                merkleRoot: getMerkleRoot(allowList),
              }),
            },
          })
        )
      const { signature } = await transaction.sendAndConfirm(umi, {
        confirm: { commitment: "confirmed" },
      })
    } catch (error: any) {
      console.error("error", `Mint failed! ${error?.message}`)
    }
  }, [umi])
  return (
    <div className="flex flex-col items-center mt-10 mb-12 gap-5">
      <Image
        src="/logo-trans.png"
        alt="logo transparent"
        width={250}
        height={250}
      ></Image>
      <p className="text-[#f7f6f4] font-creepster text-3xl text-center font-bold tracking-wider">
        6942 Rejected f00kers here to f00k shit up. 3 mints max per wallet.
        Free. f00k f00k Mother f00kers.
      </p>
      <h3 className="text-3xl leading-none font-bold mt-[25px] mb-5">
        Total Minted : 0/0
      </h3>
      <h1>Mint is private.</h1>
      <button onClick={onClick} className="btn glass rounded">
        Mint button
      </button>
    </div>
  )
}

export default Hero

// const keypair = Keypair.generate()

// const METAPLEX = Metaplex.make(new Connection(clusterApiUrl("devnet"))).use(
//   keypairIdentity(keypair)
// )

const mintNft = async () => {
  // const candyMachine = await METAPLEX.candyMachines().findByAddress({
  //   address: new PublicKey(CANDY_MACHINE_ID),
  // })
  // let { nft, response } = await METAPLEX.candyMachines().mint(
  //   {
  //     candyMachine,
  //     collectionUpdateAuthority: wallet.publicKey!,
  //     group: "WL"
  //   },
  //   { commitment: "finalized" }
  // )
}
