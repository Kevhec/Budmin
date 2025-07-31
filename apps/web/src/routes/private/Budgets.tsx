import BudgetResumeCard from '@/components/budget/BudgetResumeCard';
import useBudgets from '@/hooks/useBudgets';
import type {
  Budget, BudgetAmountDataNullable, BudgetBalanceChartData, Transaction,
} from '@/types';
import { format } from '@formkit/tempo';
import React, {
  type MouseEvent, useEffect, useState,
  useCallback,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import getBudgetTransactions from '@/lib/budget/geetBudgetTransactions';
import BalanceCount from '@/components/budget/BalanceCount';
import RemainingIndicator from '@/components/budget/RemainingIndicator';
import AssociatedTransactions from '@/components/budget/AssociatedTransactions';
import DateRange from '@/components/budget/DateRange';
import { defaultBalance } from '@/lib/constants';
import BudgetChart from '@/components/charts/BudgetChart';
import {
  ScrollArea,
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
  Separator,
} from '@budmin/ui';
import {
  Typography,
} from '@budmin/ui/internal/Typography';
import { type ChartConfig } from '@budmin/ui';

export default function Budgets() {
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [selectedBudgetTransactions, setSelectedBudgetTransactions] = useState<Transaction[]>([]);
  const [openDrawer, setDrawerOpen] = useState(false);
  const [chartData, setChartData] = useState<BudgetBalanceChartData[]>([]);
  const {
    state: {
      budgets,
    },
  } = useBudgets();
  const { t } = useTranslation();

  const isTabletOrDesktop = useMediaQuery({
    query: '(min-width: 768px)',
  });

  const isBigDesktop = useMediaQuery({
    query: '(min-width: 1280px)',
  });

  const budgetAmountData = useMemo<BudgetAmountDataNullable>(() => {
    if (selectedBudget) {
      const { balance, totalAmount } = selectedBudget;

      const { totalExpense, totalIncome } = balance || defaultBalance;
      const netAmount = totalAmount + totalIncome - totalExpense;

      const amountBounds = {
        safe: {
          y1: totalAmount * 0.5,
        },
        warn: {
          y1: totalAmount * 0.5,
          y2: totalAmount * 0.25,
        },
        danger: {
          y2: totalAmount * 0.25,
        },
      };

      return { totalAmount, netAmount, amountBounds };
    }

    return null;
  }, [selectedBudget]);

  const handleBudgetSelection = (_: MouseEvent<HTMLDivElement>, budget: Budget) => {
    if (budget) {
      setSelectedBudget(budget);

      if (!isTabletOrDesktop) {
        setDrawerOpen(true);
      }
    }
  };

  const generateChartData = useCallback((transactions: Transaction[]) => {
    if (!selectedBudget) return [];

    const initialAmount = selectedBudget.totalAmount;
    let currentAmount = initialAmount;

    const newChartData: BudgetBalanceChartData[] = [
      // TODO!: CHECK HOW THE BACKEND SENDS BUDGET AMOUNT AND UPDATE INTERFACES
      { date: format(selectedBudget.startDate, 'YYYY-MM-DD'), balance: parseInt(String(initialAmount), 10) },
    ];

    if (transactions) {
      transactions.forEach((transaction) => {
        const {
          date, type, amount, description,
        } = transaction;

        if (type === 'expense') {
          currentAmount -= amount;
        } else {
          currentAmount += amount;
        }

        newChartData.push({
          description,
          amount,
          date: format(date, 'YYYY-MM-DD'),
          balance: currentAmount,
        });
      });
    }

    return newChartData;
  }, [selectedBudget]);

  const budgetChartConfig = {
    balance: {
      label: 'Balance',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  const getDetailedBudgetData = useCallback(async () => {
    try {
      if (!selectedBudget) return;

      const newTransactions = await getBudgetTransactions(selectedBudget.id);

      setSelectedBudgetTransactions(newTransactions.data || []);

      const newChartData = generateChartData(newTransactions.data || []);
      setChartData(newChartData || []);
    } catch (error: any) {
      setSelectedBudgetTransactions([]);
      setChartData([]);
    }
  }, [generateChartData, selectedBudget]);

  useEffect(() => {
    if (!selectedBudget) {
      const firstBudget = budgets[0];
      setSelectedBudget(firstBudget || null);
    }

    getDetailedBudgetData();
  }, [selectedBudget, budgets, getDetailedBudgetData]);

  return (
    <div className="md:flex md:gap-4 h-full">
      <div className="bg-white rounded-md h-full flex-1 md:overflow-y-hidden md:pb-20">
        <Typography variant="h2" className="p-4">
          Presupuestos
        </Typography>
        <ScrollArea className="h-full">
          <div className="md:px-4">
            {
              budgets.map((budget, i, arr) => (
                <React.Fragment key={budget.id}>
                  <BudgetResumeCard
                    budget={budget}
                    variant="expanded"
                    onClick={handleBudgetSelection}
                    className="md:border-solid md:border-slate-300"
                  />
                  {
                      i < arr.length - 1 && (
                        <Separator className="my-2" />
                      )
                    }
                </React.Fragment>
              ))
            }
          </div>
        </ScrollArea>
      </div>
      {
        isTabletOrDesktop && (
          selectedBudget && (
            <div className="flex-1 flex flex-col">
              <div className="bg-white p-4 pl-6 rounded-sm mb-4 xl:grid xl:grid-cols-[.75fr,1fr] xl:gap-6 relative">
                <RemainingIndicator
                  totalAmount={budgetAmountData?.totalAmount || 0}
                  netAmount={budgetAmountData?.netAmount || 0}
                  variant="expanded"
                  className="xl:top-0 xl:left-0 xl:w-2 translate-y-0 xl:translate-x-0 xl:h-full"
                />
                <div className="bg-white">
                  <Typography variant="h2" className="text-center mb-4 xl:text-start xl:mb-2">
                    {selectedBudget.name}
                  </Typography>
                  <BalanceCount
                    totalAmount={budgetAmountData?.totalAmount || 0}
                    netAmount={budgetAmountData?.netAmount || 0}
                    variant={isBigDesktop ? 'normal' : 'expanded'}
                    className="my-4 xl:h-auto xl:my-0 xl:mb-4"
                  />
                  <DateRange
                    startDate={selectedBudget.startDate}
                    endDate={selectedBudget.endDate}
                    variant={isBigDesktop ? 'normal' : 'expanded'}
                    className="mb-4"
                  />
                </div>
                <div className="w-full h-min self-center">
                  {
                    chartData.length > 0 ? (
                      <BudgetChart
                        chartConfig={budgetChartConfig}
                        chartData={chartData}
                        budgetAmountData={budgetAmountData}
                      />
                    ) : (
                      <div className="border-border">
                        <Typography className="text-center">
                          {t('helpers.noData')}
                        </Typography>
                      </div>
                    )
                  }
                </div>
              </div>
              {/* TODO: Check section heading to avoid it scrolling */}
              <ScrollArea className="h-full bg-white rounded-sm">
                <div className="p-4 bg-white grow">
                  <AssociatedTransactions transactions={selectedBudgetTransactions} />
                </div>
              </ScrollArea>
            </div>
          )
        )
      }
      {
        selectedBudget && (
          <Dialog open={openDrawer} onOpenChange={setDrawerOpen}>
            <DialogContent className="w-[calc(100%-2rem)] rounded-sm overflow-hidden pt-7 px-0">
              <RemainingIndicator
                totalAmount={budgetAmountData?.totalAmount || 0}
                netAmount={budgetAmountData?.netAmount || 0}
                variant="expanded"
                className="w-[calc(100%+1rem)] translate-y-0 top-0 h-3 rounded-none"
              />
              <DialogHeader className="relative flex items-center justify-center border-b-border">
                <DialogTitle>
                  {selectedBudget?.name}
                </DialogTitle>
                <DialogDescription className="sr-only">{t('budgets.dialogDescription')}</DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[26rem] px-6">
                <div className="pb-4">
                  <DateRange
                    startDate={selectedBudget.startDate}
                    endDate={selectedBudget.endDate}
                    variant="expanded"
                    className="mb-4"
                  />
                  <Separator />
                  <BalanceCount
                    totalAmount={budgetAmountData?.totalAmount || 0}
                    netAmount={budgetAmountData?.netAmount || 0}
                    variant="expanded"
                    className="my-4"
                  />
                  <Separator className="mb-4" />
                  <div className="mb-4">
                    <Typography
                      variant="h3"
                      className="font-semibold mb-4 text-xl"
                    >
                      {t('budgets.dialog.graphHeading')}
                    </Typography>
                    {
                      chartData.length > 0 ? (
                        <BudgetChart
                          chartConfig={budgetChartConfig}
                          chartData={chartData}
                          budgetAmountData={budgetAmountData}
                        />
                      ) : (
                        <div className="border-border">
                          <Typography className="text-center">
                            {t('helpers.noData')}
                          </Typography>
                        </div>
                      )
                    }
                  </div>
                  <Separator className="mb-4" />
                  <div>
                    <AssociatedTransactions transactions={selectedBudgetTransactions} />
                  </div>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )
      }
    </div>
  );
}
