import ConfirmDialog from '@/components/shared/ConfirmDialog';
import {
  createContext, type PropsWithChildren, useCallback, useState,
} from 'react';

interface ContextState {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export type ContextType = (
  { title, message }: { title: string, message: string }
) => Promise<boolean>;

export const ConfirmContext = createContext<ContextType | null>(null);

export default function ConfirmProvider({ children }: PropsWithChildren) {
  const [confirmState, setConfirmState] = useState<ContextState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const confirm = useCallback(({
    title, message,
  }: { title: string, message: string }): Promise<boolean> => new Promise((resolve) => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        resolve(true);
        setConfirmState((prevState) => ({ ...prevState, isOpen: false }));
      },
      onCancel: () => {
        resolve(false);
        setConfirmState((prevState) => ({ ...prevState, isOpen: false }));
      },
    });
  }), []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmDialog
        open={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onCancel={confirmState.onCancel}
      />
    </ConfirmContext.Provider>
  );
}
