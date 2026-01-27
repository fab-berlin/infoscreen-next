'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Dispatch, SetStateAction } from 'react';

// Dialog bekommt den Open-State und den Setter aus dem Eltern-Component
const DialogModule = ({
  isDialogOpen,
  setIsDialogOpen,
  children,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
}) => {
  return (
    <Dialog.Root
      open={isDialogOpen}
      onOpenChange={(open) => setIsDialogOpen(open)}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50 transition-opacity" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded bg-white p-6 shadow-lg">
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DialogModule;
