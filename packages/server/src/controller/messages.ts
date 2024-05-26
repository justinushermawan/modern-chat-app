import { Context } from 'aws-lambda';
import { Model } from 'mongoose';

import { MessagesService } from '../service/messages';
import { MessagesDocument } from '../model';
import { SendMessageDTO } from '../model/dto/sendMessageDTO';
import { MessageUtil } from '../utils/message';

export class MessagesController extends MessagesService {
  constructor(messages: Model<MessagesDocument>) {
    super(messages);
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
      return MessageUtil.error(err.code, err.message);
    }
  }
}
