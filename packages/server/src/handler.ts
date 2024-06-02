import { Context, Handler } from 'aws-lambda';

import { UsersController, MessagesController } from './controller';
import { users, messages } from './model';
import { verifyToken } from './middleware/verifyToken';

const usersController = new UsersController(users);

export const register: Handler = (event: any, context: Context) => {
  return usersController.register(event, context);
};

export const login: Handler = (event: any, context: Context) => {
  return usersController.login(event, context);
};

export const changePassword: Handler = verifyToken((event: any, context: Context) => {
  return usersController.changePassword(event, context);
});


const messagesController = new MessagesController(users, messages);

export const getMessages: Handler = (event: any, context: Context) => {
  return messagesController.getMessages(event, context);
};

export const sendMessage: Handler = verifyToken((event: any, context: Context) => {
  return messagesController.sendMessage(event, context);
});
