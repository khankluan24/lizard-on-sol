import { FC, useCallback } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL, TransactionSignature } from "@solana/web3.js"

import useUserSOLBalanceStore from "../stores/useUserSOLBalanceStore"

export const RequestAirdrop: FC = () => {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  // const { getUserSOLBalance } = useUserSOLBalanceStore()

  const onClick = useCallback(async () => {
    if (!publicKey) {
      console.log("error", "Wallet not connected!")
      return
    }

    let signature: TransactionSignature = ""

    try {
      signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL)

      // Get the lates block hash to use on our transaction and confirmation
      let latestBlockhash = await connection.getLatestBlockhash()
      await connection.confirmTransaction(
        { signature, ...latestBlockhash },
        "confirmed"
      )

      // getUserSOLBalance(publicKey, connection)
    } catch (error: any) {
      console.log("error", `Airdrop failed! ${error?.message}`, signature)
    }
  }, [publicKey, connection])

  return (
    <div className="flex flex-row justify-center">
      <div className="relative group items-center">
        <div
          className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 
                    rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"
        ></div>

        <button
          className="px-8 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
          onClick={onClick}
        >
          <span>Airdrop 1 </span>
        </button>
      </div>
    </div>
  )
}
