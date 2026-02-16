# Plan: Gruppierung der Sensoren nach `context` in `SensorsListGrouped`

Dieser Plan beschreibt, wie die Sensoren im Organismus `SensorsListGrouped` nach ihrem `context` gruppiert und mit Überschriften dargestellt werden.

## Ziel

- Sensoren nach `context` in logische Gruppen einteilen:
  - `10–19` → Wettersensoren
  - `20–29` → Fenstersensoren
  - andere Werte oder `undefined` → Weitere Sensoren
- Die Reihenfolge der Sensoren **nicht** verändern, da sie bereits korrekt sortiert aus der Datenbank kommen.
- In `SensorsListGrouped` statt einer flachen Liste eine gruppierte Darstellung mit Überschriften verwenden.
- Optional: `SensorListItemCard` um den `context` erweitern und diesen anzeigen.

## Schritte

### 1. Gruppentyp und Mapping definieren

In `SensorsListGrouped.tsx` oberhalb der Komponente:

- Typ für die Gruppen definieren:

  ```ts
  type SensorGroupKey = 'weather' | 'windows' | 'other';
  ```

- Mapping von Gruppenschlüssel auf Anzeigenamen anlegen:

  ```ts
  const groupLabelMap: Record<SensorGroupKey, string> = {
    weather: 'Wettersensoren',
    windows: 'Fenstersensoren',
    other: 'Weitere Sensoren',
  };
  ```

### 2. Helper-Funktion für Gruppenzuordnung

Ebenfalls in `SensorsListGrouped.tsx` eine Funktion definieren, die anhand von `context` die Gruppe bestimmt:

```ts
const getGroupKeyForContext = (context: number | undefined): SensorGroupKey => {
  if (typeof context === 'number') {
    if (context >= 10 && context <= 19) return 'weather';
    if (context >= 20 && context <= 29) return 'windows';
  }
  return 'other';
};
```

### 3. Sensoren in Gruppen einsortieren (ohne Sortierung innerhalb der Gruppen)

Innerhalb der Komponente `SensorsListGrouped`, nachdem die eigentliche `sensorsList` (oder wie der Zustand/Selector heißt) vorliegt, die Liste in Gruppen aufteilen. **Wichtig:** Es wird keine Sortierung vorgenommen – die Reihenfolge im jeweiligen Gruppen-Array entspricht exakt der Reihenfolge aus der Datenquelle.

```ts
const groupedSensors = sensorsList.reduce(
  (acc, sensor) => {
    const groupKey = getGroupKeyForContext(sensor.context);
    acc[groupKey].push(sensor);
    return acc;
  },
  {
    weather: [] as SensorListItem[],
    windows: [] as SensorListItem[],
    other: [] as SensorListItem[],
  },
);
```

### 4. Gruppierte Darstellung im JSX

Im `return`-Block von `SensorsListGrouped` die bisherige flache Liste

```tsx
{sensorsList.map((item) => (
  <SensorListItemCard
    key={item.id}
    uid={item.uid ?? ''}
    name={item.name}
    context={item.context}
    onEdit={...}
    onDelete={...}
  />
))}
```

ersetzen durch eine gruppierte Darstellung:

```tsx
{(['weather', 'windows', 'other'] as SensorGroupKey[]).map((groupKey) => {
  const sensors = groupedSensors[groupKey];
  if (sensors.length === 0) return null;

  return (
    <div
      key={groupKey}
      className="mb-4"
    >
      <h3 className="mb-2 text-lg font-semibold text-white/90">
        {groupLabelMap[groupKey]}
      </h3>

      {sensors.map((item) => (
        <SensorListItemCard
          key={item.id}
          uid={item.uid ?? ''}
          name={item.name}
          context={item.context}
          onEdit={() => {
            setSelectedSensor(item);
            setIsDialogOpen(true);
          }}
          onDelete={() => item.id && handleDeleteEntry(item)}
        />
      ))}
    </div>
  );
})}
```

### 5. Optional: `SensorListItemCard` erweitern

Falls noch nicht geschehen, in `SensorListItemCard` den `context` als zusätzliches Prop aufnehmen und anzeigen.

- Props erweitern:

  ```ts
  export type SensorListItemCardProps = {
    uid: string;
    name?: string | null;
    context?: number | undefined;
    onEdit?: () => void;
    onDelete?: () => void;
  };
  ```

- Anzeige z. B. unter dem Namen:

  ```tsx
  <div className="flex flex-col">
    <span className="font-mono text-sm">{uid}</span>
    {name && <span className="text-xs opacity-80">{name}</span>}
    {typeof context === 'number' && (
      <span className="text-xxs opacity-60">Context: {context}</span>
    )}
  </div>
  ```

- In `SensorsListGrouped` beim Rendern `context={item.context}` mitgeben (bereits im Beispiel oben enthalten).

### 6. Tests / Überprüfung

- Anwendung starten (`npm run dev` o. ä.).
- `SensorsListGrouped`-Ansicht öffnen.
- Prüfen:
  - Sensoren mit `context` 10–19 erscheinen unter „Wettersensoren“.
  - Sensoren mit `context` 20–29 erscheinen unter „Fenstersensoren“.
  - Sensoren mit anderen Werten (`undefined`, <10, >29) erscheinen unter „Weitere Sensoren“.
  - Innerhalb einer Gruppe entspricht die Reihenfolge exakt der Reihenfolge aus der Datenquelle (keine zusätzliche Sortierung im Frontend).

Damit kann die Gruppierung bei Bedarf leicht erweitert werden (z. B. neue `SensorGroupKey`-Werte und zusätzliche `context`-Bereiche), ohne die Datenbank-Sortierung zu verändern.
