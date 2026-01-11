import { create } from "zustand"

interface Message {
  date_of_creation: {
    day: string
    month: string
    year: number
  }
  [key: string]: any
}

interface MessagesData {
  data: Message[]
  numberOfMessages: number
}

interface MessagesState {
  messages: MessagesData
  readMessages: (options: any) => Promise<any>
  createMessage: (messageData: any) => Promise<any>
}

function processMessageData(messageData: {
  data: any[]
  options: any
}): MessagesData {
  const processedData: MessagesData = {
    data: [],
    numberOfMessages: 0,
  }

  messageData.data.sort((a, b) => {
    const keyA = new Date(a.date_of_creation)
    const keyB = new Date(b.date_of_creation)
    if (keyA < keyB) return 1
    if (keyA > keyB) return -1
    return 0
  })

  processedData.numberOfMessages = messageData.data.length

  messageData.data.map((el) => {
    const date = new Date(el.date_of_creation)
    el.date_of_creation = {
      day: date.toLocaleDateString("de-de", { day: "2-digit" }),
      month: date.toLocaleDateString("de-de", { month: "long" }),
      year: date.getFullYear(),
    }
  })

  if (messageData.options.numberOfMessages) {
    processedData.data = messageData.data.splice(0, messageData.options.numberOfMessages)
    processedData.numberOfMessages -= messageData.options.numberOfMessages
  } else {
    processedData.data = messageData.data
  }

  return processedData
}

const getBaseUri = () => process.env.NEXT_PUBLIC_BASE_URI || ""

export const useMessagesStore = create<MessagesState>((set) => ({
  messages: {
    data: [],
    numberOfMessages: 0,
  },

  readMessages: async (options: any) => {
    const response = await fetch(getBaseUri() + "messages/read.php")
    const data = await response.json()

    const processedMessages = processMessageData({ data, options })

    set({ messages: processedMessages })

    return data
  },

  createMessage: async (messageData: any) => {
    const response = await fetch(getBaseUri() + "messages/create.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messageData),
    })

    return await response.json()
  },
}))
