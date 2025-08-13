import { Navigate, Outlet, useLocation } from 'react-router';
import { CirclePlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import React, { useEffect, useRef, useState } from 'react';
import Navigation from '@/components/sections/Navigation';
import Header from '@/components/sections/Header';
import {
  ScrollArea,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@budmin/ui';
import CreationDialog from '@/components/creationMenu/CreationDialog';
import TransactionsProvider from '@/context/TransactionProvider';
import CategoriesProvider from '@/context/CategoriesProvider';
import BudgetProvider from '@/context/BudgetProvider';
import Footer from '@/components/sections/Footer';
import { cn } from '@/lib/utils';
/* import { SidebarProvider } from '@/components/ui/sidebar'; */

export default function AppLayout() {
  const location = useLocation();
  const { t } = useTranslation();
  const headerRef = useRef<HTMLElement | null>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const isBudgetsPage = location.pathname === '/app/budgets';

  const isTabletOrDesktop = useMediaQuery({
    query: '(min-width: 768px)',
  });

  let ContainerComponent: React.ElementType = 'div';

  const getContainerHeight = () => {
    if (headerRef.current) {
      const headerHeight = headerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      const newContainerHeight = windowHeight - headerHeight;

      setContainerHeight(newContainerHeight);
    }
  };

  useEffect(() => {
    getContainerHeight();

    window.addEventListener('resize', getContainerHeight);

    return () => window.removeEventListener('resize', getContainerHeight);
  }, []);

  if (location.pathname === '/app/') {
    return <Navigate to="/app/dashboard" replace />;
  }

  if (!isBudgetsPage || !isTabletOrDesktop) {
    ContainerComponent = ScrollArea;
  }

  const containerClasses = cn(
    'w-full relative h-full',
  );

  const mainElementClasses = cn(
    'px-4 py-2 md:py-4 flex flex-col bg-softGray md:min-h-full md:h-min grow max-w-[100vw] md:absolute md:inset-0',
    {
      'md:h-full md:min-h-auto': isBudgetsPage && isTabletOrDesktop,
    },
  );

  return (
    /*     <SidebarProvider> */
    <CategoriesProvider>
      <TransactionsProvider>
        <BudgetProvider>
          <div className="flex min-h-screen max-h-screen font-inter relative bg-softGray">
            <div className="fixed bottom-2 right-4 z-10">
              <Popover>
                <PopoverTrigger className="bg-primary rounded-full p-2 text-white">
                  <CirclePlus className="w-9 h-9" />
                  <span className="sr-only">{t('creation.trigger')}</span>
                </PopoverTrigger>
                <PopoverContent align="end" className="flex flex-col gap-2">
                  <CreationDialog
                    type="transaction"
                    triggerLabel={t('creation.transactionTrigger')}
                    modalTitle={t('creation.modal.transaction.title')}
                  />
                  <CreationDialog
                    type="budget"
                    triggerLabel={t('creation.budgetTrigger')}
                    modalTitle={t('creation.modal.budget.title')}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <aside className="hidden lg:flex lg:flex-col lg:justify-between px-6 pt-5 pb-4 bg-[#343A40] text-white min-w-60 font-openSans">
              <div>
                <p className="text-3xl font-semibold mb-32 font-openSans">
                  Budmin
                </p>
                <Navigation />
              </div>
              <Footer />
            </aside>
            <div className="flex flex-col w-full md:max-h-screen">
              <Header ref={headerRef} />
              <ScrollArea
                className={containerClasses}
                /* style={
                  {
                    '--height': `${containerHeight}px`,
                  } as React.CSSProperties
                } */
              >
                <main className={mainElementClasses}>
                  <Outlet />
                </main>
              </ScrollArea>
            </div>
          </div>
        </BudgetProvider>
      </TransactionsProvider>
    </CategoriesProvider>
    /*     </SidebarProvider> */
  );
}
