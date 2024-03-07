import { FC, ReactNode, useCallback, useMemo } from "react"
import dynamic from "next/dynamic"
import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base"
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react"
import { ExodusWalletAdapter, MathWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { Cluster, clusterApiUrl } from "@solana/web3.js"

import { AutoConnectProvider, useAutoConnect } from "./AutoConnectProvider"
import {
  NetworkConfigurationProvider,
  useNetworkConfiguration,
} from "./NetworkConfigurationProvider"
import { Connection } from '@solana/web3.js';

const ReactUIWalletModalProviderDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
  { ssr: false }
)

const WalletContextProvider = ({ children }: { children: ReactNode }) => {
  const { autoConnect } = useAutoConnect()
  const { networkConfiguration } = useNetworkConfiguration()
  const network = WalletAdapterNetwork.Devnet
  
  const endpoint = useMemo(() => clusterApiUrl(network), [network])
  const connection = new Connection('https://api.devnet.solana.com');
  console.log(network);
  
  const wallets = useMemo(() => [ new SolflareWalletAdapter(), new ExodusWalletAdapter(), new MathWalletAdapter()], [network])

  const onError = useCallback((error: WalletError) => {
    console.error(error)
  }, [])

  return (
    // TODO: updates needed for updating and referencing endpoint: wallet adapter rework
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        onError={onError}
        autoConnect={true}
      >
        <ReactUIWalletModalProviderDynamic>
          {children}
        </ReactUIWalletModalProviderDynamic>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <NetworkConfigurationProvider>
        <AutoConnectProvider>
          <WalletContextProvider>{children}</WalletContextProvider>
        </AutoConnectProvider>
      </NetworkConfigurationProvider>
    </>
  )
}
