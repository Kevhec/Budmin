import { getItem, setItem } from '@/lib/localStorage';
import { formatYearMonthDate } from '@/lib/utils';
import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren,
} from 'react';

interface DashboardContextType {
  month: number
  year: number
  compressedDate: string
  changeMonth: (newMonth: number) => void
  changeYear: (newYear: number) => void
}

const DashboardContext = createContext<DashboardContextType>({
  month: 0,
  year: 0,
  compressedDate: '00-0000',
  changeMonth: () => null,
  changeYear: () => null,
});

function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error('useDashboard should be used within a DashboardProvider');
  }

  return ctx;
}

function DashboardProvider({ children }: PropsWithChildren) {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [compressedDate, setCompressedDate] = useState(formatYearMonthDate({ year, month }));

  const changeMonth = useCallback((newMonth: number) => {
    setMonth(newMonth);
    setItem('dashboard-month', newMonth);
  }, []);

  const changeYear = useCallback((newYear: number) => {
    setYear(newYear);
    setItem('dashboard-year', newYear);
  }, []);

  useEffect(() => {
    setCompressedDate((prevDate) => formatYearMonthDate({ year, month, date: prevDate }));
  }, [month, year]);

  useEffect(() => {
    const savedMonth = Number.parseInt(getItem('dashboard-month'), 10);
    const savedYear = Number.parseInt(getItem('dashboard-year'), 10);

    if (savedMonth) {
      setMonth(savedMonth);
    }

    if (savedYear) {
      setYear(savedYear);
    }
  }, []);

  const value = useMemo(() => ({
    month,
    year,
    compressedDate,
    changeMonth,
    changeYear,
  }), [month, year, compressedDate, changeMonth, changeYear]);
  return (
    <DashboardContext.Provider value={value}>
      { children }
    </DashboardContext.Provider>
  );
}

export { DashboardProvider, useDashboard };
