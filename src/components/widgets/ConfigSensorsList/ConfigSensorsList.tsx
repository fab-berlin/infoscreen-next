'use client';

import { useSensorsConfigStore } from '@/stores/useSensorsConfigStore';
import { ChangeEvent, useEffect, useState } from 'react';
import DialogModule from '@/components/organisms/DialogModule/DialogModule';
import * as Dialog from '@radix-ui/react-dialog';
import type { SensorListItem } from '@/types';
import InputField from '@/components/molecules/InputField/InputField';
import Button from '@/components/atoms/Button/Button';

const ConfigSensorsList = () => {
  const { loadSensorsList, saveSensorConfig, loadContextsList, sensorsList, contextsList } =
    useSensorsConfigStore();

  const loadData = async () => {
    await loadSensorsList();
    await loadContextsList();
  };

  useEffect(() => {
    loadData();
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<SensorListItem | null>(null);

  const handleSave = () => {
    if (selectedSensor) {
      saveSensorConfig(selectedSensor);
      setIsDialogOpen(false);
    }
  };
  const addNewSensor = () => {
    const newSensorConfig: SensorListItem = {
      id: undefined,
      uid: '',
      ip: '',
      name: '',
      comment: '',
      sort_order: 0,
      context: undefined,
    };
    setSelectedSensor(newSensorConfig);
    setIsDialogOpen(true);
  };

  return (
    <section className="mb-4 border border-white p-4 text-white filter backdrop-blur-lg">
      <h2 className="mb-4 text-xl">ConfigSensorsList Component</h2>
      {sensorsList.map((item) => (
        <div
          key={item.id}
          className="mb-2 cursor-pointer rounded border border-white p-2"
          onClick={() => {
            setSelectedSensor(item);
            setIsDialogOpen(true);
          }}
          role="button"
        >
          {item.uid}
        </div>
      ))}
      <Button
        variant={'primary'}
        onClick={addNewSensor}
      >
        Neuen Sensor hinzufügen
      </Button>

      <DialogModule
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      >
        {selectedSensor && (
          <>
            <Dialog.Title className="mb-4 text-lg font-semibold">Sensor bearbeiten</Dialog.Title>

            <div className="space-y-3">
              {/* Mapping through the keys of the selectedSensor object to create InputFields */}
              {Object.keys(selectedSensor).map((key) => (
                <InputField
                  key={key}
                  label={key}
                  value={selectedSensor[key as keyof SensorListItem] ?? ''}
                  disabled={key === 'id'}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const newValue =
                      typeof selectedSensor[key as keyof SensorListItem] === 'number'
                        ? Number(event.target.value)
                        : event.target.value;
                    setSelectedSensor({
                      ...selectedSensor,
                      [key]: newValue,
                    });
                  }}
                />
              ))}

              <div className="mt-6">
                <div className="flex flex-row justify-between">
                  <Button
                    variant={'primary'}
                    onClick={handleSave}
                  >
                    Speichern
                  </Button>
                  <Button
                    variant={'secondary'}
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Abbrechen
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogModule>
    </section>
  );
};

export default ConfigSensorsList;
