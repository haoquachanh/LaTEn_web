/**
 * Response Interceptor
 *
 * Automatically wraps all controller responses in a standard ResponseDto format
 */
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseDto } from '../dto/response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseDto<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseDto<T>> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((data) => {
        // If the response is already a ResponseDto, return it as-is
        if (data instanceof ResponseDto) {
          // Add request ID from headers
          data.requestId = request.headers['x-request-id'];
          return data;
        }

        // If data has a statusCode property, it might be a custom response
        if (data && typeof data === 'object' && 'statusCode' in data) {
          return new ResponseDto({
            ...data,
            requestId: request.headers['x-request-id'],
          });
        }

        // Default: wrap in success response
        return ResponseDto.success(data, 'Success', 200);
      }),
    );
  }
}
