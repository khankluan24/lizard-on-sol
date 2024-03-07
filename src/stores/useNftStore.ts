import { WhiteList } from "@/api/types"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

export interface NftStoreState {
  wl: WhiteList
  setWl: (_wl: NftStoreState["wl"]) => void
  totalMinted: number
  setTotalMinted: (_totalMinted: NftStoreState["totalMinted"]) => void
}

const initState = {
  wl: {} as WhiteList,
  totalMinted: 0,
}

const useNftStore = create<NftStoreState>()(
  devtools(
    persist(
      (set) => ({
        wl: initState.wl,
        setWl: (_wl: WhiteList = initState.wl) => set({ wl: _wl }),
        totalMinted: initState.totalMinted,
        setTotalMinted: (_totalMinted: number = initState.totalMinted) =>
          set({ totalMinted: _totalMinted }),
      }),
      {
        name: "LIZARD_ON_SOL",
        partialize: (state: NftStoreState) => ({
          wl: state.wl,
          totalMinted: state.totalMinted,
        }),
      }
    ),
    {
      enabled: true,
    }
  )
)

export default useNftStore
