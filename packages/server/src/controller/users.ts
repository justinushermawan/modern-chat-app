import { Context } from 'aws-lambda';
import { Model } from 'mongoose';

import { UsersService } from '../service/users';
import { CreateUserDTO } from '../model/dto/createUserDTO';
import { LoginDTO } from '../model/dto/loginDTO';
import { UsersDocument } from '../model';
import { MessageUtil, StatusCode } from '../utils/message';

export class UsersController extends UsersService {
  constructor(users: Model<UsersDocument>) {
    super(users);
  }

  /**
   * Register new user
   * @param {*} event
   */
  async register(event: any, context?: Context) {
    console.log('functionName', context.functionName);
    const params: CreateUserDTO = JSON.parse(event.body);

    try {
      const result = await this.createUser(params);

      return MessageUtil.success(result);
    } catch (err) {
      console.error(err);
      return MessageUtil.error(err.message, err.code, StatusCode.badRequest);
    }
  }

  /**
   * Login existing account
   * @param {*} event
   */
  async login(event: any, context?: Context) {
    console.log('functionName', context.functionName);
    const params: LoginDTO = JSON.parse(event.body);

    try {
      const result = await this.verifyUser({
        email: params.email,
        password: params.password,
      });

      return MessageUtil.success(result);
    } catch (err) {
      console.error(err);
      return MessageUtil.error(err.message, err.code, StatusCode.unauthorized);
    }
  }
}
