export class ResponseDto<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
  requestId?: string;
  statusCode?: number;

  constructor(partial: Partial<ResponseDto<T>>) {
    this.success = partial.success ?? true;
    this.message = partial.message;
    this.data = partial.data;
    this.errors = partial.errors;
    this.requestId = partial.requestId;
    this.statusCode = partial.statusCode;
  }

  static success<T>(data?: T, message?: string, statusCode?: number): ResponseDto<T> {
    return new ResponseDto<T>({
      success: true,
      message,
      data,
      statusCode,
    });
  }

  static error<T>(message?: string, errors?: any[], statusCode?: number): ResponseDto<T> {
    return new ResponseDto<T>({
      success: false,
      message,
      errors,
      statusCode,
    });
  }
}
