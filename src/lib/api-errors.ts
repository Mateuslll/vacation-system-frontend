import { AxiosError } from "axios";
import type { ProblemDetail } from "@/types/problem-detail";

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = "Pedido inválido") {
    super(message);
    this.name = "BadRequestError";
  }
}

export class UnprocessableEntityError extends ApiError {
  constructor(message: string = "Dados não processáveis") {
    super(message);
    this.name = "UnprocessableEntityError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Recurso não encontrado") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "Acesso negado") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = "Conflito") {
    super(message);
    this.name = "ConflictError";
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = "Autenticação necessária") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = "Erro interno do servidor") {
    super(message);
    this.name = "InternalServerError";
  }
}

export class NetworkError extends ApiError {
  constructor(message: string = "Servidor indisponível") {
    super(message);
    this.name = "NetworkError";
  }
}

function isProblemDetailShape(data: unknown): data is ProblemDetail {
  return typeof data === "object" && data !== null;
}

/**
 * Extrai mensagem legível de ProblemDetail Spring ou payloads legados com `message`.
 */
export function extractProblemDetailMessage(data: unknown): string {
  if (!data || typeof data !== "object") {
    return "Erro na API";
  }
  const d = data as Record<string, unknown>;
  if (typeof d.detail === "string" && d.detail.trim()) {
    return d.detail.trim();
  }
  if (typeof d.message === "string" && d.message.trim()) {
    return d.message.trim();
  }
  if (typeof d.title === "string" && d.title.trim()) {
    return d.title.trim();
  }
  if (Array.isArray(d.errors) && d.errors.length > 0) {
    const first = d.errors[0] as Record<string, unknown> | string;
    if (typeof first === "string" && first.trim()) {
      return first.trim();
    }
    if (first && typeof first === "object" && typeof first.defaultMessage === "string") {
      return String(first.defaultMessage);
    }
  }
  return "Erro na API";
}

function isNormalizedApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Converte Axios ou erro já normalizado numa instância de {@link ApiError} (subclasses).
 */
export function parseApiFailure(error: unknown): Error {
  if (isNormalizedApiError(error)) {
    return error;
  }

  if (error instanceof AxiosError) {
    if (!error.response) {
      if (error.code === "ERR_NETWORK" || error.code === "ERR_CONNECTION_REFUSED") {
        return new NetworkError("Não foi possível ligar ao servidor.");
      }
      return new NetworkError("Erro de rede.");
    }

    const { status, data } = error.response;
    const message = extractProblemDetailMessage(data);

    switch (status) {
      case 400:
        return new BadRequestError(message);
      case 401:
        return new UnauthorizedError(message);
      case 403:
        return new ForbiddenError(message);
      case 404:
        return new NotFoundError(message);
      case 409:
        return new ConflictError(message);
      case 422:
        return new UnprocessableEntityError(message);
      case 500:
        return new InternalServerError(message);
      default:
        return new ApiError(`HTTP ${status}: ${message}`);
    }
  }

  const message = error instanceof Error ? error.message : "Erro desconhecido";
  return new ApiError(message);
}

export function handleApiError(error: unknown): never {
  throw parseApiFailure(error);
}

export function getErrorMessage(error: unknown): string {
  return parseApiFailure(error).message;
}
