import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

export interface NftStoreState {
  totalRise: WhiteList
  setTotalRise: (_totalRise: NftStoreState["totalRise"]) => void
}

const initState = {
  totalRise: {
    _id: "",
    address: "",
    currentbuy: 0,
  },
}

const useNftStore = create<NftStoreState>()(
  devtools(
    persist(
      (set) => ({
        totalRise: initState.totalRise,
        setTotalRise: (_totalRise: WhiteList = initState.totalRise) =>
          set({ totalRise: _totalRise }),
      }),
      {
        name: "LIZARD_ON_SOL",
        partialize: (state: NftStoreState) => ({
          totalRise: state.totalRise,
        }),
      }
    ),
    {
      enabled: true,
    }
  )
)

export default useNftStore
