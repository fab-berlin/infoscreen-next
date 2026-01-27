'use client';

import { Dialog } from '@radix-ui/themes';
import type { Dispatch, SetStateAction } from 'react';

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
      onOpenChange={setIsDialogOpen}
    >
      <Dialog.Content
        size="3"
        maxWidth="640px"
      >
        {children}
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DialogModule;
