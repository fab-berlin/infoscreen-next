import { create } from "zustand"

interface TimetableDragDropData {
  dragDropActive: boolean
  dragDropMoveActive: boolean
  activeDragItemData: Record<string, any>
  startingDay: number | null
  targetDay: number | null
}

interface Day {
  id: number
  name: string
}

interface TimetableState {
  timetableData: any[]
  timetableDragDropData: TimetableDragDropData
  daysList: Day[]
  initTimetable: () => void
  readTimetable: () => Promise<any>
  saveTimetable: (id: string, day: number, timetableData: any) => Promise<any>
}

const getBaseUri = () => process.env.NEXT_PUBLIC_BASE_URI || ""

export const useTimetableStore = create<TimetableState>((set, get) => ({
  timetableData: [],
  timetableDragDropData: {
    dragDropActive: false,
    dragDropMoveActive: false,
    activeDragItemData: {},
    startingDay: null,
    targetDay: null,
  },
  daysList: [
    { id: 0, name: "Montag" },
    { id: 1, name: "Dienstag" },
    { id: 2, name: "Mittwoch" },
    { id: 3, name: "Donnerstag" },
    { id: 4, name: "Freitag" },
  ],

  initTimetable: () => {
    const { daysList } = get()
    const timetableData: any[] = []

    daysList.forEach((a, index) => {
      timetableData[index] = {
        databaseId: "",
        hours: [],
      }
    })

    set({ timetableData })
  },

  readTimetable: async () => {
    const response = await fetch(getBaseUri() + "timetable/read.php")
    const data = await response.json()

    const { timetableData } = get()
    const newTimetableData = [...timetableData]

    data.forEach((day: any) => {
      newTimetableData[day.day] = {
        databaseId: day.id,
        hours: day.hours,
      }
    })

    set({ timetableData: newTimetableData })

    return data
  },

  saveTimetable: async (id: string, day: number, timetableData: any) => {
    const endpoint = id !== "" ? "timetable/update.php" : "timetable/create.php"
    const data = id !== "" ? { id, day, hours: timetableData } : { day, hours: timetableData }

    const response = await fetch(getBaseUri() + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    return await response.json()
  },
}))
