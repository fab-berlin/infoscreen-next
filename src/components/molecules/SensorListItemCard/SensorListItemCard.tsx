'use client';

import { Pencil1Icon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';
import Button from '@/components/atoms/Button/Button';

export type SensorListItemCardProps = {
  uid: string;
  name?: string | null;
  context?: number | undefined;
  sortOrder: number | null;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  first: boolean;
  last: boolean;
};

const SensorListItemCard = ({
  uid,
  name,
  context,
  sortOrder,
  onSelect,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  first = false,
  last = false,
}: SensorListItemCardProps) => {
  return (
    <div
      className="mb-2 flex items-center justify-between rounded border border-white p-2"
      onClick={onSelect}
      role="button"
    >
      <div className="flex flex-col">
        <p className={'text-xl'}>{sortOrder}</p>
        <span className="font-mono text-sm">{uid}</span>
        {name && <span className="text-xs opacity-80">{name}</span>}
        {typeof context === 'number' && (
          <span className="text-xxs opacity-60">Context: {context}</span>
        )}
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

        {!first && (
          <Button
            variant={'secondary'}
            onClick={() => onMoveUp?.()}
          >
            <ArrowUpIcon />
          </Button>
        )}
        {!last && (
          <Button
            variant={'secondary'}
            onClick={() => onMoveDown?.()}
          >
            <ArrowDownIcon />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SensorListItemCard;
