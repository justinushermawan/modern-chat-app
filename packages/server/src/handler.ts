import { Context, Handler } from 'aws-lambda';

import { UsersController } from './controller/users';
import { users } from './model';

const usersController = new UsersController(users);

export const register: Handler = (event: any, context: Context) => {
  return usersController.register(event, context);
}

export const login: Handler = (event: any, context: Context) => {
  return usersController.login(event, context);
};
