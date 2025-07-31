import { TrendingUp } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';
import ChartCard from '@/components/charts/ChartCard';
import { useEffect, useMemo, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { format } from '@formkit/tempo';
import useTransactions from '@/hooks/useTransactions';
import { SPANISH_MONTHS } from '@/lib/constants';
import { formatMoney, suffixNumberFormatter } from '@/lib/formatNumber';
import { cn, generateYearsList } from '@/lib/utils';
import { z } from 'zod';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import NoDataCard from '@/components/shared/NoDataCard';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@budmin/ui/shadcn/form';
import {
  Checkbox,
} from '@budmin/ui/shadcn/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@budmin/ui/shadcn/select';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@budmin/ui/shadcn/chart';
import {
  Typography,
} from '@budmin/ui/internal/Typography';

export const description = 'A linear line chart';

const FilterSchema = z.object({
  filterTypes: z.array(z.string()),
});

export default function MonthlyBalanceGraph() {
  const {
    state: {
      user,
    },
  } = useAuth();
  const { getBalance, state: { balance, recentTransactions } } = useTransactions();
  const [filterYearsList, setFilterYearsList] = useState<number[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const { t, i18n } = useTranslation();
  const filterForm = useForm<z.infer<typeof FilterSchema>>({
    resolver: zodResolver(FilterSchema),
    defaultValues: {
      filterTypes: ['totalBalance', 'income', 'expense'],
    },
  });

  const currentLanguage = useMemo(() => i18n.language, [i18n.language]);

  const { chartConfig, filterTypes, chartLines } = useMemo(() => ({
    chartConfig: {
      totalBalance: {
        label: t('common.balance'),
        color: 'hsl(var(--chart-1))',
      },
      income: {
        label: t('common.income.plural'),
        color: 'hsl(var(--chart-2))',
      },
      expense: {
        label: t('common.expense.plural'),
        color: 'hsl(var(--chart-3))',
      },
    } satisfies ChartConfig,

    filterTypes: [
      {
        id: 'totalBalance',
        label: t('common.totalBalance'),
        color: 'softBlack',
      },
      {
        id: 'income',
        label: t('common.income.plural'),
        color: 'safe',
      },
      {
        id: 'expense',
        label: t('common.expense.plural'),
        color: 'danger',
      },
    ] as const,

    chartLines: [
      {
        dataKey: 'totalBalance',
        stroke: '#1B1B1B',
      },
      {
        dataKey: 'income',
        stroke: 'hsl(var(--safe))',
      },
      {
        dataKey: 'expense',
        stroke: 'hsl(var(--danger))',
      },
    ],
  }), [t]);

  const filterTypesValues = useWatch({
    control: filterForm.control,
    name: 'filterTypes',
  });

  useEffect(() => {
    const getData = async () => {
      const januaryDate = new Date(parseInt(selectedYear, 10), 0, 1);

      getBalance(
        format(januaryDate, 'YYYY-MM', currentLanguage),
      );
    };

    getData();
  }, [getBalance, recentTransactions, selectedYear, currentLanguage]);

  useEffect(() => {
    const userCreationDate = new Date(user.createdAt);

    const yearsSinceCreation = generateYearsList(userCreationDate.getFullYear());

    setFilterYearsList(yearsSinceCreation);
  }, [user.createdAt]);

  useEffect(() => {
    const selectedYearBalanceHistory = balance[selectedYear];

    if (!selectedYearBalanceHistory) {
      setChartData([]);
      return;
    }

    const months = Object.keys(selectedYearBalanceHistory);

    const newChartData: any[] = [];

    months.forEach((month) => {
      const monthName = SPANISH_MONTHS[parseInt(month, 10) - 1];

      const {
        balance: totalBalance,
        totalExpense,
        totalIncome,
      } = selectedYearBalanceHistory[month];

      const dataPiece = {
        month: monthName,
        totalBalance,
        expense: totalExpense,
        income: totalIncome,
      };

      newChartData.push(dataPiece);
    });

    setChartData(newChartData);
  }, [balance, selectedYear]);

  return (
    <section className="md:col-span-10 xl:col-span-10">
      <ChartCard
        title={t('dashboard.monthlyBalanceGraph.graph.title')}
        titleIcon={<TrendingUp />}
        titleLeft
        subtitle={(
          <div className="flex gap-2 items-center">
            <Typography className="text-foreground">
              {t('common.year')}
            </Typography>
            <Select defaultValue={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-fit px-2 py-1 h-fit">
                <SelectValue placeholder={selectedYear} />
              </SelectTrigger>
              <SelectContent className="max-h-56">
                {filterYearsList.map((year) => (
                  <SelectItem key={`filter-years-${year}`} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        titleClassName="font-inter text-lg font-medium"
        headerClassName="px-4 py-4 border-b border-b-slate-200"
        contentClassName="px-4 pt-4"
        containerClassName="h-full"
        headerRightElement={(
          <Form {...filterForm}>
            <form onSubmit={(evt) => evt.preventDefault()}>
              <FormField
                control={filterForm.control}
                name="filterTypes"
                render={() => (
                  <FormItem>
                    <FormLabel className="sr-only">Tipo</FormLabel>
                    <FormDescription className="sr-only">
                      {t('dashboard.monthlyBalanceGraph.graph.description')}
                    </FormDescription>
                    <div className="flex flex-col gap-2 xl:flex-row xl:gap-4">
                      {
                        filterTypes.map((item) => (
                          <FormField
                            key={`filter-type-checkbox-${item.id}`}
                            control={filterForm.control}
                            name="filterTypes"
                            render={({ field }) => (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-center space-x-1 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => (checked
                                      ? field.onChange([...field.value, item.id])
                                      : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id,
                                        ),
                                      ))}
                                    className={cn({
                                      'data-[state=checked]:bg-softBlack border-softBlack': item.color === 'softBlack',
                                      'data-[state=checked]:bg-safe border-safe': item.color === 'safe',
                                      'data-[state=checked]:bg-danger border-danger': item.color === 'danger',
                                    })}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))
                      }
                    </div>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )}
      >
        <ChartContainer config={chartConfig} className="h-full w-full relative">
          {
            chartData.length > 0 ? (
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="capitalize"
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  type="number"
                  tickFormatter={(value) => `$${suffixNumberFormatter.format(value)}`}
                  tickMargin={8}
                  axisLine={false}
                  width={35}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent customValueFormatter={formatMoney} hideLabel />}
                />
                {
                  chartLines.map((line) => (
                    <Line
                      key={`chart-line-${line.dataKey}`}
                      dataKey={line.dataKey}
                      type="linear"
                      stroke={line.stroke}
                      strokeWidth={2}
                      dot={false}
                      hide={!filterTypesValues.find((item) => item === line.dataKey)}
                    />
                  ))
                }
              </LineChart>
            ) : (
              <NoDataCard />
            )
          }
        </ChartContainer>
      </ChartCard>
    </section>
  );
}
