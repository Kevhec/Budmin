import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@budmin/ui/shadcn/select';
import { Typography } from '@budmin/ui/internal/Typography';
import { Label } from '@budmin/ui/shadcn/label';
import { useTranslation } from 'react-i18next';
import { useDashboard } from '@/context/DashboardProvider';
import useAuth from '@/hooks/useAuth';
import { generateYearsList } from '@/lib/utils';

export default function DateSelector() {
  const { state: { user } } = useAuth();
  const { t } = useTranslation();
  const {
    month, year, changeMonth, changeYear,
  } = useDashboard();
  const userCreationDate = new Date(user.createdAt);
  const yearsSinceCreation = generateYearsList(userCreationDate.getFullYear());

  const handleMonthChange = (newMonth: string) => {
    const intMonth = Number.parseInt(newMonth, 10);
    // Update dashboard context
    changeMonth(intMonth);
  };

  const handleYearChange = (newYear: string) => {
    const intYear = Number.parseInt(newYear, 10);
    // Update dashboard context
    changeYear(intYear);
  };

  return (
    <div className="row-start-1 col-span-1 flex items-center gap-2 mb-2 md:mb-0">
      <Label htmlFor="month-select">
        <Typography>{t('dashboard.monthSelect.label')}</Typography>
      </Label>
      <Select value={month.toString()} onValueChange={handleMonthChange}>
        <SelectTrigger id="month-select" className="bg-white capitalize">
          <SelectValue placeholder={t('helpers.time.month.singular')} />
        </SelectTrigger>
        <SelectContent>
          {
            Array
              .from({ length: new Date().getMonth() + 1 }, (_, i) => (
                <SelectItem value={i.toString()} key={`month_select-${i}`} className="capitalize">
                  {t(`helpers.time.months.${i}`)}
                </SelectItem>
              ))
          }
        </SelectContent>
      </Select>
      <Label htmlFor="year-select">
        <Typography>{t('helpers.of')}</Typography>
      </Label>
      <Select defaultValue={year.toString()} onValueChange={handleYearChange}>
        <SelectTrigger id="year-select" className="w-fit px-2 py-1 h-fit bg-white">
          <SelectValue placeholder={year} />
        </SelectTrigger>
        <SelectContent className="max-h-56">
          {yearsSinceCreation.map((yearValue) => (
            <SelectItem key={`filter-years-${yearValue}`} value={yearValue.toString()}>{yearValue}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
