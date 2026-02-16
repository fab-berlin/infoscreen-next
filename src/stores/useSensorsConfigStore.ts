import { create } from 'zustand';
import { SensorContextItem, SensorListItem } from '@/types';

interface SensorsConfigState {
  sensorsList: SensorListItem[];
  contextsList: SensorContextItem[];
  loadSensorsList: () => Promise<any>;
  loadContextsList: () => Promise<any>;
  saveSensorConfig: (sensor: SensorListItem) => Promise<any>;
  deleteSensorEntry: (sensorId: number) => Promise<any>;
  moveSensorEntryUp: (sensorId: number) => Promise<void>;
  moveSensorEntryDown: (sensorId: number) => Promise<void>;
}

const getBaseUri = () => process.env.NEXT_PUBLIC_BASE_URI || '';

// TODO: add sort order methods (move up/down) and update sort order on the server accordingly

type SortOrderUpdatePayload = { id: number; sort_order: number };

async function postSortOrderUpdate(payload: SortOrderUpdatePayload): Promise<void> {
  const res = await fetch(getBaseUri() + 'sensors/update.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  // `update.php` might return JSON or plain text. We only treat non-2xx as error.
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to update sort_order for sensor ${payload.id}. ${text}`);
  }
}

export const useSensorsConfigStore = create<SensorsConfigState>((set, get) => ({
  sensorsList: [],
  contextsList: [],

  loadSensorsList: async () => {
    const response = await fetch(getBaseUri() + 'sensors/read.php');
    const data = await response.json();

    // Sensoren kommen bereits sortiert aus der DB
    set({ sensorsList: data });
  },
  saveSensorConfig: async (sensor: SensorListItem) => {
    const endpoint = sensor.id ? 'update.php' : 'create.php';
    await fetch(getBaseUri() + 'sensors/' + endpoint, {
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
    await fetch(getBaseUri() + 'sensors/delete.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: sensorId }),
    });
  },
  moveSensorEntryUp: async (sensorId: number) => {
    const list = get().sensorsList;
    const index = list.findIndex((s) => s.id === sensorId);

    const current = list[index];
    const previous = list[index - 1];

    const currentSort = current.sort_order ?? index;
    const previousSort = previous.sort_order ?? index - 1;

    const updatedCurrent: SensorListItem = { ...current, sort_order: previousSort };
    const updatedPrevious: SensorListItem = { ...previous, sort_order: currentSort };

    // Optimistic UI update
    const newList = [...list];
    newList[index - 1] = updatedCurrent;
    newList[index] = updatedPrevious;
    set({ sensorsList: newList });

    try {
      // Persist: 2x update.php (minimal payload)
      await Promise.all([
        postSortOrderUpdate({ ...current, id: current.id!, sort_order: updatedCurrent.sort_order }),
        postSortOrderUpdate({
          ...previous,
          id: previous.id!,
          sort_order: updatedPrevious.sort_order,
        }),
      ]);

      // Sync with server order (DB is source of truth)
      await get().loadSensorsList();
    } catch {
      // Rollback local state and re-sync
      set({ sensorsList: list });
      await get().loadSensorsList();
      throw new Error('Sortierreihenfolge konnte nicht gespeichert werden.');
    }
  },
  moveSensorEntryDown: async (sensorId: number) => {
    const list = get().sensorsList;
    const index = list.findIndex((s) => s.id === sensorId);

    const current = list[index];
    const next = list[index + 1];

    const currentSort = current.sort_order ?? index;
    const nextSort = next.sort_order ?? index + 1;

    const updatedCurrent: SensorListItem = { ...current, sort_order: nextSort };
    const updatedPrevious: SensorListItem = { ...next, sort_order: currentSort };

    // Optimistic UI update
    const newList = [...list];
    newList[index + 1] = updatedCurrent;
    newList[index] = updatedPrevious;
    set({ sensorsList: newList });

    try {
      // Persist: 2x update.php (minimal payload)
      await Promise.all([
        postSortOrderUpdate({ ...current, id: current.id!, sort_order: updatedCurrent.sort_order }),
        postSortOrderUpdate({
          ...next,
          id: next.id!,
          sort_order: updatedPrevious.sort_order,
        }),
      ]);

      // Sync with server order (DB is source of truth)
      await get().loadSensorsList();
    } catch {
      // Rollback local state and re-sync
      set({ sensorsList: list });
      await get().loadSensorsList();
      throw new Error('Sortierreihenfolge konnte nicht gespeichert werden.');
    }
  },
}));
