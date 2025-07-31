import React, { useMemo, useRef, useState } from 'react';
import {
  type FieldValues, type Path, type UseFormReturn,
  useWatch,
} from 'react-hook-form';
import { cn, nthDay } from '@/lib/utils';
import { format } from '@formkit/tempo';
import { useTranslation } from 'react-i18next';
import { type Period } from '@budmin/ui';
import {
  TimePickerInput, TimePeriodSelect,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormControl, FormField, FormItem, FormLabel, FormMessage, Input,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button, RadioGroup, RadioGroupItem,
} from '@budmin/ui';
import ConcurrenceEndDate from '../ConcurrenceEndDate';

interface Props<T extends FieldValues = FieldValues> {
  trigger: React.ReactNode
  form: UseFormReturn<T>
  containerToggler?: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ConcurrenceDialog<T extends FieldValues>({
  trigger,
  form,
  containerToggler,
}: Props<T>) {
  const [period, setPeriod] = useState<Period>(() => {
    // Remove regular and non-breaking spaces from period string
    const defaultPeriod = format(new Date(), 'A').replace(/[\s\u00A0.]/g, '');
    return defaultPeriod as Period;
  });
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const [currentSteps, currentType, startDate] = useWatch({
    control: form.control,
    name: ['concurrenceSteps', 'concurrenceType', 'startDate'] as Path<T>[],
  });
  const { t } = useTranslation();

  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const periodRef = useRef<HTMLButtonElement>(null);

  const { concurrenceTypes, weekdaysOptions } = useMemo(() => ({
    concurrenceTypes: [
      {
        id: 'daily',
        value: {
          sing: t('helpers.time.day.singular'),
          plur: t('helpers.time.day.plural'),
        },
      },
      {
        id: 'weekly',
        value: {
          sing: t('helpers.time.week.singular'),
          plur: t('helpers.time.week.plural'),
        },
      },
      {
        id: 'monthly',
        value: {
          sing: t('helpers.time.month.singular'),
          plur: t('helpers.time.month.plural'),
        },
      },
      {
        id: 'semestrial',
        value: {
          sing: t('helpers.time.semester.singular'),
          plur: t('helpers.time.semester.plural'),
        },
      },
      {
        id: 'yearly',
        value: {
          sing: t('helpers.time.year.singular'),
          plur: t('helpers.time.year.plural'),
        },
      },
    ],
    weekdaysOptions: [
      {
        value: 'monday',
        label: {
          sr: t('helpers.time.weekdays.monday.full'),
          visual: t('helpers.time.weekdays.monday.single'),
        },
      },
      {
        value: 'tuesday',
        label: {
          sr: t('helpers.time.weekdays.tuesday.full'),
          visual: t('helpers.time.weekdays.tuesday.single'),
        },
      },
      {
        value: 'wednesday',
        label: {
          sr: t('helpers.time.weekdays.wednesday.full'),
          visual: t('helpers.time.weekdays.wednesday.single'),
        },
      },
      {
        value: 'thursday',
        label: {
          sr: t('helpers.time.weekdays.thursday.full'),
          visual: t('helpers.time.weekdays.thursday.single'),
        },
      },
      {
        value: 'friday',
        label: {
          sr: t('helpers.time.weekdays.friday.full'),
          visual: t('helpers.time.weekdays.friday.single'),
        },
      },
      {
        value: 'saturday',
        label: {
          sr: t('helpers.time.weekdays.saturday.full'),
          visual: t('helpers.time.weekdays.saturday.single'),
        },
      },
      {
        value: 'sunday',
        label: {
          sr: t('helpers.time.weekdays.sunday.full'),
          visual: t('helpers.time.weekdays.sunday.single'),
        },
      },
    ],
  }), [t]);

  const handleSave = async (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    const isFormOk = await form.trigger(
      ['concurrenceTime', 'concurrenceType', 'concurrenceTime', 'concurrenceWeekDay', 'concurrenceMonthSelect'] as Path<T>[],
    );

    if (isFormOk) {
      setDialogOpen(false);
    }

    if (containerToggler) {
      containerToggler(false);
    }
  };

  const handleDialogOpen = (open: boolean) => {
    if (containerToggler && !open) {
      containerToggler(false);
    }
    setDialogOpen(open);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
      <DialogTrigger
        asChild
      >
        <>
          {trigger}
        </>
      </DialogTrigger>
      <DialogContent className="max-w-md w-[calc(100%-2rem)] rounded-sm">
        <DialogHeader>
          <DialogTitle>
            {t('common.recurrence')}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t('forms.recurrence.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 items-center">
          <FormField
            control={form.control}
            name={'concurrenceSteps' as Path<T>}
            render={({ field }) => (
              <FormItem className="flex-1">
                <div className="flex items-center justify-between gap-4">
                  <FormLabel className="whitespace-nowrap">
                    {t('forms.recurrence.inputs.steps')}
                  </FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={1} className="w-16 text-center" value={field.value} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={'concurrenceType' as Path<T>}
            render={({ field }) => (
              <FormItem className="w-32">
                <FormLabel className="sr-only">
                  {t('forms.recurrence.inputs.type')}
                </FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger className="!mt-0 capitalize">
                      <SelectValue defaultValue={field.value} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {concurrenceTypes.map((type) => (
                      <SelectItem
                        value={type.id}
                        className="capitalize"
                        key={`concurrence-type-${type.id}`}
                      >
                        {
                          currentSteps && currentSteps > 1
                            ? type.value.plur
                            : type.value.sing
                        }
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name={'concurrenceTime' as Path<T>}
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel htmlFor="hours">
                {t('forms.recurrence.inputs.time')}
              </FormLabel>
              <FormControl className="!mt-0">
                <div className="flex gap-3">
                  <FormItem className="flex flex-col items-center gap-2">
                    <FormLabel htmlFor="hours">
                      {t('helpers.time.hour.plural')}
                    </FormLabel>
                    <FormControl>
                      <TimePickerInput
                        picker="12hours"
                        period={period}
                        id="hours"
                        date={field.value}
                        setDate={field.onChange}
                        ref={hourRef}
                        onRightFocus={() => minuteRef.current?.focus()}
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem className="flex flex-col items-center gap-2">
                    <FormLabel htmlFor="minutes">
                      {t('helpers.time.minute.plural')}
                    </FormLabel>
                    <FormControl>
                      <TimePickerInput
                        picker="minutes"
                        id="minutes"
                        date={field.value}
                        setDate={field.onChange}
                        ref={minuteRef}
                        onLeftFocus={() => hourRef.current?.focus()}
                        onRightFocus={() => periodRef.current?.focus()}
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem className="flex flex-col items-center gap-2">
                    <FormLabel htmlFor="period">
                      {t('helpers.time.period')}
                    </FormLabel>
                    <FormControl>
                      <TimePeriodSelect
                        id="period"
                        period={period}
                        setPeriod={setPeriod}
                        date={field.value}
                        setDate={field.onChange}
                        ref={periodRef}
                        onLeftFocus={() => minuteRef.current?.focus()}
                      />
                    </FormControl>
                  </FormItem>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {
          currentType === 'weekly' && (
            <FormField
              control={form.control}
              name={'concurrenceWeekDay' as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('forms.recurrence.inputs.repeatOn')}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex justify-evenly"
                    >
                      {
                        weekdaysOptions.map((weekday) => (
                          <FormItem
                            className="flex items-center space-y-0"
                            key={`concurrence-weekday-radio-${weekday.value}`}
                          >
                            <FormControl>
                              <RadioGroupItem value={weekday.value} className="!sr-only" />
                            </FormControl>
                            <FormLabel className={cn(
                              'p-1.5 aspect-square min-w-[auto] rounded-full bg-slate-100 w-8 grid place-items-center transition-colors',
                              {
                                'bg-slate-400': field.value === weekday.value,
                                'hover:bg-slate-300': field.value !== weekday.value,
                              },
                            )}
                            >
                              <span className="sr-only">{weekday.label.sr}</span>
                              <span aria-hidden>{weekday.label.visual}</span>
                            </FormLabel>
                          </FormItem>
                        ))
                      }
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        }
        {
          currentType === 'monthly' && (
            <FormField
              control={form.control}
              name={'concurrenceMonthSelect' as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('forms.recurrence.inputs.monthSelect.label')}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {/* TODO: Translate this placeholder */}
                        <SelectValue placeholder="Seleccione el día de concurrencia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="exact">
                        {t('forms.recurrence.inputs.monthSelect.options.exact')}
                        {' '}
                        {startDate?.getDate() || new Date().getDate()}
                      </SelectItem>
                      <SelectItem value="ordinal">
                        {t('forms.recurrence.inputs.monthSelect.options.ordinal')}
                        {' '}
                        {nthDay(startDate || new Date())}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        }
        <ConcurrenceEndDate
          form={form}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleSave} type="button">{t('common.save')}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
