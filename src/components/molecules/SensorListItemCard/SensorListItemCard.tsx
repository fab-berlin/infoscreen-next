'use client';

import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import Button from '@/components/atoms/Button/Button';

export type SensorListItemCardProps = {
  uid: string;
  name?: string | null;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

const SensorListItemCard = ({ uid, name, onSelect, onEdit, onDelete }: SensorListItemCardProps) => {
  return (
    <div
      className="mb-2 flex items-center justify-between rounded border border-white p-2"
      onClick={onSelect}
      role="button"
    >
      <div className="flex flex-col">
        {name && <span className="text-copy">{name}</span>}
        <span className="text-xs opacity-80">{uid}</span>
      </div>

      <div className="flex gap-2">
        <Button
          variant={'secondary'}
          onClick={() => onEdit?.()}
        >
          <Pencil1Icon />
        </Button>
        <Button
          variant={'alert'}
          onClick={() => onDelete?.()}
        >
          <TrashIcon />
        </Button>
      </div>
    </div>
  );
};

export default SensorListItemCard;
