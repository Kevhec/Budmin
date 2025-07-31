import { Budget } from '@/src/database/models';
import type { CreateBudgetParams } from '../types';

async function createBudget({
  name,
  totalAmount,
  startDate = new Date(),
  endDate,
  intervalMilliseconds,
  userId,
}: CreateBudgetParams) {
  try {
    let calculatedEndDate = endDate;

    // TODO: Check this end date, should it be nextExecutionDate?
    if (!endDate && intervalMilliseconds) {
      const dateFromInterval = new Date(startDate.getTime() + intervalMilliseconds);
      calculatedEndDate = dateFromInterval;
    }

    const newBudget = await Budget.create({
      name,
      totalAmount,
      startDate,
      endDate: calculatedEndDate,
      userId,
    });

    return newBudget;
  } catch (error) {
    throw new Error('Error occurred while creating new Budget');
  }
}

export default createBudget;
