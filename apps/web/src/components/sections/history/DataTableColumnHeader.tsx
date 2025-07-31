import { type Column } from '@tanstack/react-table';
import {
  ArrowDown, ArrowUp, ChevronsUpDown, EyeOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@budmin/ui/shadcn/dropdown-menu';
import {
  Button,
} from '@budmin/ui/shadcn/button';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
  textOnly?: boolean
}

export default function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  textOnly,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const { t } = useTranslation();

  if (!column.getCanSort() || textOnly) {
    return <div className={cn('text-center', className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center w-full', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className=" h-8 data-[state=open]:bg-accent w-full flex justify-between gap-2"
          >
            <span className="text-center flex-1">{t(`history.datatable.columns.${column.id}`)}</span>
            {column.getIsSorted() === 'desc' && (
              <ArrowDown />
            )}
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp />
            ) : (
              <ChevronsUpDown size={16} />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => column.toggleSorting(false)}
            className="capitalize flex gap-2"
          >
            <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => column.toggleSorting(true)}
            className="capitalize flex gap-2"
          >
            <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => column.toggleVisibility(false)}
            className="capitalize flex gap-2"
          >
            <EyeOff className="h-3.5 w-3.5 text-muted-foreground/70" />
            {t('helpers.hide')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
