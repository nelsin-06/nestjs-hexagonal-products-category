import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  httpStatus: number;
  ok: boolean;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const statusCode = response.statusCode;

        let message = 'Request completed successfully';
        let finalData = data;

        // Lógica inteligente para detectar el formato { message, data }
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          const hasDataKey = 'data' in data;
          const hasMessageKey = 'message' in data;

          // Si el objeto tiene explícitamente 'data' o 'message', asumimos que es un wrapper manual
          if (hasDataKey || hasMessageKey) {
            if (hasMessageKey) {
              message = data.message;
            }

            if (hasDataKey) {
              finalData = data.data;
            } else {
              // Si solo envió mensaje (ej: { message: 'Deleted' }), la data es null
              finalData = null;
            }
          }
        }

        // Manejo de void/undefined (ej: funciones que no retornan nada)
        if (finalData === undefined) {
          finalData = null;
        }

        return {
          httpStatus: statusCode,
          ok: true,
          message,
          data: finalData,
        };
      }),
    );
  }
}
