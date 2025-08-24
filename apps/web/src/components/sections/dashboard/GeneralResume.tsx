import {
  useEffect, useMemo, useState,
} from 'react';
import getBalance from '@/lib/balance/getBalance';
import GeneralResumeCard from '@/components/GeneralResumeCard';
import { type MonthData } from '@/types';
import useTransactions from '@/hooks/useTransactions';
import { useTranslation } from 'react-i18next';
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '@budmin/ui';
import { useDashboard } from '@/context/DashboardProvider';
import { formatYearMonthDate } from '@/lib/utils';
import debounce from 'just-debounce-it';

export default function GeneralResume() {
  const [balance, setBalance] = useState<MonthData>();
  const { state: { recentTransactions } } = useTransactions();
  const { t } = useTranslation();
  const { month, year } = useDashboard();

  const debouncedGetBalance = useMemo(
    () => debounce(async () => {
      // TODO: Update this when function gets named params
      const data = await getBalance(formatYearMonthDate({ year, month }), undefined, true);

      const newBalance = data?.[year]?.[month + 1];

      if (!newBalance) {
        setBalance({
          balance: 0,
          totalExpense: 0,
          totalIncome: 0,
        });
      } else {
        setBalance(newBalance);
      }
    }, 100),
    [year, month],
  );

  useEffect(() => {
    debouncedGetBalance();

    return () => {
      debouncedGetBalance.cancel();
    };
  }, [recentTransactions, debouncedGetBalance]);

  return (
    <section className="mb-2 md:mb-0 md:col-span-full md:row-start-2 xl:col-span-10 md:flex-1">
      <Tabs defaultValue="balance" className="w-full md:hidden">
        <TabsList className="w-full flex gap-1">
          <TabsTrigger className="flex-1" value="balance">
            {t('dashboard.generalResume.labels.totalBalance')}
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="income">
            {t('dashboard.generalResume.labels.income')}
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="expense">
            {t('dashboard.generalResume.labels.expense')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="balance">
          <GeneralResumeCard
            variant="default"
            title={t('dashboard.generalResume.labels.totalBalance')}
            value={balance?.balance || 0}
            className=""
            month={month}
          />
        </TabsContent>
        <TabsContent value="income">
          <GeneralResumeCard
            variant="income"
            title={t('dashboard.generalResume.labels.income')}
            value={balance?.totalIncome || 0}
            className=""
            month={month}
          />
        </TabsContent>
        <TabsContent value="expense">
          <GeneralResumeCard
            variant="expense"
            title={t('dashboard.generalResume.labels.expense')}
            value={balance?.totalExpense || 0}
            className=""
            month={month}
          />
        </TabsContent>
      </Tabs>
      <div className="hidden md:grid md:grid-cols-3 xl:grid xl:grid-cols-3 gap-2">
        <GeneralResumeCard
          variant="default"
          title={t('dashboard.generalResume.labels.totalBalance')}
          value={balance?.balance || 0}
          className="col-span-1"
          month={month}
        />
        <GeneralResumeCard
          variant="income"
          title={t('dashboard.generalResume.labels.income')}
          value={balance?.totalIncome || 0}
          className="col-span-1"
          month={month}
        />
        <GeneralResumeCard
          variant="expense"
          title={t('dashboard.generalResume.labels.expense')}
          value={balance?.totalExpense || 0}
          className="col-span-1"
          month={month}
        />
      </div>
    </section>
  );
}
