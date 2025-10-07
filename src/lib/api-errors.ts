import { AxiosError } from 'axios';

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = 'Bad Request') {
    super(message);
    this.name = 'BadRequestError';
  }
}


export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Access denied') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = 'Resource already exists') {
    super(message);
    this.name = 'ConflictError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = 'Internal Server Error') {
    super(message);
    this.name = 'InternalServerError';
  }
}


export class NetworkError extends ApiError {
  constructor(message: string = 'Server unavailable') {
    super(message);
    this.name = 'NetworkError';
  }
}


export function handleApiError(error: unknown): never {
  if (error instanceof AxiosError) {

    if (!error.response) {
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
        throw new NetworkError('Unable to connect to the server');
      }
      throw new NetworkError('Network error');
    }

    const { status, data } = error.response;
    const message = data?.message || 'API Error';

    switch (status) {
      case 400:
        throw new BadRequestError(message);
      case 401:
        throw new UnauthorizedError(message);
      case 403:
        throw new ForbiddenError(message);
      case 404:
        throw new NotFoundError(message);
      case 409:
        throw new ConflictError(message);
      case 500:
        throw new InternalServerError(message);
      default:
        throw new ApiError(`HTTP ${status}: ${message}`);
    }
  }

  const message = error instanceof Error ? error.message : 'Unknown error';
  throw new ApiError(message);
}