import { useEffect, useState } from 'react';
import useCategories from '@/hooks/useCategories';
import { camelize, getMonthFromDate, removeAccents } from '@/lib/utils';
import ChartPie from '@/components/charts/Pie';
import ChartCard from '@/components/charts/ChartCard';
import { formatMoney } from '@/lib/formatNumber';
import useTransactions from '@/hooks/useTransactions';
import { useTranslation } from 'react-i18next';
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '@budmin/ui/shadcn/tabs';
import {
  Typography,
} from '@budmin/ui/internal/Typography';
import { type ChartConfig } from '@budmin/ui';
import { useDashboard } from '@/context/DashboardProvider';

const tabsDefaultValue = 'income';

// TODO: Category balance should be of current month, currently showing whole history

export default function CategoryBalanceGraph() {
  const { state: { monthBalance }, updateBalance } = useCategories();
  const { state: { recentTransactions } } = useTransactions();
  const [currentTab, setCurrentTab] = useState<string>(tabsDefaultValue);
  const [chartData, setChartData] = useState<any[]>([]);
  const { t, i18n } = useTranslation();
  const [chartConfig, setChartConfig] = useState< Record<string, any>>({
    categories: {
      label: t('common.category.plural'),
    },
  });
  const { year, month } = useDashboard();

  const currentLanguage = i18n.language;

  useEffect(() => {
    if (!monthBalance) return;

    const newChartData: any[] = [];
    const newChartConfig: Record<string, any> = {
      categories: {
        label: t('common.category.plural'),
      },
    } satisfies ChartConfig;

    monthBalance?.balance.forEach(({ category, totalExpense, totalIncome }) => {
      const translatedCategoryName = t(category.key);
      const normalizedName = camelize(removeAccents(translatedCategoryName));

      const skipCondition = (
        currentTab === 'income' && totalIncome === 0
      ) || (
        currentTab === 'expense' && totalExpense === 0
      );

      if (skipCondition) return;

      const dataValue = currentTab === 'income' ? totalIncome : totalExpense;
      const formattedDataValue = formatMoney(dataValue);

      const dataObj = {
        category: normalizedName,
        [currentTab]: dataValue,
        fill: category.color,
        formattedValue: formattedDataValue,
      };

      newChartData.push(dataObj);

      const configObj = {
        label: translatedCategoryName,
        color: category.color,
      };

      newChartConfig[normalizedName] = configObj;
    });

    setChartData(newChartData);
    setChartConfig(newChartConfig);
  }, [monthBalance, currentTab, t]);

  useEffect(() => {
    updateBalance({ year, month });
  }, [recentTransactions, year, month, updateBalance]);

  const onTabChange = (value: string) => {
    setCurrentTab(value);
  };

  return (
    <section className="md:col-span-10 md:row-start-3 xl:row-span-3 xl:col-start-11">
      <Tabs
        defaultValue={tabsDefaultValue}
        onValueChange={onTabChange}
        value={currentTab}
        className="w-full bg-white rounded-lg md:h-full md:flex md:flex-col"
      >
        <TabsList className="w-full justify-start gap-2">
          <TabsTrigger value="income">
            {t('dashboard.categoryBalanceGraph.labels.income')}
          </TabsTrigger>
          <TabsTrigger value="expense">
            {t('dashboard.categoryBalanceGraph.labels.expense')}
          </TabsTrigger>
        </TabsList>
        {
          ['income', 'expense'].map((type) => {
            const translatedType = type === 'income' ? t('common.income.singular') : t('common.expense.singular');

            return (
              <TabsContent key={crypto.randomUUID()} value={type} className="mt-0 relative md:flex-1 data-[state=active]:flex data-[state=active]:flex-col">
                {
                chartData.length === 0 && (
                  <Typography className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center whitespace-nowrap">
                    {t('dashboard.categoryBalanceGraph.graphOf')}
                    {' '}
                    {t('common.transaction.plural').toLowerCase()}
                    {' '}
                    {translatedType.toLowerCase()}
                    <Typography variant="span" className="block text-sm text-slate-600">
                      {t('helpers.noData')}
                    </Typography>
                  </Typography>
                )
              }
                <ChartCard
                  title={
                  `${translatedType}
                  ${t('helpers.per').toLowerCase()}
                  ${t('common.category.singular').toLowerCase()}`
                }
                  hidden={chartData.length === 0}
                  subtitle={monthBalance?.month ? getMonthFromDate(new Date(0, monthBalance.month), currentLanguage) : ''}
                  containerClassName="md:h-full"
                  contentClassName="md:flex"
                >
                  <ChartPie
                    chartConfig={chartConfig}
                    chartData={chartData}
                    dataKey={type}
                    nameKey="category"
                  />
                </ChartCard>
              </TabsContent>
            );
          })
        }
      </Tabs>
    </section>
  );
}
