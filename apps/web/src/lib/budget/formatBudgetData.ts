import type { ApiBudget, CreateBudgetParams } from '@/types';
import { extractConcurrenceData } from '../utils';

function formatBudgetData(budget: CreateBudgetParams) {
  const {
    name,
    totalAmount,
    startDate,
    endDate,
  } = budget;

  const concurrenceFormData = extractConcurrenceData(budget);

  const formattedBudget: ApiBudget = {
    name,
    totalAmount,
    startDate,
    endDate,
    concurrence: concurrenceFormData,
  };

  return formattedBudget;
}

export default formatBudgetData;
