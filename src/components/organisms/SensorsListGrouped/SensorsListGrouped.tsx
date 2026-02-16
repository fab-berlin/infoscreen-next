import { useSensorsConfigStore } from '@/stores/useSensorsConfigStore';
import SensorListItemCard from '@/components/molecules/SensorListItemCard/SensorListItemCard';
import type { SensorListItem } from '@/types';

// Gruppenschlüssel-Typ
type SensorGroupKey = 'weather' | 'windows' | 'other';

// Mapping von Gruppenschlüssel zu Überschrift
const groupLabelMap: Record<SensorGroupKey, string> = {
  weather: 'Wettersensoren',
  windows: 'Fenstersensoren',
  other: 'Weitere Sensoren',
};

// Helper zur Zuordnung eines context-Wertes zu einer Gruppe
const getGroupKeyForContext = (context: number | undefined): SensorGroupKey => {
  if (typeof context === 'number') {
    if (context >= 10 && context <= 19) return 'weather';
    if (context >= 20 && context <= 29) return 'windows';
  }
  return 'other';
};

type SensorsListGroupedProps = {
  onEdit: (sensor: SensorListItem) => void;
  onDelete: (sensor: SensorListItem) => void;
  onMoveUp: (sensor: SensorListItem) => void;
  onMoveDown: (sensor: SensorListItem) => void;
};

const SensorsListGrouped = ({
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: SensorsListGroupedProps) => {
  const { sensorsList } = useSensorsConfigStore();

  // Falls noch nichts geladen ist, eine einfache leere Ansicht anzeigen
  if (!sensorsList || sensorsList.length === 0) {
    return <div className="text-sm text-white">Keine Sensoren vorhanden.</div>;
  }

  // Sensoren nach Gruppen einsortieren, ohne die Reihenfolge zu verändern
  const groupedSensors = sensorsList.reduce(
    (acc, sensor: SensorListItem) => {
      const groupKey = getGroupKeyForContext(sensor.context);
      acc[groupKey].push(sensor);
      return acc;
    },
    {
      weather: [] as SensorListItem[],
      windows: [] as SensorListItem[],
      other: [] as SensorListItem[],
    }
  );

  return (
    <div className="space-y-4">
      {(['weather', 'windows', 'other'] as SensorGroupKey[]).map((groupKey) => {
        const sensors = groupedSensors[groupKey];
        if (sensors.length === 0) return null;

        return (
          <div
            key={groupKey}
            className="mb-4"
          >
            <h3 className="mb-2 text-lg font-semibold text-white/90">{groupLabelMap[groupKey]}</h3>

            {sensors.map((item, index) => (
              <SensorListItemCard
                key={item.id ?? item.uid}
                uid={item.uid}
                name={item.name}
                context={item.context}
                sortOrder={item.sort_order}
                onEdit={() => onEdit(item)}
                onDelete={() => onDelete(item)}
                onMoveUp={() => onMoveUp(item)}
                onMoveDown={() => onMoveDown(item)}
                first={index === 0}
                last={index === sensors.length - 1}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default SensorsListGrouped;
