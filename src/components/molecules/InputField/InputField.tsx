import type { SensorListItem } from '@/types';
import { ChangeEvent } from 'react';

interface InputFieldProps {
  value: string | number | keyof SensorListItem;
  label: string;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({ value, label, disabled, onChange }: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold tracking-wide text-gray-600 uppercase">{label}</label>
      <input
        type="text"
        value={value ?? ''}
        readOnly={disabled}
        className="rounded-lg border border-gray-600 bg-gray-50 px-4 py-2 text-gray-800"
        onChange={onChange}
      />
    </div>
  );
};

export default InputField;
