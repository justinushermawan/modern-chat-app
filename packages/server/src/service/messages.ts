import { Model } from 'mongoose';

import { MessagesDocument } from '../model/messages';
import { SendMessageDTO } from '../model/dto/sendMessageDTO';
import { CustomError } from '../model/vo/responseVo';

export class MessagesService {
  private messages: Model<MessagesDocument>;
  constructor(messages: Model<MessagesDocument>) {
    this.messages = messages;
  }

  /**
   * Get messages
   */
  protected async get(): Promise<object> {
    try {
      const messages = await this.messages.find().sort({ createdAt: 1 }).exec();
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
      let parentMessage = null;
      if (parentId) {
        parentMessage = await this.messages.findById(parentId);
        if (!parentMessage) {
          throw new CustomError('Parent message not found', 1002);
        }
      }

      const message = await this.messages.create({
        user,
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
