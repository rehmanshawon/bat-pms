import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();
    const request = ctx.getRequest();

    const error_message =
      typeof exceptionResponse.message === 'string'
        ? exceptionResponse.message
        : exceptionResponse;

    response.status(status).json({
      statusCode: status,
      message: error_message,
      error: true,
      timestamp: new Date(),
      path: request.url,
    });
  }
}
