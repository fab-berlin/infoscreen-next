'use client';

import { useSensorsConfigStore } from '@/stores/useSensorsConfigStore';
import { ChangeEvent, useEffect, useState } from 'react';
import DialogModule from '@/components/organisms/DialogModule/DialogModule';
import * as Dialog from '@radix-ui/react-dialog';
import type { SensorListItem } from '@/types';
import InputField from '@/components/molecules/InputField/InputField';
import Button from '@/components/atoms/Button/Button';
import SensorListItemCard from '@/components/molecules/SensorListItemCard/SensorListItemCard';
import SelectField from '@/components/molecules/SelectField/SelectField';

interface InputConfigItem {
  key: keyof SensorListItem;
  label: string;
  component: 'InputField' | 'Select';
  content?: unknown[];
}

const ConfigSensorsList = () => {
  const {
    loadSensorsList,
    saveSensorConfig,
    loadContextsList,
    deleteSensorEntry,
    sensorsList,
    contextsList,
  } = useSensorsConfigStore();

  const inputConfiguration: InputConfigItem[] = [
    { key: 'id', label: 'ID', component: 'InputField' },
    { key: 'uid', label: 'UID', component: 'InputField' },
    { key: 'ip', label: 'IP Adresse', component: 'InputField' },
    { key: 'name', label: 'Name', component: 'InputField' },
    { key: 'comment', label: 'Kommentar', component: 'InputField' },
    { key: 'sort_order', label: 'Sortierreihenfolge', component: 'InputField' },
    { key: 'context', label: 'Kontext', component: 'Select', content: contextsList },
  ];

  const loadData = async () => {
    await loadSensorsList();
    await loadContextsList();
  };

  useEffect(() => {
    loadData();
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sensorToDelete, setSensorToDelete] = useState<SensorListItem | null>(null);
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

  const handleDeleteEntry = (item: SensorListItem) => {
    setSensorToDelete(item);
    setIsDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    if (sensorToDelete && sensorToDelete.id) {
      await deleteSensorEntry(sensorToDelete.id);
      await loadSensorsList();
    }
    setSensorToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  return (
    <section className="mb-4 border border-white p-4 text-white filter backdrop-blur-lg">
      <h2 className="mb-4 text-xl">Liste aller Sensoren</h2>
      {sensorsList.map((item) => (
        <SensorListItemCard
          key={item.id}
          uid={item.uid ?? ''}
          name={item.name}
          onEdit={() => {
            setSelectedSensor(item);
            setIsDialogOpen(true);
          }}
          onDelete={() => item.id && handleDeleteEntry(item)}
        />
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
              {inputConfiguration.map((config) => {
                if (config.component === 'InputField') {
                  return (
                    <InputField
                      key={config.key}
                      label={config.label}
                      value={selectedSensor[config.key] ?? ''}
                      disabled={config.key === 'id'}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        const currentValue = selectedSensor[config.key];
                        const newValue =
                          typeof currentValue === 'number'
                            ? Number(event.target.value)
                            : event.target.value;
                        setSelectedSensor({
                          ...selectedSensor,
                          [config.key]: newValue,
                        });
                      }}
                    />
                  );
                }

                if (config.component === 'Select') {
                  return (
                    <SelectField
                      key={config.key}
                      label={config.label}
                      data={contextsList}
                      value={selectedSensor.context ?? null}
                      onChange={(newContext) => {
                        setSelectedSensor({
                          ...selectedSensor,
                          context: newContext ?? undefined,
                        });
                      }}
                    />
                  );
                }

                return null;
              })}

              <div className="mt-6">
                <div className="flex flex-row justify-between">
                  <Button
                    variant={'primary'}
                    onClick={handleSave}
                  >
                    Speichern
                  </Button>
                  <Button
                    variant={'secondary-inverted'}
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
      <DialogModule
        isDialogOpen={isDeleteDialogOpen}
        setIsDialogOpen={setIsDeleteDialogOpen}
      >
        <Dialog.Title className="mb-4 text-lg font-semibold">Sensor wirklich löschen?</Dialog.Title>
        <div className="flex flex-row justify-between">
          <Button
            variant={'alert'}
            onClick={confirmDelete}
          >
            Löschen
          </Button>
          <Button
            variant={'secondary-inverted'}
            onClick={() => setIsDeleteDialogOpen(false)}
          >
            Abbrechen
          </Button>
        </div>
      </DialogModule>
    </section>
  );
};

export default ConfigSensorsList;
