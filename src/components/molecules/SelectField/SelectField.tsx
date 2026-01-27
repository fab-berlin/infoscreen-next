import { Select, Flex } from '@radix-ui/themes';
import type { SensorContextItem } from '@/types';

type SelectFieldProps = {
  label: string;
  data?: SensorContextItem[];
  value?: number | null;
  onChange?: (value: number | null) => void;
};

const SelectField = ({ label, data = [], value, onChange }: SelectFieldProps) => {
  const stringValue = typeof value === 'number' && !Number.isNaN(value) ? String(value) : undefined;

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold tracking-wide text-gray-600 uppercase">{label}</label>
      <Select.Root
        size="3"
        value={stringValue}
        onValueChange={(val) => {
          if (!val) {
            onChange?.(null);
            return;
          }
          const num = Number(val);
          onChange?.(Number.isNaN(num) ? null : num);
        }}
      >
        <Select.Trigger
          placeholder={label}
          variant={'surface'}
        />
        <Select.Content>
          {data.map((item) => (
            <Select.Item
              key={item.id}
              value={String(item.context)}
            >
              {item.description}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  );
};

export default SelectField;
