import { create } from "zustand"

interface LessonsState {
  lessons: Record<string, any>
  readLessons: () => Promise<any>
  createLesson: (lessonData: any) => Promise<any>
  updateLesson: (lessonData: any) => Promise<any>
  deleteLesson: (id: string) => Promise<any>
}

const getBaseUri = () => process.env.NEXT_PUBLIC_BASE_URI || ""

export const useLessonsStore = create<LessonsState>((set) => ({
  lessons: {},

  readLessons: async () => {
    const response = await fetch(getBaseUri() + "lesson/read.php")
    const data = await response.json()

    set({ lessons: data })

    return data
  },

  createLesson: async (lessonData: any) => {
    const response = await fetch(getBaseUri() + "lesson/create.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lessonData),
    })

    return await response.json()
  },

  updateLesson: async (lessonData: any) => {
    const response = await fetch(getBaseUri() + "lesson/update.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lessonData),
    })

    return await response.json()
  },

  deleteLesson: async (id: string) => {
    const response = await fetch(getBaseUri() + "lesson/delete.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })

    return await response.json()
  },
}))
