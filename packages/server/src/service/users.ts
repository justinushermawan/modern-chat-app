import { Model } from 'mongoose';
import { CreateUserDTO } from '../model/dto/createUserDTO';

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
}
