import { formatMoney } from '@/lib/formatNumber';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Typography } from '@budmin/ui';
import { Textfit } from 'react-textfit';

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

  const displayNumber = netAmount || totalAmount;

  const containerClasses = cn('flex flex-col h-full items-center text-left', {
    'w-full': variant === 'expanded',
  }, className);

  const netAmountClasses = cn('font-openSans w-full font-bold text-[length:inherit]');

  const totalAmountClasses = cn('block text-xs lg:text-sm', {
    inline: variant === 'expanded',
  });

  return (
    <div className={containerClasses}>
      <Textfit mode="multi" max={36} className="w-full">
        <Typography className={netAmountClasses} title={String(displayNumber)}>
          {
            formatMoney(displayNumber, {
              locale: 'es-CO',
              options: {
                notation: displayNumber > 10000000 ? 'compact' : 'standard',
              },
            })
          }
        </Typography>
      </Textfit>
      <Typography className="text-xs w-full lg:text-sm">
        {t('budgetResumeCard.valueDescription')}
        {' '}
        <Typography variant="span" className={totalAmountClasses} title={String(totalAmount)}>
          {
            formatMoney(totalAmount, {
              options: {
                notation: totalAmount > 10000000 ? 'compact' : 'standard',
              },
            })
          }
        </Typography>
      </Typography>
    </div>
  );
}
