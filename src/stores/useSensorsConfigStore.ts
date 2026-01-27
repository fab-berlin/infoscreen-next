import { create } from 'zustand';
import { SensorContextItem, SensorListItem } from '@/types';

interface SensorsConfigState {
  sensorsList: SensorListItem[];
  contextsList: SensorContextItem[];
  loadSensorsList: () => Promise<any>;
  loadContextsList: () => Promise<any>;
  saveSensorConfig: (sensor: SensorListItem) => Promise<any>;
  deleteSensorEntry: (sensorId: number) => Promise<any>;
}

const getBaseUri = () => process.env.NEXT_PUBLIC_BASE_URI || '';

export const useSensorsConfigStore = create<SensorsConfigState>((set, get) => ({
  sensorsList: [],
  contextsList: [],

  loadSensorsList: async () => {
    const response = await fetch(getBaseUri() + 'sensors/read.php');
    const data = await response.json();

    set({ sensorsList: data });
  },
  saveSensorConfig: async (sensor: SensorListItem) => {
    const endpoint = sensor.id ? 'update.php' : 'create.php';
    const response = await fetch(getBaseUri() + 'sensors/' + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sensor),
    });
    if (sensor.id) {
      // Update: just update local state
      set((state) => ({
        sensorsList: state.sensorsList.map((s) => (s.id === sensor.id ? sensor : s)),
      }));
    } else {
      // Create: reload the list to get the new entry with its server-generated ID
      await get().loadSensorsList();
    }
  },
  loadContextsList: async () => {
    const response = await fetch(getBaseUri() + 'sensor_context/read.php');
    const data = await response.json();

    set({ contextsList: data });
  },
  deleteSensorEntry: async (sensorId: number) => {
    const response = await fetch(getBaseUri() + 'sensors/delete.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: sensorId }),
    });
  },
}));
