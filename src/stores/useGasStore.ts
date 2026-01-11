import {create} from "zustand"

interface GasConsumptionEntry {
  date: string
  deltaDay: number

  [key: string]: any
}

interface GasState {
  gasConsumptionEntries: GasConsumptionEntry[]
  loadGasEntries: () => Promise<any>
}

function normalizeGasEntries(data: any[]): GasConsumptionEntry[] {
  const normalizedData = data
  let previousValue = 0

  data.forEach((el, index) => {
    const normalizedDate = new Date(el.date);



    normalizedDate.setHours(0, 0, 0)
    el.deltaDay = index === 0 ? 0 : (normalizedDate.getTime() - previousValue) / (1000 * 60 * 60 * 24)
    previousValue = normalizedDate.getTime()
  })

  return normalizedData
}

const getBaseUri = () => process.env.NEXT_PUBLIC_BASE_URI || ""

export const useGasStore = create<GasState>((set) => ({
  gasConsumptionEntries: [],

  loadGasEntries: async () => {
    const response = await fetch(getBaseUri() + "gasConsumption/read.php")
    const data = await response.json()

    set({gasConsumptionEntries: normalizeGasEntries(data)})

    return data
  },
}))
