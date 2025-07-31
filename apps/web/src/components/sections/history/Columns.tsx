/* eslint-disable import/prefer-default-export */
/* eslint-disable react-hooks/rules-of-hooks */
import { type ColumnDef } from '@tanstack/react-table';
import { type Transaction } from '@/types';
import { formatMoney } from '@/lib/formatNumber';
import { format } from '@formkit/tempo';
import { useTranslation } from 'react-i18next';
import { ColoredBadge } from '@budmin/ui/internal/ColoredBadge';
import DataTableColumnHeader from './DataTableColumnHeader';
import ActionsMenu from './ActionsMenu';

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha" />
    ),
    cell: ({ row }) => {
      const { i18n } = useTranslation();
      const currentLanguage = i18n.language;

      const date = new Date(row.getValue('date'));
      const formatted = format(date, 'long', currentLanguage);

      return (
        <div>
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descripción" textOnly />
    ),
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valor" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = formatMoney(amount);

      return (
        <p className="text-right font-medium">
          {formatted}
        </p>
      );
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => {
      const { t } = useTranslation();
      const transaction = row.original;

      return (
        <p>
          {t(`common.${transaction.type}.singular`)}
        </p>
      );
    },
  },
  {
    accessorKey: 'category.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categoría" />
    ),
    cell: ({ row }) => {
      const { t } = useTranslation();
      const transaction = row.original;
      const { category } = transaction;

      return (
        <div className="flex justify-center">
          <ColoredBadge
            color={category?.color}
            label={t(`${category?.key}`) ?? t('category.none')}
          />
        </div>
      );
    },
  },
  {
    id: 'budgets',
    accessorFn: (row) => (row.budget ? `${row.budget.name}` : ''),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Presupuesto" />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        /* TODO: Fix pointer events none when closing
        dropdown menu with escape key after modal was closed the same way.
        If escape key is pressed to close modal, dropdown closes too and pointer events none
        remain on document body, possible fix, persist dropdown open if escape key was pressed to
        close modal, then make the user press it again to close dropdown menu
        if wants to close it */
        <ActionsMenu
          item={transaction}
          type="transaction"
        />
      );
    },
  },
];
