import React, { useEffect, useState } from 'react';
import { type Budget } from '@/types';
import useBudgets from '@/hooks/useBudgets';
import BudgetResumeCard from '@/components/budget/BudgetResumeCard';
import { CircleDollarSign } from 'lucide-react';
import { NavLink } from 'react-router';
import useTransactions from '@/hooks/useTransactions';
import { useTranslation } from 'react-i18next';
import NoDataCard from '@/components/shared/NoDataCard';
import { Separator } from '@budmin/ui';
import {
  Typography,
} from '@budmin/ui/internal/Typography';
import useAuth from '@/hooks/useAuth';

export default function RecentBudgets() {
  const [
    budgetsWithPlaceholder,
    setBudgetsWithPlaceholders,
  ] = useState<Budget[]>([]);
  const { updateRecentBudgets, state: { recentBudgets } } = useBudgets();
  const { state: { user: { createdAt } } } = useAuth();
  const { state: { recentTransactions } } = useTransactions();
  const { t } = useTranslation();

  useEffect(() => {
    const getPlaceholders = () => new Array(4 - recentBudgets.length).fill({
      name: '',
      startDate: new Date(),
      endDate: new Date(),
      totalAmount: 0,
      hidden: true,
      balance: {
        totalIncome: 0,
        totalExpense: 0,
      },
    });

    const newPlaceholders = getPlaceholders();

    const newBudgetsWithPlaceholders: Budget[] = [
      ...recentBudgets,
      ...newPlaceholders,
    ];
    setBudgetsWithPlaceholders(newBudgetsWithPlaceholders);
  }, [recentBudgets]);

  useEffect(() => {
    updateRecentBudgets(new Date(createdAt));
  }, [recentTransactions, createdAt, updateRecentBudgets]);

  return (
    <section className="relative rounded-md mb-4 md:col-span-10 md:mb-0 md:flex md:flex-col bg-white">
      <div className="flex justify-between items-center px-4 py-4 mb-2">
        <div className="flex gap-2 md:gap-4 items-center">
          <CircleDollarSign />
          <div>
            <Typography variant="h2" className="text-lg font-medium font-inter">
              {t('dashboard.recentBudgets.heading')}
            </Typography>
          </div>
        </div>
        <NavLink to="#" className="text-sm text-blueishGray">
          {t('helpers.seeMore')}
        </NavLink>
      </div>
      <div className="relative flex flex-col gap-2 md:grow pb-2">
        {budgetsWithPlaceholder.map((budget, i) => {
          const {
            hidden,
          } = budget;

          let fallbackId;

          if (!budget.id) {
            fallbackId = crypto.randomUUID();
          }

          return (
            <React.Fragment key={budget.id || fallbackId}>
              <BudgetResumeCard
                budget={budget}
                hidden={hidden}
              />
              {
                (
                  recentBudgets.length !== 0
                  && budgetsWithPlaceholder.length - 1 !== i
                ) && (
                  <Separator decorative />
                )
              }
            </React.Fragment>
          );
        })}
        {
        recentBudgets.length === 0 && (
          <NoDataCard />
        )
      }
      </div>
    </section>
  );
}
