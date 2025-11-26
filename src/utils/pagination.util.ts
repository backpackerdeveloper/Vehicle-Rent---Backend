import { PaginationParams, PaginatedResponse } from '../types';

export const getPaginationParams = (
  page?: string | number,
  limit?: string | number
): PaginationParams => {
  const pageNum = page ? Number(page) : 1;
  const limitNum = limit ? Number(limit) : 10;

  return {
    page: Math.max(1, pageNum),
    limit: Math.min(100, Math.max(1, limitNum)),
  };
};

export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  pagination: PaginationParams
): PaginatedResponse<T> => {
  return {
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
};

export const getSkip = (page: number, limit: number): number => {
  return (page - 1) * limit;
};


