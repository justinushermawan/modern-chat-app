import { Context } from 'aws-lambda';
import { Model } from 'mongoose';

import { MessagesService } from '../service/messages';
import { MessagesDocument, UsersDocument } from '../model';
import { SendMessageDTO } from '../model/dto/sendMessageDTO';
import { MessageUtil } from '../utils/message';

export class MessagesController extends MessagesService {
  constructor(users: Model<UsersDocument>, messages: Model<MessagesDocument>) {
    super(users, messages);
  }

  /**
   * Get messages
   * @param {*} event
   */
  async getMessages(event: any, context?: Context) {
    console.log('functionName', context.functionName);

    try {
      const { pageNumber } = event.queryStringParameters || { pageNumber: '1' };
      const page = parseInt(pageNumber, 10);
      
      const pageSize = 25;
      const messages = await this.get(page, pageSize);

      const totalMessages = await this.getTotalMessages();
      const totalPages = Math.ceil(totalMessages / pageSize);

      const pagination = {
        currentPage: page,
        totalPages,
        hasNext: pageNumber < totalPages,
        nextPage: pageNumber < totalPages ? page + 1 : null,
      };

      return MessageUtil.success({ messages, pagination });
    } catch (err) {
      console.error(err);
      return MessageUtil.error(err.message, err.code);
    }
  }

  /**
   * Send message
   * @param {*} event
   */
  async sendMessage(event: any, context?: Context) {
    console.log('functionName', context.functionName);
    const params: SendMessageDTO = JSON.parse(event.body);

    try {
      const result = await this.send({ ...params, user: event.user.id });

      return MessageUtil.success(result);
    } catch (err) {
      console.error(err);
      return MessageUtil.error(err.message, err.code);
    }
  }
}
