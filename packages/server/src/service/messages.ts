import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

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
   * Get total messages
   */
  protected async getTotalMessages(): Promise<number> {
    try {
      const totalMessages = await this.messages.countDocuments({ parent: null });
      return totalMessages;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /**
   * Get messages
   */
  protected async get(page: number, pageSize: number): Promise<object> {
    try {
      const messages = await this.messages.find({ parent: null })
        .populate({
          path: 'user',
          select: 'name',
        })
        .populate({
          path: 'replies',
          populate: {
            path: 'user',
            select: 'name',
          },
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec();

      const populateRepliesRecursively = async (message: MessagesDocument) => {
        await message.populate({
          path: 'replies',
          populate: [
            {
              path: 'user',
              select: 'name',
            },
            {
              path: 'replies',
              populate: {
                path: 'user',
                select: 'name',
              },
            },
          ],
        });

        await Promise.all(message.replies.map(populateRepliesRecursively));
      };

      await Promise.all(messages.map(populateRepliesRecursively));

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
    const { parentId, user, content, files } = params;
  
    try {
      const userObj = await this.users.findById(user);

      let parentMessage = null;
      if (parentId) {
        parentMessage = await this.messages.findById(parentId);
        if (!parentMessage) {
          throw new CustomError('Parent message not found', 1003);
        }
      }

      let filesData = null;
      if (files && files.length > 0) {
        filesData = files.map((file) => {
          const fileId = uuidv4();
          return { fileId, fileName: file.fileName, data: file.data };
        });
      }

      const message = await this.messages.create({
        user: userObj,
        content,
        parent: parentMessage,
        files: filesData,
      });

      if (parentMessage) {
        parentMessage.replies.push(message);
        await parentMessage.save();
      }

      const messageObj = message.toObject();
      delete messageObj.parent;
      return { ...messageObj, parent: parentId };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
