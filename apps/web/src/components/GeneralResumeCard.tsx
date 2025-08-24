import { cn, getMonthFromDate } from '@/lib/utils';
import { formatMoney } from '@/lib/formatNumber';
import { useTranslation } from 'react-i18next';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@budmin/ui';
import {
  Typography,
} from '@budmin/ui/internal/Typography';
import {
  Textfit,
} from 'react-textfit';

interface Props {
  variant?: 'default' | 'income' | 'expense'
  month?: number
  className?: string
  title: string
  value: number
}

export default function GeneralResumeCard({
  variant, title, value, month, className,
}: Props) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const resumeCardClasses = cn('gap-0 rounded-md p-4 col-span-4 border-none', {
    'bg-secondaryGreen text-white': variant === 'income',
    'bg-secondaryYellow': variant === 'expense',
  }, className);

  const formattedMoney = formatMoney(value, {
    locale: currentLanguage,
  });

  const date = new Date();
  const displayMonth = t(`helpers.time.months.${month}`) || getMonthFromDate(date, currentLanguage);

  return (
    <Card className={resumeCardClasses}>
      <CardHeader className="p-0">
        <CardTitle>
          <Typography className="font-openSans font-semibold text-lg">
            {title}
          </Typography>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-full flex flex-col justify-end">
        <Textfit mode="single" max={24}>
          <Typography className="font-bold whitespace-nowrap text-[length:inherit]">
            {formattedMoney}
          </Typography>
        </Textfit>
        <Typography className="text-sm">
          {t('helpers.in')}
          {' '}
          <Typography variant="span" className="capitalize">
            {displayMonth}
          </Typography>
        </Typography>
      </CardContent>
    </Card>
  );
}
