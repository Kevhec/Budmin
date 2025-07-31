import { ArrowRight, type LucideIcon } from 'lucide-react';
import { NavLink, type NavLinkProps } from 'react-router';
import { useMediaQuery } from 'react-responsive';
import { cn } from '@/lib/utils';

interface Props extends Partial<NavLinkProps & React.RefAttributes<HTMLAnchorElement>> {
  icon: LucideIcon
  to: string
  label: string
}

const containerClasses = {
  default: 'flex justify-between rounded-sm group p-2 transition-colors',
  active: 'active bg-white/30',
  pending: 'pending',
};

export default function TooltipNavLink({ icon: IconComponent, label, ...props }: Props) {
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1024px)',
  });

  const srOnTablet = cn({ 'sr-only': isTablet });
  const arrowClasses = cn('group-hover:translate-x-1 transition-transform', srOnTablet);

  return (
    <NavLink
      {...props}
      className={({ isActive, isPending }) => [
        cn(
          props.className,
          containerClasses.default,
          {
            [containerClasses.pending]: isPending,
            [containerClasses.active]: isActive,
          },
        ),
      ].join(' ').trim()}
    >
      <div className="flex gap-4 items-center md">
        <IconComponent />
        <p>
          {label}
        </p>
      </div>
      <ArrowRight className={arrowClasses} />
    </NavLink>
  );
}
