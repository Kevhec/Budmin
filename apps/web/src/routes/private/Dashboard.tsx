import RecentTransactions from '@/components/sections/dashboard/RecentTransactions';
import GeneralResume from '@/components/sections/dashboard/GeneralResume';
import CategoryBalanceGraph from '@/components/sections/dashboard/CategoryBalanceGraph';
import RecentBudgets from '@/components/sections/dashboard/RecentBudgets';
import MonthlyBalanceGraph from '@/components/sections/dashboard/MonthlyBalanceGraph';

export default function Dashboard() {
  return (
    <div className="md:grid md:grid-cols-20 md:gap-4">
      <div className="mb-4 md:col-span-full md:grid md:grid-cols-subgrid md:gap-y-4 md:grid-rows-[fit,1fr] md:mb-0">
        <GeneralResume />
        <RecentTransactions />
        <CategoryBalanceGraph />
      </div>
      <div className="md:col-span-full md:grid md:grid-cols-subgrid">
        <RecentBudgets />
        <MonthlyBalanceGraph />
      </div>
    </div>
  );
}
