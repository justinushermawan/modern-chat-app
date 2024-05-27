import { Model } from 'mongoose';

import { UsersDocument } from '../model';
import { CreateUserDTO } from '../model/dto/createUserDTO';
import { LoginDTO } from '../model/dto/loginDTO';
import { CustomError } from '../model/vo/responseVo';
import { signToken } from '../utils/jwt';

export class UsersService {
  private users: Model<UsersDocument>;
  constructor(users: Model<UsersDocument>) {
    this.users = users;
  }

  /**
   * Create new user
   * @param params
   */
  protected async createUser(params: CreateUserDTO): Promise<object> {
    try {
      // Check if a user with the provided email already exists
      const existingUser = await this.users.findOne({ email: params.email });
      if (existingUser) {
        throw new CustomError('User with this email already exists', 1001);
      }

      const user = await this.users.create({
        email: params.email,
        password: params.password,
        name: params.name,
      });

      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
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
        throw new CustomError('Invalid email or password', 1002);
      }

      const { id, name } = user;
      const token = signToken({ id: user._id, email: user.email });

      return { id, name, email, token };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
