export interface OwmData {
  temperature: number
  temp_max: string
  temp_min: string
  humidity: string
  symbol: string
  description: string
}

export interface SensorData {
  uid: string
  name: string
  temperature: string
  humidity: string
  sort_order: number
}
