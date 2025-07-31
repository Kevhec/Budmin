import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import {
  CalendarIcon, Check, ChevronsUpDown, Circle,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { format } from '@formkit/tempo';
import { useTranslation } from 'react-i18next';
import { transactionSchema } from '@/schemas/creation';
import useCategories from '@/hooks/useCategories';
import {
  cn, getModeValue, keywordsFilter, nthDay,
} from '@/lib/utils';
import useBudgets from '@/hooks/useBudgets';
import ConcurrenceEndDate from '@/components/ConcurrenceEndDate';
import { concurrenceInit } from '@/lib/constants';
import {
  type CreateTransactionParams,
  type Transaction,
  TransactionType,
} from '@/types';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@budmin/ui/shadcn/select';
import {
  Popover,
  PopoverContent,
  PopoverContentNoPortal,
  PopoverTrigger,
} from '@budmin/ui/shadcn/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@budmin/ui/shadcn/command';
import { ScrollArea } from '@budmin/ui/shadcn/scroll-area';
import ConcurrenceDialog from '../ConcurrenceDialog';

type TransactionFormType = z.infer<typeof transactionSchema>;

export interface TransactionFormProps {
  formId: string;
  className?: string;
  editMode?: boolean;
  item?: Transaction;
  onSubmit: (value: CreateTransactionParams) => void;
  dirtyChecker?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ComboboxBudget {
  value: string;
  label: string;
}

export default function TransactionForm({
  formId,
  className,
  editMode,
  item,
  onSubmit,
  dirtyChecker,
}: TransactionFormProps) {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [budgetsOpen, setBudgetsOpen] = useState(false);
  const [comboboxBudgets, setComboboxBudgets] = useState<ComboboxBudget[]>([]);
  const [isConcurrenceSelectOpen, setConcurrenceSelectOpen] = useState(false);
  const [isConcurrenceOptionHovered, setIsConcurrenceOptionHovered] = useState(false);
  const {
    state: { categories },
  } = useCategories();
  const {
    state: { budgets },
  } = useBudgets();
  const { t, i18n } = useTranslation();

  const currentLanguage = i18n.language;
  const languageCode = currentLanguage.split('-')[0];
  const getValue = getModeValue(editMode);

  const { concurrence } = item || {};

  const form = useForm<TransactionFormType>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: getValue(item?.description, ''),
      type: getValue(item?.type, TransactionType.Expense),
      amount: getValue(item?.amount, 0),
      categoryId: getValue(
        item?.category?.id,
        categories.find((category) => category.key === 'category.general')?.id,
      ),
      budgetId: getValue(item?.budget?.id, undefined),
      startDate: getValue(new Date(item?.date || ''), new Date()),
      concurrenceDefaults: getValue(
        concurrence?.defaults,
        concurrenceInit.defaults,
      ),
      concurrenceTime: getValue(
        new Date(concurrence?.time || ''),
        concurrenceInit.time,
      ),
      concurrenceSteps: getValue(concurrence?.steps, concurrenceInit.steps),
      concurrenceWithEndDate: getValue(
        concurrence?.withEndDate,
        concurrenceInit.withEndDate,
      ),
      concurrenceType: getValue(concurrence?.type, concurrenceInit.type),
      concurrenceWeekDay: getValue(
        concurrence?.weekDay,
        concurrenceInit.weekDay,
      ),
      concurrenceMonthSelect: getValue(
        concurrence?.monthSelect,
        concurrenceInit.monthSelect,
      ),
      concurrenceEndDate: getValue(
        new Date(concurrence?.endDate || ''),
        concurrenceInit.endDate,
      ),
    },
  });

  const [currentDefaultConcurrence, currentStartDate] = useWatch({
    control: form.control,
    name: ['concurrenceDefaults', 'startDate'],
  });

  const {
    formState: { isDirty },
  } = form;

  const handleConcurrenceSelectOpen = useCallback(
    (open: boolean) => {
      if (!isConcurrenceOptionHovered) {
        setConcurrenceSelectOpen(open);
      }
    },
    [isConcurrenceOptionHovered],
  );

  const handleConcurrenceMouseOver = (
    evt: React.MouseEvent<HTMLDivElement>,
  ) => {
    evt.stopPropagation();
    if (
      evt.relatedTarget
      && !evt.currentTarget.contains(evt.relatedTarget as Node)
    ) {
      const didMouseEnter = evt.type === 'mouseenter';
      setIsConcurrenceOptionHovered(didMouseEnter);
    }
  };

  useEffect(() => {
    if (dirtyChecker) {
      dirtyChecker(isDirty);
    }
  }, [isDirty, dirtyChecker]);

  const containerClasses = cn('flex flex-col gap-2 md:gap-4', className);

  const comboboxCategories = categories.map((category) => ({
    label: t(category.key),
    value: category.id,
    key: category.key,
    color: category.color,
  }));

  useEffect(() => {
    const newComboboxBudgets = budgets.map((budget) => ({
      value: budget.id,
      label: budget.name,
    }));

    setComboboxBudgets(newComboboxBudgets);
  }, [budgets]);

  return (
    <Form {...form}>
      <form
        className={containerClasses}
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('forms.transaction.inputs.type.label')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t(
                        'forms.transaction.inputs.type.placeholder',
                      )}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="expense">
                    {t('common.expense.singular')}
                  </SelectItem>
                  <SelectItem value="income">
                    {t('common.income.singular')}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-xs">
                {t('forms.transaction.inputs.type.description')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('forms.transaction.inputs.description.label')}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    'forms.transaction.inputs.description.placeholder',
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs">
                {t('forms.transaction.inputs.description.description')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('forms.transaction.inputs.amount.label')}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={t('forms.transaction.inputs.amount.placeholder')}
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs">
                {t('forms.transaction.inputs.amount.description')}
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
                {t('forms.transaction.inputs.startDate.label')}
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
                        <span>
                          {t('forms.transaction.inputs.startDate.placeholder')}
                        </span>
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
                {t('forms.transaction.inputs.startDate.description')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2 md:grid md:grid-cols-2">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => {
              const currentValue = field.value;
              const currentCategory = comboboxCategories.find(
                (category) => category.value === currentValue,
              );

              return (
                <FormItem className="flex flex-col md:block">
                  <FormLabel>
                    {t('forms.transaction.inputs.category.label')}
                  </FormLabel>
                  <Popover
                    open={categoriesOpen}
                    onOpenChange={setCategoriesOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full justify-between',
                            !currentValue && 'text-muted-foreground',
                          )}
                        >
                          <div className="flex gap-2 items-center">
                            <Circle
                              fill={currentCategory?.color || '#000000'}
                              stroke="none"
                              className="w-3"
                            />
                            {currentValue
                              ? t(currentCategory?.key || 'category.unnamed')
                              : t('category.general')}
                          </div>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContentNoPortal align="end" className="w-full p-0">
                      <Command filter={keywordsFilter}>
                        <CommandInput
                          placeholder={t(
                            'forms.transaction.inputs.category.placeholder',
                          )}
                        />
                        <ScrollArea className="h-64">
                          <CommandList className="max-h-none overflow-auto">
                            <CommandEmpty>
                              {t('forms.transaction.inputs.category.notFound')}
                            </CommandEmpty>
                            <CommandGroup>
                              {comboboxCategories.map((category) => (
                                <CommandItem
                                  value={category.value}
                                  key={category.value}
                                  onSelect={() => {
                                    form.setValue('categoryId', category.value);
                                    setCategoriesOpen(false);
                                  }}
                                  keywords={[category.label]}
                                  className="flex justify-between"
                                >
                                  <div className="flex items-center gap-2">
                                    <Circle
                                      fill={category.color || '#000000'}
                                      stroke="none"
                                      className="w-3"
                                    />
                                    {category.label}
                                  </div>
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      category.value === currentValue
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </ScrollArea>
                      </Command>
                    </PopoverContentNoPortal>
                  </Popover>
                  <FormDescription className="text-xs">
                    {t('forms.transaction.inputs.category.description')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="budgetId"
            render={({ field }) => (
              <FormItem className="flex flex-col md:block">
                <FormLabel>
                  {t('forms.transaction.inputs.budget.label')}
                </FormLabel>
                <Popover open={budgetsOpen} onOpenChange={setBudgetsOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-full justify-between',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        <div className="flex gap-2 items-center">
                          {field.value
                            ? comboboxBudgets.find(
                              (budget) => budget.value === field.value,
                            )?.label
                            : t('forms.transaction.inputs.budget.button')}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContentNoPortal align="end" className="w-full p-0">
                    <Command filter={keywordsFilter}>
                      <CommandInput placeholder="Busca un presupuesto..." />
                      <ScrollArea className="max-h-64">
                        <CommandList className="max-h-none overflow-visible">
                          <CommandEmpty>
                            {t('forms.transaction.inputs.budget.notFound')}
                          </CommandEmpty>
                          <CommandGroup>
                            {comboboxBudgets?.map((budget) => (
                              <CommandItem
                                value={budget.value}
                                key={budget.value}
                                keywords={[budget.label]}
                                onSelect={() => {
                                  form.setValue('budgetId', budget.value);
                                  setBudgetsOpen(false);
                                }}
                                className="flex gap-2"
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    budget.value === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                <div className="flex items-center gap-2">
                                  {budget.label}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </ScrollArea>
                    </Command>
                  </PopoverContentNoPortal>
                </Popover>
                <FormDescription className="text-xs">
                  {t('forms.transaction.inputs.budget.description')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="concurrenceDefaults"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('forms.recurrence.inputs.defaults.label')}
              </FormLabel>
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
                    <SelectValue
                      placeholder={t(
                        'forms.recurrence.inputs.defaults.options.none',
                      )}
                    />
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
                    {format(
                      currentStartDate || new Date(),
                      'dddd',
                      languageCode,
                    )}
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
                    {format(
                      currentStartDate || new Date(),
                      'MMMM',
                      languageCode,
                    )}
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
        {!['none', 'custom'].includes(currentDefaultConcurrence) && (
          <ConcurrenceEndDate form={form} />
        )}
      </form>
    </Form>
  );
}
