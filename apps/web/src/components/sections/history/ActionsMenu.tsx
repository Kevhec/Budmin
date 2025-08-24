import { type CreationType, type Transaction } from '@/types';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import CreationDialog from '@/components/creationMenu/CreationDialog';
import useAlert from '@/hooks/useAlert';
import useTransactions from '@/hooks/useTransactions';
import { MoreHorizontal } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@budmin/ui/shadcn/dropdown-menu';
import { Button } from '@budmin/ui/shadcn/button';

interface Props {
  item: Transaction
  type: CreationType,
}

export default function ActionsMenu({
  item,
  type,
}: Props) {
  const { deleteTransaction } = useTransactions();
  const {
    isAlertOpen,
    confirm,
    setIsAlertOpen,
    setConfirm,
    showAlert,
    handleConfirm,
  } = useAlert();
  const { t } = useTranslation();

  const handleDelete = useCallback(() => {
    // TODO: Consider error message
    if (!item) return;

    switch (type) {
      case 'transaction':
        deleteTransaction(item.id);
        break;
      default:
        console.error('Type not handled');
    }
  }, [deleteTransaction, item, type]);

  useEffect(() => {
    if (!confirm) return;

    handleDelete();
    setConfirm(false);
  }, [confirm, handleDelete, setConfirm]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">{t('history.datatable.actions.trigger')}</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="space-y-2">
          <DropdownMenuLabel>
            {t('history.datatable.actions.label')}
          </DropdownMenuLabel>
          <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
            <CreationDialog
              type={type}
              triggerLabel={t('helpers.edit')}
              triggerClassname="px-2 py-2 text-sm w-full hover:bg-slate-100 rounded-sm transition-colors font-medium"
              modalTitle={`${t('helpers.edit')} ${t(`common.${type}.singular`)}`}
              item={item}
              editMode
            />
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button variant="ghost" onClick={showAlert} className="w-full bg-red-950 text-white hover:!bg-red-900 hover:!text-white capitalize">
              {t('helpers.delete')}
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        onConfirm={handleConfirm}
        onCancel={handleConfirm}
        open={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        title="Eliminar transacción"
        message={`
          ${t('alerts.deletion.transaction.message.partOne')} ${item.description}, ${t('alerts.deletion.transaction.message.partTwo')}
        `}
      />
    </>
  );
}
