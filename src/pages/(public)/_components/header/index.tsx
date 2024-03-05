import React from "react"
import useUserSOLBalanceStore from "@/stores/useUserSOLBalanceStore"
import { cn } from "@/utils"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

import styles from "./Index.module.scss"

type Props = {}

const Header = (props: Props) => {
  const { publicKey } = useWallet()
  const { balance } = useUserSOLBalanceStore((state) => state)
  return (
    <div className="flex items-center justify-end">
      <div className="flex flex-row flex-wrap z-30 relative m-7">
        {publicKey ? (
          <div className={cn("opacity-95", styles.wallet__amount)}>
            {(balance ?? 0)} SOL
            <WalletMultiButton className="!btn !glass transition-all duration-200 hover:!bg-transparent hover:scale-105" />
          </div>
        ) : (
          <WalletMultiButton className="!btn !glass transition-all duration-200 hover:!bg-transparent hover:scale-105">
            Connect Wallet
          </WalletMultiButton>
        )}
      </div>
    </div>
  )
}

export default Header
