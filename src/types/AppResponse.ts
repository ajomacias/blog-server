import { Response } from 'express';

type TypedResponse<T> = Omit<Response, "json" | "status"> & {
  json(data: T): TypedResponse<T>;
} & { status(code: number): TypedResponse<T> };

type AppResponse = TypedResponse<{
    success: boolean,
    data?: any,
    error?: string,
    
}>

export { AppResponse }
