export type MonthData = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

export type YearData = Record<string, MonthData>;

export type BalanceData = Record<string, YearData>;

export interface PureBalance {
  totalIncome: number
  totalExpense: number
}
