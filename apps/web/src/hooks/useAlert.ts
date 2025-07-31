import { useCallback, useState } from 'react';

function useAlert() {
  const [confirm, setConfirm] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertResolve, setAlertResolve] = useState<(value: boolean) => void>(() => {});

  const handleConfirm = (value: boolean) => {
    setConfirm(value);
    setIsAlertOpen(false);
    alertResolve(value);
  };

  const showAlert = useCallback((): Promise<boolean> => new Promise((resolve) => {
    setConfirm(false);
    setIsAlertOpen(true);
    setAlertResolve(() => resolve);
  }), []);

  return {
    isAlertOpen,
    confirm,
    setIsAlertOpen,
    setConfirm,
    showAlert,
    handleConfirm,
  };
}

export default useAlert;
