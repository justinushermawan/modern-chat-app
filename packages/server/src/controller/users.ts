import { Context } from 'aws-lambda';
import { Model } from 'mongoose';

import { UsersService } from '../service/users';
import { CreateUserDTO } from '../model/dto/createUserDTO';
import { MessageUtil } from '../utils/message';

export class UsersController extends UsersService {
  constructor(users: Model<any>) {
    super(users);
  }

  /**
   * Create new user
   * @param {*} event
   */
  async create(event: any, context?: Context) {
    console.log('functionName', context.functionName);
    const params: CreateUserDTO = JSON.parse(event.body);

    try {
      const result = await this.createUser({
        id: params.id,
        email: params.email,
        password: params.password,
        name: params.name,
      });

      return MessageUtil.success(result);
    } catch (err) {
      console.error(err);
      return MessageUtil.error(err.code, err.message);
    }
  }
}
