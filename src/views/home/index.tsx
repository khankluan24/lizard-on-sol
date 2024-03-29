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
    src: "/images/1.webp",
  },
  {
    className: styles["cloud-2"],
    src: "/images/2.webp",
  },
  {
    className: styles["cloud-3"],
    src: "/images/3.webp",
  },
  {
    className: styles["cloud-4"],
    src: "/images/4.webp",
  },
  {
    className: styles["cloud-5"],
    src: "/images/5.webp",
  },
  {
    className: styles["cloud-6"],
    src: "/images/6.webp",
  },
  {
    className: styles["cloud-7"],
    src: "/images/7.webp",
  },
]

const renderCloudList = cloudList.map((item, index) => (
  <div className={cn("absolute opacity-40", item.className)} key={index}>
    <Image
      src={item.src}
      alt="bg"
      width={350}
      height={350}
      priority={index === 5 ? true : false}
    />
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
