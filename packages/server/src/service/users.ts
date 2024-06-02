import { Model } from 'mongoose';

import { UsersDocument } from '../model';
import { CreateUserDTO } from '../model/dto/createUserDTO';
import { LoginDTO } from '../model/dto/loginDTO';
import { ChangePasswordDTO } from '../model/dto/changePasswordDTO';
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

  /**
   * Change user password
   * @param params
   */
  protected async changeUserPassword(params: ChangePasswordDTO): Promise<object> {
    const { userId, currentPassword, newPassword } = params;
    if (!userId) throw new CustomError('User ID must be provided', 1004);
  
    try {
      const user = await this.users.findById(userId);
      if (!user) {
        throw new CustomError('User not found', 1005);
      }

      if (!(await user.comparePassword(currentPassword))) {
        throw new CustomError('Invalid current password', 1006);
      }

      user.password = newPassword;
      await user.save();
      
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
