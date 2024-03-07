// Next, React
import { useEffect } from "react"
import Image from "next/image"
import Hero from "@/pages/(public)/_components/hero"
import useGlobalStore from "@/stores/useGlobalStore"
import useUserSOLBalanceStore from "@/stores/useUserSOLBalanceStore"
import { cn } from "@/utils"
// Wallet
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"

// Store
import styles from "./Index.module.scss"

const cloudList = [
  {
    className: styles["cloud-1"],
  },
  {
    className: styles["cloud-2"],
  },
  {
    className: styles["cloud-3"],
  },
  {
    className: styles["cloud-4"],
  },
  {
    className: styles["cloud-5"],
  },
  {
    className: styles["cloud-6"],
  },
  {
    className: styles["cloud-7"],
  },
]

const renderCloudList = cloudList.map((item, index) => (
  <div className={cn("absolute opacity-40", item.className)} key={index}>
    <div className={styles.cloud}></div>
  </div>
))

const renderMarqueeList = (num: number): React.ReactNode =>
  num == 1
    ? [...Array(45)].map((_, index) => (
        <Image
          key={index}
          src={`/nfts/${index + 1}.png`}
          height={200}
          width={200}
          alt="img"
          className=" max-w-[200px] p-1 rounded-[10px]"
          priority
        />
      ))
    : [...Array(45)].map((_, index) => (
        <Image
          key={index}
          src={`/nfts/${44 + index + 1}.png`}
          height={200}
          width={200}
          alt="img"
          className=" max-w-[200px] p-1 rounded-[10px]"
        />
      ))

export const HomeView = () => {
  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const { setLoadingState } = useGlobalStore((state) => state)

  const { setBalance } = useUserSOLBalanceStore((state) => state)

  const fetchBalance = async () => {
    if (publicKey) {
      let balance = await connection.getBalance(publicKey)
      balance = parseFloat((balance / LAMPORTS_PER_SOL).toFixed(4))
      setBalance(balance)
    }
  }
  useEffect(() => {
    setLoadingState(true)

    fetchBalance()
      .then(() => {
        console.log("Get balance successfully")
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoadingState(false)
      })
  }, [publicKey, connection])

  return (
    <>
      <div className="relative z-10">
        <div className={styles.cloud__content}>{renderCloudList}</div>
      </div>
      <div className={cn("z-10", styles.container)}>
        <Hero />
      </div>
      <div className="relative z-50">
        <div className={styles.marquee__wrapper}>
          <div className={styles.marquee}>{renderMarqueeList(1)}</div>
        </div>
      </div>
      <div className="relative z-50">
        <div className={styles.marquee__wrapper}>
          <div className={cn(styles.marquee, styles.marquee__2)}>
            {renderMarqueeList(2)}
          </div>
        </div>
      </div>
    </>
  )
}
