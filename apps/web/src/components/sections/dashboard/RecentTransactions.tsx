import React, { useEffect, useState } from 'react';
import { type Transaction } from '@/types';
import TransactionResumeCard from '@/components/TransactionResumeCard';
import useTransactions from '@/hooks/useTransactions';
import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Separator } from '@budmin/ui';
import {
  Typography,
} from '@budmin/ui/internal/Typography';

export default function RecentTransactions() {
  const { state: { recentTransactions } } = useTransactions();
  const [
    transactionsWithPlaceholder,
    setTransactionsWithPlaceholders,
  ] = useState<Transaction[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const getPlaceholders = () => new Array(4 - recentTransactions.length).fill({
      name: '',
      date: '',
      amount: 0,
      type: 'income',
      hidden: true,
    });

    const newPlaceholders = getPlaceholders();

    const newTransactionsWithPlaceholders: Transaction[] = [
      ...recentTransactions,
      ...newPlaceholders,
    ];
    setTransactionsWithPlaceholders(newTransactionsWithPlaceholders);
  }, [recentTransactions]);

  return (
    <section className="rounded-md mb-2 md:mb-0 bg-white p-4 md:flex-1 md:col-span-10 md:row-start-2">
      <div className="flex justify-between items-center pb-4">
        <Typography variant="h2">
          {t('dashboard.recentTransactions.heading')}
        </Typography>
        <NavLink to="/app/transactions" className="text-sm text-blueishGray">
          {t('helpers.seeMore')}
        </NavLink>
      </div>
      <div className="relative">
        {transactionsWithPlaceholder.map((transaction, i) => {
          const {
            hidden,
          } = transaction;

          let fallbackId;

          if (!transaction.id) {
            fallbackId = crypto.randomUUID();
          }

          return (
            <React.Fragment key={transaction.id || fallbackId}>
              <TransactionResumeCard
                transaction={transaction}
                hidden={hidden}
              />
              {
                (
                  recentTransactions.length !== 0
                  && transactionsWithPlaceholder.length - 1 !== i
                ) && (
                  <Separator decorative />
                )
              }
            </React.Fragment>
          );
        })}
        {
          recentTransactions.length === 0 && (
            <div className="w-full h-full absolute top-0 right-0 grid place-items-center">
              <Typography className="text-sm text-slate-600">
                {t('helpers.noData')}
              </Typography>
            </div>
          )
        }
      </div>
    </section>
  );
}
