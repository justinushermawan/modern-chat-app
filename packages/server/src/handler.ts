import { Context, Handler } from 'aws-lambda';

import { UsersController } from './controller/users';
console.log('called', process.env.DB_URL);
import { users } from './model';

const usersController = new UsersController(users);

export const createUser: Handler = (event: any, context: Context) => {
  return usersController.create(event, context);
}
