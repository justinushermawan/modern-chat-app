import mongoose, { Model } from 'mongoose';

import { UsersDocument, MessagesDocument } from '../model';
import { SendMessageDTO } from '../model/dto/sendMessageDTO';
import { CustomError } from '../model/vo/responseVo';

export class MessagesService {
  private users: Model<UsersDocument>;
  private messages: Model<MessagesDocument>;
  constructor(users: Model<UsersDocument>, messages: Model<MessagesDocument>) {
    this.users = users;
    this.messages = messages;
  }

  /**
   * Get messages
   */
  protected async get(): Promise<object> {
    try {
      const messages = await this.messages.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        {
          $unwind: '$userDetails',
        },
        {
          $project: {
            id: 1,
            user: 1,
            name: '$userDetails.name',
            content: 1,
            parent: 1,
            replies: 1,
            createdAt: 1,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ]).exec();
      return messages;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /**
   * Send message
   * @params params
   */
  protected async send(params: SendMessageDTO): Promise<object> {
    const { parentId, user, content } = params;
  
    try {
      const userObj = await this.users.findById(user);

      let parentMessage = null;
      if (parentId) {
        parentMessage = await this.messages.findById(parentId);
        if (!parentMessage) {
          throw new CustomError('Parent message not found', 1002);
        }
      }

      const message = await this.messages.create({
        user: userObj,
        content,
        parent: parentMessage,
      });

      if (parentMessage) {
        parentMessage.replies.push(message);
        await parentMessage.save();
      }

      const messageObj = message.toObject();
      delete messageObj.parent;
      return messageObj;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
