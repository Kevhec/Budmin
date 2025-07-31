import { formatMoney } from '@/lib/formatNumber';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Typography } from '@budmin/ui';

interface Props {
  totalAmount: number
  netAmount: number
  className?: string
  variant?: 'normal' | 'expanded'
}

export default function BalanceCount({
  totalAmount,
  netAmount,
  className,
  variant = 'normal',
}: Props) {
  const { t } = useTranslation();

  const containerClasses = cn('grid h-full grid-rows-2 p-0 items-center', {
    'w-full text-center': variant === 'expanded',
  }, className);

  const netAmountClasses = cn('font-openSans font-bold text-sm lg:text-xl', {
    'text-2xl': variant === 'expanded',
  });

  const totalAmountClasses = cn('block text-xs lg:text-sm', {
    inline: variant === 'expanded',
  });

  return (
    <div className={containerClasses}>
      <Typography className={netAmountClasses}>
        {
          formatMoney(
            netAmount || totalAmount,
          )
        }
      </Typography>
      <Typography className="text-xs lg:text-sm">
        {t('budgetResumeCard.valueDescription')}
        {' '}
        <Typography variant="span" className={totalAmountClasses}>{formatMoney(totalAmount)}</Typography>
      </Typography>
    </div>
  );
}
