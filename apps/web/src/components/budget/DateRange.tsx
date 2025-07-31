import { useTranslation } from 'react-i18next';
import { format } from '@formkit/tempo';
import { CalendarClock, Clock } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';
import { Separator, Typography } from '@budmin/ui';

interface Props {
  startDate: Date | string
  endDate: Date | string
  variant?: 'normal' | 'expanded'
  className?: string
}

export default function DateRange({
  startDate,
  endDate,
  variant = 'normal',
  className,
}: Props) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const OuterContainer = variant === 'normal'
    ? 'div'
    : React.Fragment;

  const outerContainerClasses = cn({
    [`flex items-center justify-between gap-4 ${className}`]: variant === 'normal',
  });

  const innerContainerClasses = cn(
    'relative text-sm grow flex flex-col md:gap-1',
    {
      [`grid grid-cols-2 text-center ${className}`]: variant === 'expanded',
    },
  );

  const dateElementClasses = cn(
    'text-xs flex gap-2 justify-between lg:justify-start lg:gap-4',
    {
      'flex flex-col gap-2 md:gap-0 z-20': variant === 'expanded',
    },
  );

  return (
    <OuterContainer className={outerContainerClasses}>
      {
        variant === 'normal' && (
          <CalendarClock className="w-4 h-4" />
        )
      }
      <div className={innerContainerClasses}>
        <div className={dateElementClasses}>
          <Typography className="text-sm">
            {t('common.starts')}
            :
          </Typography>
          <Typography className="text-sm font-semibold">
            {format(startDate, 'short', currentLanguage)}
          </Typography>
        </div>
        {
          variant === 'expanded' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Separator decorative className="absolute w-12 h-[4px] top-1/2 left-1/2 -translate-x-1/2 rounded-full -translate-y-1/2 z-10" />
              <Clock className="relative z-20 bg-white" size={20} stroke="gray" />
            </div>
          )
        }
        <div className={dateElementClasses}>
          <Typography className="text-sm">
            {t('common.ends')}
            :
          </Typography>
          <Typography className="text-sm font-semibold">
            {format(endDate, 'short', currentLanguage)}
          </Typography>
        </div>
      </div>
    </OuterContainer>
  );
}
