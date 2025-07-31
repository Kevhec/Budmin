/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect, useState, useMemo } from 'react';
import {
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { type PaginationMeta, type TablePagination } from '@/types';
import debounce from 'just-debounce-it';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@budmin/ui/shadcn/table';
import {
  Typography,
} from '@budmin/ui/internal/Typography';
import DataTablePagination from './DataTablePagination';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  meta?: PaginationMeta
  onPageChange?: (pagination: TablePagination) => void;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  meta,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<TablePagination>({
    pageIndex: 0,
    pageSize: 20,
  });
  const { t } = useTranslation();

  const debouncedPageChange = useMemo(
    () => debounce((newPagination: TablePagination) => onPageChange?.(newPagination), 300),
    [onPageChange],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: meta?.totalPages,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnVisibility,
      pagination,
    },
  });

  useEffect(() => {
    const isDataEmpty = data.length === 0;

    if (!onPageChange || isDataEmpty) return;

    const isDifferentPage = (pagination.pageIndex + 1) !== meta?.currentPage;
    const didPageSizeChanged = pagination.pageSize !== meta?.itemsPerPage;

    if (
      isDifferentPage || didPageSizeChanged
    ) {
      debouncedPageChange(pagination);
    }
  }, [pagination, onPageChange, debouncedPageChange, meta?.currentPage, meta?.itemsPerPage, data]);

  return (
    <div className="space-y-4 h-full">
      <Typography variant="h2">
        {t('history.heading')}
      </Typography>
      {/*       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            {t('history.datatable.controls.view')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter(
              (column) => column.getCanHide(),
            )
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu> */}
      <Table className="flex-1 bg-white rounded-md p-4">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  <>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {t('helpers.noData')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  );
}
