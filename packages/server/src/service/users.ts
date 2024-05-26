import { Model } from 'mongoose';

import { CreateUserDTO } from '../model/dto/createUserDTO';
import { LoginDTO } from '../model/dto/loginDTO';
import { CustomError } from '../model/vo/responseVo';
import { signToken } from '../utils/jwt';

export class UsersService {
  private users: Model<any>;
  constructor(users: Model<any>) {
    this.users = users;
  }

  /**
   * Create new user
   * @param params
   */
  protected async createUser(params: CreateUserDTO): Promise<object> {
    try {
      const result = await this.users.create({
        id: params.id,
        email: params.email,
        password: params.password,
        name: params.name,
      });
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /**
   * Verify user
   * @param params
   */
  protected async verifyUser(params: LoginDTO): Promise<object> {
    const { email, password } = params;
  
    try {
      const user = await this.users.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        throw new CustomError('Invalid email or password', 1001);
      }

      const { id, name } = user;
      const token = signToken({ id: user.id, email: user.email });

      return { id, name, email, token };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
