import { cn, getMonthFromDate } from '@/lib/utils';
import { formatMoney } from '@/lib/formatNumber';
import { type Months } from '@/types';
import { useTranslation } from 'react-i18next';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@budmin/ui';
import {
  Typography,
} from '@budmin/ui/internal/Typography';

interface Props {
  variant?: 'default' | 'income' | 'expense'
  title: string
  month?: Months
  value: number
  className?: string
}

export default function GeneralResumeCard({
  variant, title, value, month, className,
}: Props) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const resumeCardClasses = cn('rounded-md p-4 col-span-4 border-none', {
    'bg-secondaryGreen text-white': variant === 'income',
    'bg-secondaryYellow': variant === 'expense',
  }, className);

  const formattedMoney = formatMoney(value);

  const date = new Date();
  const currentMonth = getMonthFromDate(date, currentLanguage);

  return (
    <Card className={resumeCardClasses}>
      <CardHeader className="p-0 mb-6">
        <CardTitle className="font-openSans font-semibold text-lg">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Typography className="font-bold text-lg md:text-xl">
          {formattedMoney}
        </Typography>
        <Typography className="text-sm">
          {t('helpers.in')}
          {' '}
          <Typography variant="span" className="capitalize">
            {month || currentMonth}
          </Typography>
        </Typography>
      </CardContent>
    </Card>
  );
}
