import { cn } from '@/lib/utils';
import type { Budget } from '@/types';
import { useTranslation } from 'react-i18next';
import { type MouseEvent, type MouseEventHandler } from 'react';
import { defaultBalance } from '@/lib/constants';
import {
  Typography,
  Card, CardContent, CardTitle,
  Separator,
} from '@budmin/ui';
import BalanceCount from './BalanceCount';
import RemainingIndicator from './RemainingIndicator';
import DateRange from './DateRange';

interface Props {
  budget: Budget
  className?: string
  variant?: 'normal' | 'expanded'
  hidden?: boolean
  onClick?: (event: MouseEvent<HTMLDivElement>, budget: Budget) => void
}

export default function BudgetResumeCard({
  budget,
  variant = 'normal',
  hidden,
  className,
  onClick,
}: Props) {
  const { t } = useTranslation();

  const {
    name, startDate, endDate, totalAmount, balance,
  } = budget;

  const { totalExpense, totalIncome } = balance || defaultBalance;
  const netAmount = totalAmount + totalIncome - totalExpense;

  const containerClasses = cn({
    invisible: hidden,
    'overflow-hidden': variant === 'expanded',
    'hover:bg-accent cursor-pointer active:scale-[98%]': !!onClick,
  }, 'border-none transition-colors transition-transform shadow-none px-4 py-2 md:pt-4 relative md:pl-6 md:gap-6 md:grow md:items-center md:flex-row', className);

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    if (onClick) {
      onClick(e, budget);
    }
  };

  return (
    <Card tabIndex={hidden ? 0 : 1} className={containerClasses} onClick={handleClick}>
      <RemainingIndicator totalAmount={totalAmount} netAmount={netAmount} variant={variant} />
      <CardContent className={cn('p-0 md:justify-center w-full', { 'space-y-4': variant === 'expanded' })}>
        <div className="relative p-0 grid grid-cols-2 gap-4 h-full">
          <div className="font-inter p-0">
            <CardTitle className="capitalize font-medium text-lg md:text-2xl truncate md:mb-2" title={name}>{name}</CardTitle>
            <DateRange
              startDate={startDate}
              endDate={endDate}
            />
          </div>
          <Separator orientation="vertical" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-5/6 md:hidden" />
          <BalanceCount totalAmount={totalAmount} netAmount={netAmount} />
        </div>
        {
          variant === 'expanded' && (
            <div className="flex justify-between gap-1 py-2 md:p-0">
              <Typography className="text-sm">
                {`${budget.transactionsCount} ${t('budgetResumeCard.transactionsAmount')}`}
              </Typography>
              <Typography className="text-sm underline cursor-pointer hover:opacity-60 transition-opacity">
                {t('helpers.seeMore')}
              </Typography>
            </div>
          )
        }
      </CardContent>
    </Card>
  );
}
