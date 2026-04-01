import { DashboardContext } from '@/context/DashboardProvider';
import { useContext } from 'react';

export default function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error('useDashboard should be used within a DashboardProvider');
  }

  return ctx;
}
