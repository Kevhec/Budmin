import axiosClient from '@/config/axios';
import type { ApiResponse, Category } from '@/types';

async function getCategories() {
  try {
    const { data } = await axiosClient.get<ApiResponse<Category[]>>('/category/');

    const categories = data.data;

    if (categories.length > 0) {
      return categories;
    }
    return null;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default getCategories;
