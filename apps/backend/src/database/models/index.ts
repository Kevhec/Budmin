import type { Models } from '@/src/lib/types';
import Budget from './budget';
import Transaction from './transaction';
import Page from './page';
import User from './user';
import Category from './category';
import CronTask from './cronTask';
import CronJob from './cronJobs';
import Concurrence from './concurrence';
import UserPreferences from './userPreferences';

const models: Models = {
  User,
  UserPreferences,
  Budget,
  Transaction,
  Category,
  Page,
  Concurrence,
  CronTask,
  CronJob,
};

// Call associate to setup associations
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

export {
  User,
  UserPreferences,
  Page,
  Budget,
  Category,
  Transaction,
  Concurrence,
  CronTask,
  CronJob,
};
