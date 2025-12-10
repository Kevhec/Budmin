import convert from './utils/convert';

const SESSION_EXPIRATION_TIME_DAYS = convert(120, 'hour', 'day');
const REMEMBER_ME_EXPIRATION_TIME_DAYS = 30;

const dateStringRegex = /^\d{4}-(0[1-9]|1[0-2])$/;

const DEFAULT_CONCURRENCES = ['custom', 'daily', 'weekly', 'monthly', 'yearly'] as const;

const CONCURRENCE_TYPE = ['daily', 'weekly', 'monthly', 'semestrial', 'yearly'] as const;

const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

const ENGLISH_ORDINALS = ['first', 'second', 'third', 'fourth', 'fifth'] as const;

export {
  REMEMBER_ME_EXPIRATION_TIME_DAYS,
  SESSION_EXPIRATION_TIME_DAYS,
  CONCURRENCE_TYPE,
  DEFAULT_CONCURRENCES,
  WEEKDAYS,
  dateStringRegex,
  ENGLISH_ORDINALS,
};
