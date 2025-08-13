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

  const displayNumber = netAmount || totalAmount;

  const containerClasses = cn('flex flex-col h-full justify-center items-center', {
    'w-full text-center': variant === 'expanded',
  }, className);

  const netAmountClasses = cn('font-openSans font-bold text-sm md:text-2xl xl:text-3xl', {
    'text-2xl': variant === 'expanded',
  });

  const totalAmountClasses = cn('block text-xs lg:text-sm', {
    inline: variant === 'expanded',
  });

  return (
    <div className={containerClasses}>
      <Typography className={netAmountClasses} title={String(displayNumber)}>
        {
          formatMoney({
            number: displayNumber,
            locale: 'es-CO',
            options: {
              notation: displayNumber > 10000000 ? 'compact' : 'standard',
            },
          })
        }
      </Typography>
      <Typography className="text-xs lg:text-sm">
        {t('budgetResumeCard.valueDescription')}
        {' '}
        <Typography variant="span" className={totalAmountClasses} title={String(totalAmount)}>
          {
            formatMoney({
              number: totalAmount,
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
