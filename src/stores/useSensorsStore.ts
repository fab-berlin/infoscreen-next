import { create } from "zustand"
import {SensorListItem} from "@/types";

interface SensorsState {
  sensorsList: SensorListItem[]
  loadSensorsList: () => Promise<any>
  saveSensor: (uid: string) => Promise<any>
}

const getBaseUri = () => process.env.NEXT_PUBLIC_BASE_URI || ""

export const useSensorsStore = create<SensorsState>((set, get) => ({
  sensorsList: [],

  loadSensorsList: async () => {
    const response = await fetch(getBaseUri() + "sensors/read.php")
    const data: SensorListItem[] = await response.json()

    const sortedData = data.sort((a: any, b: any) => Number.parseInt(a.sort_order) - Number.parseInt(b.sort_order))

    set({ sensorsList: sortedData })

    return data
  },

  saveSensor: async (uid: string) => {
    const { sensorsList } = get()
    const data = sensorsList.filter((el) => el.uid === uid)[0]

    const response = await fetch(getBaseUri() + "sensors/update.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    return await response.json()
  },
}))
