import { columns } from '@/components/sections/history/Columns';
import DataTable from '@/components/sections/history/DataTable';
import useTransactions from '@/hooks/useTransactions';
import type { TablePagination } from '@/types';
import { ScrollArea, ScrollBar } from '@budmin/ui';

export default function Transactions() {
  const { state: { paginatedTransactions }, changePage } = useTransactions();

  const handlePageChange = (pagination: TablePagination) => {
    changePage({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      include: 'budget,category,concurrence',
    });
  };

  return (
    <ScrollArea className="w-full h-full">
      <div className="w-full">
        <DataTable
          columns={columns}
          data={paginatedTransactions.data || []}
          meta={paginatedTransactions.meta}
          onPageChange={handlePageChange}
        />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
