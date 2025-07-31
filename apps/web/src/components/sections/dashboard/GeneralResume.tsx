import { useEffect, useState } from 'react';
import getBalance from '@/lib/balance/getBalance';
import GeneralResumeCard from '@/components/GeneralResumeCard';
import { type MonthData } from '@/types';
import useTransactions from '@/hooks/useTransactions';
import { useTranslation } from 'react-i18next';
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '@budmin/ui';

export default function GeneralResume() {
  const [balance, setBalance] = useState<MonthData>();
  const { state: { recentTransactions } } = useTransactions();
  const { t } = useTranslation();

  useEffect(() => {
    const getData = async () => {
      const data = await getBalance();
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      if (!data) return;

      const newBalance = data?.[currentYear]?.[currentMonth];

      if (!newBalance) return;

      setBalance(newBalance);
    };

    getData();
  }, [recentTransactions]);

  return (
    <section className="mb-2 md:mb-0 md:col-span-full xl:col-span-10 md:flex-1">
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
            className="col-span-2"
          />
        </TabsContent>
        <TabsContent value="income">
          <GeneralResumeCard
            variant="income"
            title={t('dashboard.generalResume.labels.income')}
            value={balance?.totalIncome || 0}
            className="col-span-1"
          />
        </TabsContent>
        <TabsContent value="expense">
          <GeneralResumeCard
            variant="expense"
            title={t('dashboard.generalResume.labels.expense')}
            value={balance?.totalExpense || 0}
            className="col-span-1"
          />
        </TabsContent>
      </Tabs>
      <div className="hidden md:grid md:grid-cols-3 xl:grid xl:grid-cols-3 gap-4">
        <GeneralResumeCard
          variant="default"
          title={t('dashboard.generalResume.labels.totalBalance')}
          value={balance?.balance || 0}
          className="col-span-1"
        />
        <GeneralResumeCard
          variant="income"
          title={t('dashboard.generalResume.labels.income')}
          value={balance?.totalIncome || 0}
          className="col-span-1"
        />
        <GeneralResumeCard
          variant="expense"
          title={t('dashboard.generalResume.labels.expense')}
          value={balance?.totalExpense || 0}
          className="col-span-1"
        />
      </div>
    </section>
  );
}
