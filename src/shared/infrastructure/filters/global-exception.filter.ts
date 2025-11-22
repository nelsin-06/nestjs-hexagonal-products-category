import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message = 'Internal Server Error';
    let detail = null;

    // Lógica para extraer mensaje y detalle según el tipo de error
    if (exceptionResponse && typeof exceptionResponse === 'object') {
      // Caso 1: Excepción nativa de NestJS o BusinessException
      const resObj = exceptionResponse as any;

      message = resObj.message || message;
      detail = resObj.detail || null;

      // Caso especial: class-validator devuelve un array de mensajes
      if (Array.isArray(resObj.message)) {
        message = 'Validation Failed';
        detail = resObj.message;
      }
    } else if (typeof exceptionResponse === 'string') {
      // Caso 2: Excepción con mensaje simple
      message = exceptionResponse;
    } else if (exception instanceof Error) {
      // Caso 3: Error genérico de JS (no HttpException)
      message = exception.message;
    }

    response.status(status).json({
      httpStatus: status,
      ok: false,
      message,
      data: null,
      detail,
    });
  }
}
