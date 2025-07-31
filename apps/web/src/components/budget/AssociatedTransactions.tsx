import type { Transaction } from '@/types';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { Typography, Separator } from '@budmin/ui';
import TransactionResumeCard from '../TransactionResumeCard';

interface Props {
  transactions: Transaction[]
}

export default function AssociatedTransactions({ transactions }: Props) {
  const { t } = useTranslation();

  return (
    <div>
      <Typography variant="h3" className="mb-2 font-semibold text-xl">
        {t('budgetResumeCard.transactionsAmount')}
      </Typography>
      <div>
        {
          transactions.map((transaction, i, arr) => (
            <React.Fragment key={transaction.id}>
              <TransactionResumeCard
                transaction={transaction}
              />
              {
                i < arr.length - 1 && (
                  <Separator decorative />
                )
              }
            </React.Fragment>

          ))
        }
      </div>
    </div>
  );
}
