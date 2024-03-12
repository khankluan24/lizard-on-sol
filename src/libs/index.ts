import { TREASURY_ID } from "@/configs/dapp"
import { Metaplex } from "@metaplex-foundation/js"
import { WalletContextState } from "@solana/wallet-adapter-react"
import { Connection } from "@solana/web3.js"

export const checkHasMinted = async (
  wallet: WalletContextState,
  connection: Connection
) => {
  const metaplex = Metaplex.make(connection)
  const ownerNfts = await metaplex
    .nfts()
    .findAllByOwner({ owner: wallet.publicKey! })

  if (ownerNfts.length === 0) {
    return false
  }
  const foundNft = ownerNfts.find(
    (el) => el.updateAuthorityAddress.toBase58() === TREASURY_ID
  )

  if (foundNft) {
    return true
  }
  return false
}
