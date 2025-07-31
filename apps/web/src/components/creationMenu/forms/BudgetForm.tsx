import { cn, getModeValue, nthDay } from '@/lib/utils';
import { budgetSchema } from '@/schemas/creation';
import { format } from '@formkit/tempo';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { concurrenceInit } from '@/lib/constants';
import ConcurrenceEndDate from '@/components/ConcurrenceEndDate';
import { type CreateBudgetParams, type Budget } from '@/types';
import { useTranslation } from 'react-i18next';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@budmin/ui/shadcn/form';
import {
  Input,
} from '@budmin/ui/shadcn/input';
import {
  Calendar,
} from '@budmin/ui/shadcn/calendar';
import {
  Button,
} from '@budmin/ui/shadcn/button';
import {
  Typography,
} from '@budmin/ui/internal/Typography';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@budmin/ui/shadcn/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@budmin/ui/shadcn/popover';
import ConcurrenceDialog from '../ConcurrenceDialog';

export type BudgetFormProps = {
  onSubmit: (value: CreateBudgetParams) => void
  formId: string
  className?: string
  dirtyChecker?: React.Dispatch<React.SetStateAction<boolean>>
  editMode?: boolean
  item?: Budget
};

// TODO: Verify if context to share currently editing item is a good idea

export default function BudgetForm({
  formId, className, editMode, item, onSubmit, dirtyChecker,
}: BudgetFormProps) {
  const [isConcurrenceSelectOpen, setConcurrenceSelectOpen] = useState(false);
  const [isConcurrenceOptionHovered, setIsConcurrenceOptionHovered] = useState(false);
  const { t, i18n } = useTranslation();

  const currentLanguage = i18n.language;
  const languageCode = currentLanguage.split('-')[0];
  const getValue = getModeValue(editMode);

  const { defaultStartDate, defaultEndDate } = useMemo(() => {
    const memoStartDate = new Date();
    const memoEndDate = new Date(memoStartDate);

    memoEndDate.setMonth(memoEndDate.getMonth() + 1);

    return { defaultStartDate: memoStartDate, defaultEndDate: memoEndDate };
  }, []);

  const form = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      name: getValue(item?.name, ''),
      totalAmount: getValue(item?.totalAmount, 0),
      startDate: getValue(new Date(item?.startDate || ''), defaultStartDate),
      endDate: getValue(new Date(item?.endDate || ''), defaultEndDate),
      concurrenceDefaults: getValue(item?.concurrence?.defaults, concurrenceInit.defaults),
      concurrenceTime: getValue(new Date(item?.concurrence?.time || ''), concurrenceInit.time),
      concurrenceSteps: getValue(item?.concurrence?.steps, concurrenceInit.steps),
      concurrenceWithEndDate: getValue(item?.concurrence?.withEndDate ? 'true' : 'false', concurrenceInit.withEndDate),
      concurrenceType: getValue(item?.concurrence?.type, concurrenceInit.type),
      concurrenceWeekDay: getValue(item?.concurrence?.weekDay, concurrenceInit.weekDay),
      concurrenceMonthSelect: getValue(item?.concurrence?.monthSelect, concurrenceInit.monthSelect),
      concurrenceEndDate: getValue(new Date(item?.concurrence?.endDate || ''), concurrenceInit.endDate),
    },
  });

  const { formState: { isDirty } } = form;

  const [currentDefaultConcurrence, currentStartDate] = useWatch({
    control: form.control,
    name: ['concurrenceDefaults', 'startDate'],
  });

  const handleConcurrenceSelectOpen = useCallback((open: boolean) => {
    if (!isConcurrenceOptionHovered) {
      setConcurrenceSelectOpen(open);
    }
  }, [isConcurrenceOptionHovered]);

  const handleConcurrenceMouseOver = (evt: React.MouseEvent<HTMLDivElement>) => {
    evt.stopPropagation();
    if (evt.relatedTarget && !evt.currentTarget.contains(evt.relatedTarget as Node)) {
      const didMouseEnter = evt.type === 'mouseenter';
      setIsConcurrenceOptionHovered(didMouseEnter);
    }
  };

  useEffect(() => {
    if (dirtyChecker) {
      dirtyChecker(isDirty);
    }
  }, [isDirty, dirtyChecker]);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (currentStartDate && currentStartDate !== defaultStartDate) {
      const newEndDate = new Date(currentStartDate);
      newEndDate.setMonth(newEndDate.getMonth() + 1);

      form.setValue('endDate', newEndDate);
      form.setValue('concurrenceEndDate', newEndDate);
    } else {
      form.setValue('concurrenceDefaults', 'none');
    }
  }, [currentStartDate, form, defaultStartDate]);

  const containerClasses = cn('flex relative flex-col gap-6', className);

  return (
    <Form {...form}>
      <form className={containerClasses} id={formId} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('forms.budget.inputs.description.label')}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t('forms.budget.inputs.description.placeholder')}
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs">
                {t('forms.budget.inputs.description.description')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('forms.budget.inputs.totalAmount.label')}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={t('forms.budget.inputs.totalAmount.placeholder')}
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs">
                {t('forms.budget.inputs.totalAmount.description')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('forms.budget.inputs.startDate.label')}
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal row-start-2',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'long', currentLanguage)
                      ) : (
                        <span>{t('forms.budget.inputs.startDate.placeholder')}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    localeString={currentLanguage}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription className="text-xs">
                {t('forms.budget.inputs.startDate.description')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="concurrenceDefaults"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('forms.recurrence.inputs.defaults.label')}
              </FormLabel>
              {/* TODO: This should be a component */}
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                open={isConcurrenceSelectOpen}
                onOpenChange={handleConcurrenceSelectOpen}
                disabled={currentStartDate === undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('forms.recurrence.inputs.defaults.options.none')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none" defaultChecked>
                    {t('forms.recurrence.inputs.defaults.options.none')}
                  </SelectItem>
                  <SelectItem value="daily">
                    {t('forms.recurrence.inputs.defaults.options.daily')}
                  </SelectItem>
                  <SelectItem value="weekly">
                    {t('forms.recurrence.inputs.defaults.options.weekly')}
                    {' '}
                    {format((currentStartDate || new Date()), 'dddd', languageCode)}
                  </SelectItem>
                  <SelectItem value="monthly">
                    {t('forms.recurrence.inputs.defaults.options.monthly')}
                    {' '}
                    {nthDay(currentStartDate)}
                  </SelectItem>
                  <SelectItem value="yearly" className="peer">
                    {t('forms.recurrence.inputs.defaults.options.yearly')}
                    {' '}
                    {(currentStartDate || new Date()).getDate()}
                    {' de '}
                    {format((currentStartDate || new Date()), 'MMMM', currentLanguage)}
                  </SelectItem>
                  <ConcurrenceDialog
                    form={form}
                    containerToggler={setConcurrenceSelectOpen}
                    trigger={(
                      <SelectItem
                        onMouseEnter={handleConcurrenceMouseOver}
                        onMouseOut={handleConcurrenceMouseOver}
                        value="custom"
                      >
                        {t('forms.recurrence.inputs.defaults.options.custom')}
                      </SelectItem>
                    )}
                  />
                </SelectContent>
              </Select>
              <FormDescription className="text-xs">
                {/* TODO: Pensar otro mensaje */}
                {t('forms.recurrence.inputs.defaults.description')}
              </FormDescription>
            </FormItem>
          )}
        />
        {
          currentDefaultConcurrence !== 'custom' && (
            currentDefaultConcurrence !== 'none' ? (
              <ConcurrenceEndDate
                form={form}
              />
            ) : (
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t('forms.budget.inputs.endDate.label')}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal row-start-2',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              <Typography variant="span">
                                {format((field.value || new Date()), 'long', currentLanguage)}
                              </Typography>
                            ) : (
                              <Typography variant="span">{t('forms.budget.inputs.endDate.placeholder')}</Typography>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          localeString={currentLanguage}
                          initialFocus
                          disabled={{ before: currentStartDate || null }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className="text-xs">
                      {t('forms.budget.inputs.endDate.description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )
          )
        }
      </form>
    </Form>
  );
}
