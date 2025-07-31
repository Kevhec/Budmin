import cron from 'node-cron';
import parser, { type ParserOptions } from 'cron-parser';

function generateNextExecutionDate(cronExp: string, options?: ParserOptions) {
  if (!cron.validate(cronExp)) {
    throw new Error(`Invalid cron expression: ${cronExp}`);
  }

  const interval = parser.parseExpression(cronExp, options);
  return interval.next().toDate();
}

export default generateNextExecutionDate;
