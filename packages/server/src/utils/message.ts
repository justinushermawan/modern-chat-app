import { ResponseVO } from '../model/vo/responseVo';

export enum StatusCode {
  success = 200,
  badRequest = 400,
  unauthorized = 401,
  serverError = 500,
}

class Result {
  private statusCode: number;
  private code: number;
  private message: string;
  private data?: any;

  constructor(statusCode: number, code: number, message: string, data?: any) {
    this.statusCode = statusCode;
    this.code = code;
    this.message = message;
    this.data = data;
  }

  toString() {
    return {
      statusCode: this.statusCode,
      body: JSON.stringify({
        code: this.code,
        message: this.message,
        data: this.data,
      }),
    };
  }
}

export class MessageUtil {
  static success(data: object): ResponseVO {
    const result = new Result(StatusCode.success, 0, 'success', data);

    return result.toString();
  }

  static error(message: string, code: number = 1000, statusCode: StatusCode = StatusCode.serverError) {
    const result = new Result(statusCode, code, message);

    return result.toString();
  }
}
