import { Response } from 'express';

export interface ApiResponseOptions<T> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: any;
}

export const sendSuccess = <T>({
  res,
  statusCode = 200,
  message,
  data,
  meta,
}: ApiResponseOptions<T>) => {
  const response: Record<string, any> = {
    success: true,
  };
  if (message) response.message = message;
  if (data !== undefined) response.data = data;
  if (meta !== undefined) response.meta = meta;

  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errorCode?: string,
  errors?: any[]
) => {
  const response: Record<string, any> = {
    success: false,
    message,
  };
  if (errorCode) response.errorCode = errorCode;
  if (errors) response.errors = errors;

  return res.status(statusCode).json(response);
};
