import { create } from "zustand"

export interface GLobalStoreState {
  loadingState: boolean
}
export interface GLobalStoreAction {
  setLoadingState: (_loadingState: GLobalStoreState["loadingState"]) => void
}

const useGlobalStore = create<GLobalStoreState & GLobalStoreAction>()(
  (set) => ({
    loadingState: false,
    setLoadingState: (_loadingState = false) =>
      set(() => ({ loadingState: _loadingState })),
  })
)

export default useGlobalStore
