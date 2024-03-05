import { create } from "zustand"

interface UserSOLBalanceStore {
  balance: number
  setBalance: (_balance: UserSOLBalanceStore["balance"]) => void
}

const useUserSOLBalanceStore = create<UserSOLBalanceStore>()((set) => ({
  balance: 0,
  setBalance: (_balance: UserSOLBalanceStore["balance"] = 0) =>
    set({ balance: _balance }),
}))

export default useUserSOLBalanceStore
