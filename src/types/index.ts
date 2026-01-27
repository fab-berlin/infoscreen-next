export interface OwmData {
  temperature: number;
  temp_max: string;
  temp_min: string;
  humidity: string;
  symbol: string;
  description: string;
}

export interface WeatherSensorData {
  uid: string;
  name: string;
  temperature: string;
  humidity: string;
  sort_order: number;
}

export interface WindowsSensorData {
  id: number;
  uid: string;
  status: number;
  timestamp: number;
}

export interface SensorListItem {
  id: number | undefined;
  uid: string;
  ip: string;
  name: string;
  comment: string;
  context: number | undefined;
  sort_order: number;
}

export interface SensorContextItem {
  id: number;
  context: number;
  description: string;
}
