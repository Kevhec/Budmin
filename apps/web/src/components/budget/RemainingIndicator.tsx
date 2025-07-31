import { cn, percentageChange } from '@/lib/utils';

interface Props {
  totalAmount: number
  netAmount: number
  className?: string
  variant?: 'normal' | 'expanded'
}

export default function RemainingIndicator({
  totalAmount,
  netAmount,
  className,
  variant,
}: Props) {
  const remainingAmountPercentage = percentageChange(totalAmount, netAmount);

  const indicatorClasses = cn(
    'w-2.5 h-full absolute left-0 rounded-r-xl top-1/2 -translate-y-1/2',
    {
      'left-1/2 top-0 -translate-y-1/3 -translate-x-1/2 h-2 rounded-xl w-[calc(100%-2rem)] md:w-full': variant === 'expanded',
      'bg-safe': remainingAmountPercentage > 50,
      'bg-caution': remainingAmountPercentage <= 50 && remainingAmountPercentage > 25,
      'bg-danger': remainingAmountPercentage <= 25,
    },
    className,
  );

  return (
    <div className={indicatorClasses} />
  );
}
