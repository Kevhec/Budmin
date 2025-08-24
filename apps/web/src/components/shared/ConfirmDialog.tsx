import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPortal,
  AlertDialogTitle,
} from '@budmin/ui/shadcn/alert-dialog';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean
  onOpenChange?: (value: boolean) => void
  message: string
  title: string
  onConfirm: (value: boolean) => void
  onCancel: (value: boolean) => void
}

export default function ConfirmDialog({
  open, onOpenChange, title, message, onConfirm, onCancel,
}: Props) {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogPortal>
        <AlertDialogContent className="max-w-md w-[calc(100%-2rem)]">
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
              {message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => onConfirm(false)}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => onCancel(true)}>
              {t('common.continue')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
}
