import { BadgeDollarSign, PieChart, LayoutDashboard } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import TooltipNavLink from '../shared/NavLink';

type Props = {
  className?: string
};

export default function Navigation({ className }: Props) {
  const classes = cn('flex flex-col gap-y-5', className);
  const { t } = useTranslation();

  const navigationArray = useMemo(() => ([
    { to: '/app/dashboard', icon: LayoutDashboard, label: t('app.navigation.dashboard') },
    { to: '/app/budgets', icon: PieChart, label: t('app.navigation.budgets') },
    { to: '/app/transactions', icon: BadgeDollarSign, label: t('app.navigation.transactions') },
  ]), [t]);

  return (
    <nav className={classes}>
      {navigationArray.map((linkData) => (
        <TooltipNavLink
          key={`sidebar-link-${linkData.label.toLowerCase()}`}
          to={linkData.to}
          icon={linkData.icon}
          label={linkData.label}
        />
      ))}
    </nav>
  );
}
