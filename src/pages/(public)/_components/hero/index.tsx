import React from "react"
import Image from "next/image"

type Props = {}

const Hero = (props: Props) => {
  return (
    <div className="flex flex-col items-center mt-10 mb-12 gap-5">
      <Image src='/logo-trans.png' alt="logo transparent" width={250} height={250}></Image>
      <p className="text-[#f7f6f4] font-creepster text-3xl text-center font-bold tracking-wider">
        6942 Rejected f00kers here to f00k shit up. 3 mints max per wallet.
        Free. f00k f00k Mother f00kers.
      </p>
      <h3 className="text-3xl leading-none font-bold mt-[25px] mb-5">
        Total Minted : 0/0
      </h3>
      {/* <span className="countdown">
        <span style={{ "--value": 52 }}></span>
      </span> */}
      <h1>Mint is private.</h1>
      <button className="btn glass rounded">Mint button</button>
    </div>
  )
}

export default Hero
