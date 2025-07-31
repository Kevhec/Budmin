import { useContext } from 'react';
import { CategoriesContext } from '@/context/CategoriesProvider';
import type { CategoriesContextType } from '@/types';

function useCategories(): CategoriesContextType {
  const categoriesContext = useContext(CategoriesContext);
  if (categoriesContext === undefined || categoriesContext === null) {
    throw new Error('useCategories must be used within an CategoriesProvider');
  }
  return categoriesContext;
}

export default useCategories;
