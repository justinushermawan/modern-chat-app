import { Message } from '@/types';

import React, { useState } from 'react';
import { Button, Input } from 'antd';

import ChatMessage from '@/components/ChatMessage/ChatMessage';

import './ChatRoom.less';

interface Props {
  messages: Message[];

  handleSendMessage: (message: string) => void;
}

export default function ChatRoom({ messages, handleSendMessage }: Props) {
  const [messageText, setMessageText] = useState('');

  const handleOnChangeMessage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    setMessageText(event.target.value);
  };

  const handleCreateMessage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    handleSendMessage(messageText);
    setMessageText('');
  };

  return (
    <div className="chat-container">
      <div className="chat-container__background">
        <header>
          <div className="image">P</div>
          <span>Public</span>
        </header>
        <main>
          <div>
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                text={message.content}
                createdBy={message.name}
                createdAt=""
              />
            ))}
          </div>
        </main>
        <footer>
          <form onSubmit={(e) => e.preventDefault()}>
            <Input
              type="text"
              value={messageText}
              placeholder="Type a message"
              onChange={handleOnChangeMessage}
            />
            <Button onClick={handleCreateMessage}>Send message</Button>
          </form>
        </footer>
      </div>
    </div>
  );
}
