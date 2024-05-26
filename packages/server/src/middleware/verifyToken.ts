import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import jwt from 'jsonwebtoken';

export const verifyToken = (handler: (event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>): (event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult> => {
  return async (event, context) => {
    const token = event.headers.Authorization || event.headers.authorization;

    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'No token provided' }),
      };
    }

    try {
      const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'modern-chat');
      (event as any).user = decoded;
    } catch (error) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid token' }),
      };
    }

    return handler(event, context);
  };
};
