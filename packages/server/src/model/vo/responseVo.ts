export class ResponseBodyVO {
  code: number;
  message: string;
  data?: object;
}

export class ResponseVO {
  statusCode: number;
  body: string;
}

export class CustomError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}
