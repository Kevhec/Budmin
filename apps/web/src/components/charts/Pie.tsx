import { Pie, PieChart } from 'recharts';
import { formatMoney, suffixNumberFormatter } from '@/lib/formatNumber';
import {
  ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent,
  Separator,
} from '@budmin/ui';

interface Props {
  chartData: any[]
  chartConfig: Record<string, any>
  dataKey: string
  nameKey: string
}

export default function ChartPie({
  chartData, chartConfig, dataKey, nameKey,
}: Props) {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px] md:max-g-[300px] xl:max-h-[350px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
    >
      <PieChart accessibilityLayer>
        <ChartTooltip
          content={(
            <ChartTooltipContent
              customValueFormatter={formatMoney}
              className="money"
              hideLabel
            />
          )}
        />
        <Pie
          data={chartData}
          dataKey={dataKey}
          nameKey={nameKey}
          label={(data) => `$ ${suffixNumberFormatter.format(data.value)}`}
        />
        <Separator />
        <ChartLegend
          wrapperStyle={{
            bottom: '0px',
          }}
          content={<ChartLegendContent />}
          className="-translate-y-2 flex-wrap gap-x-3 gap-y-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
}
