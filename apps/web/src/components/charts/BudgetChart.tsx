import {
  CartesianGrid, Line, LineChart, ReferenceArea, XAxis, YAxis,
} from 'recharts';
import { format } from '@formkit/tempo';
import { suffixNumberFormatter } from '@/lib/formatNumber';
import type { BudgetAmountDataNullable, BudgetBalanceChartData } from '@/types';
import { type NameType, type Payload, type ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { useTranslation } from 'react-i18next';
import {
  type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,
} from '@budmin/ui/shadcn/chart';
import { Typography } from '@budmin/ui/internal/Typography';
import { Separator } from '@budmin/ui/shadcn/separator';
import { cn } from '@/lib/utils';

interface Props {
  budgetAmountData: BudgetAmountDataNullable
  chartConfig: ChartConfig
  chartData: BudgetBalanceChartData[]
  className?: string
}

interface BudgetChartTooltipProps {
  value: ValueType
  item: Payload<ValueType, NameType>
}

function BudgetChartTooltip({
  value,
  item,
}: BudgetChartTooltipProps) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2 flex-col">
      {
        (item.payload.description && item.payload.amount) && (
          <div className="flex gap-2">
            <div
              className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-darkGray self-center"
            />
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 justify-between">
                <Typography className="text-xs">
                  {t('common.transaction.singular')}
                  :
                </Typography>
                <Typography className="text-xs">
                  {item.payload.description}
                </Typography>
              </div>
              <div className="flex gap-2 justify-between">
                <Typography className="text-xs">
                  {t('common.amount')}
                  :
                </Typography>
                <Typography className="text-xs">
                  $
                  {item.payload.amount}
                </Typography>
              </div>
            </div>
          </div>
        )
      }
      <Separator decorative />
      <div className="flex gap-2 justify-between">
        <Typography className="text-xs">
          {t('common.balance')}
          :
        </Typography>
        <Typography className="text-xs">
          $
          {value}
        </Typography>
      </div>
    </div>
  );
}

export default function BudgetChart({
  budgetAmountData,
  chartConfig,
  chartData,
  className,
}: Props) {
  const containerClasses = cn('min-h-[100px]', className);
  return (
    <ChartContainer config={chartConfig} className={containerClasses}>
      <LineChart
        accessibilityLayer
        data={chartData}
        className="w-full"
      >
        <CartesianGrid />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => {
            const date = new Date(value);
            return format(date, 'MMM DD');
          }}
          className="capitalize"
        />
        <YAxis
          dataKey="balance"
          type="number"
          width={35}
          tickFormatter={(value) => `$${suffixNumberFormatter.format(value)}`}
        />
        {budgetAmountData?.amountBounds?.safe?.y1 != null && (
          <ReferenceArea
            y1={budgetAmountData.amountBounds.safe.y1}
            fill="hsl(145 39% 57%)"
          />
        )}
        {budgetAmountData?.amountBounds?.warn?.y1 != null
        && budgetAmountData.amountBounds.warn.y2 != null && (
          <ReferenceArea
            y1={budgetAmountData.amountBounds.warn.y1}
            y2={budgetAmountData.amountBounds.warn.y2}
            fill="hsl(34 85% 63%)"
          />
        )}
        {budgetAmountData?.amountBounds?.danger?.y2 != null && (
          <ReferenceArea
            y2={budgetAmountData.amountBounds.danger.y2}
            fill="hsl(6 69% 58%)"
          />
        )}

        <ChartTooltip
          cursor={false}
          content={(
            <ChartTooltipContent
              indicator="line"
              // eslint-disable-next-line react/no-unstable-nested-components
              formatter={(value, _, item) => (
                <BudgetChartTooltip
                  value={value}
                  item={item}
                />
              )}
            />
          )}
        />
        <Line
          dataKey="balance"
          type="monotone"
          strokeWidth={2}
          stroke="#1b1b1b"
        />
      </LineChart>
    </ChartContainer>
  );
}
