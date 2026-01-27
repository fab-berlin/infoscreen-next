import { create } from "zustand"
import {OwmData, WeatherSensorData} from "@/types";

// Types
interface WeatherState {
  sensorData: WeatherSensorData[]
  owmData: OwmData
  outsideSensorData: Record<string, any>
  updateTime: string | null
  loadSensorData: () => Promise<any>
  loadOwmWeather: () => Promise<any>
}

// Helper Functions
function insideSensors(val: any): boolean {
  if (val.name) {
    return val.name.toLowerCase().indexOf("außen") === -1
  }
  return false
}

function outsideSensors(val: any): boolean {
  if (val.name) {
    return val.name.toLowerCase().indexOf("außen") !== -1
  }
  return false
}

function unifyOutsideSensors(data: any[], fallbackHumidity: string): Record<string, any> {
  let temp: number | string = 999
  let humidity = ""
  if (data.length > 0) {
    data.forEach((item) => {
      temp = Math.min(Number.parseFloat(temp.toString()), Number.parseFloat(item.temperature))
      if (item.humidity.trim() !== "" && Number.parseFloat(item.humidity.trim()) > 0) {
        humidity = item.humidity;
      }
    })
  }
  if (humidity === "") {
    humidity = fallbackHumidity;
  }
  return {
    name: "Außen",
    temperature: temp,
    humidity: humidity,
  }
}

function processOwmData(data: any): OwmData {
  return {
    temperature: data.main.temp,
    temp_max: Math.round(data.main.temp_max * 10) / 10 + " °C",
    temp_min: Math.round(data.main.temp_min * 10) / 10 + " °C",
    humidity: data.main.humidity + " %",
    symbol: getIcon(data.weather[0].id),
    description: data.weather[0].description,
  }
}

function getIcon(iconNumber: number): string {
  const icon = Number.parseInt(iconNumber.toString())
  if (icon >= 200 && icon < 300) {
    return "gewitter"
  }
  if (icon >= 300 && icon < 600) {
    return "regen"
  }
  if (icon >= 600 && icon < 700) {
    return "schnee"
  }
  if (icon >= 700 && icon < 800) {
    return "nebel"
  }
  if (icon === 800) {
    return "sonne"
  }
  if (icon === 801) {
    return "sonne_wolken"
  }
  if (icon === 802) {
    return "wolken"
  }
  if (icon >= 803) {
    return "viele_wolken"
  }
  return "sonne"
}

const getBaseUri = () => process.env.NEXT_PUBLIC_BASE_URI || "";
const getBaseUriLegacy = () => process.env.NEXT_PUBLIC_BASE_URI_LEGACY || "";

const isLegacy = true;

export const useWeatherStore = create<WeatherState>((set, get) => ({
  sensorData: [],
  owmData: {} as OwmData,
  outsideSensorData: {},
  updateTime: null,

  loadSensorData: async () => {
    const response = await fetch(isLegacy ? getBaseUriLegacy() +'weather.php': getBaseUri() + "weather/read.php");
    const fileData = await response.json();

    const insideData = isLegacy ? fileData.filedata.filter(insideSensors) : fileData.filter(insideSensors);
    const outsideData = isLegacy ? fileData.filedata.filter(outsideSensors) : fileData.filter(outsideSensors);

    // Get sensors list from useSensorsStore for sort order
    const { useSensorsStore } = await import("./useSensorsStore")
    const { sensorsList } = useSensorsStore.getState()

    const processedSensorData = insideData.map((el: any) => {
      const sensorIndex = sensorsList.findIndex((item) => item.uid === el.uid)
      if (sensorIndex !== -1) {
        el.sort_order = sensorsList[sensorIndex].sort_order
      }
      return el
    })
    processedSensorData.sort((a: any, b: any) =>
      Number.parseInt(a.sort_order) > Number.parseInt(b.sort_order) ? 1 : -1,
    )

    set({
      sensorData: processedSensorData,
      outsideSensorData: unifyOutsideSensors(outsideData, get().owmData.humidity || ""),
    })

    return fileData
  },

  loadOwmWeather: async () => {
    const response = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=Berlin&mode=json&units=metric&APPID=2fd5aa9e2ba599b15afc20c27e3abd26&lang=de",
    )
    const data = await response.json()

    set({
      owmData: processOwmData(data),
    })

    return data
  },
}))
