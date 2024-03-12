import DataProvider from "@/contexts/axios"
import useGlobalStore from "@/stores/useGlobalStore"

import { HomeView } from "../views"

const Home = () => {
  const { loadingState } = useGlobalStore((state) => state)
  return (
    <DataProvider>
      {loadingState && (
        <div className="w-full h-full fixed bg-[#00000080] flex justify-center items-center z-[999] inset-0">
          <span className="loading loading-dots text-[#14f195] loading-lg w-1/12" />
        </div>
      )}
      <HomeView />
    </DataProvider>
  )
}

export default Home
