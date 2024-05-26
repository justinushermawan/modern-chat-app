import React, { useState } from 'react';
import { Button, Input } from 'antd';

import ChatMessage from '@/components/ChatMessage/ChatMessage';

import './ChatRoom.less';

export default function ChatRoom() {
  const [messageText, setMessageText] = useState('');

  const handleOnChangeMessage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    setMessageText(event.target.value);
  };

  const handleCreateMessage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
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
            <ChatMessage text="Hello, there!" createdAt="" />
            <ChatMessage text="Hello, there!" createdAt="" />
            <ChatMessage text="Hello, there!" createdAt="" />
            <ChatMessage text="Hello, there!" createdAt="" />
            <ChatMessage text="Hello, there!" createdAt="" />
            <ChatMessage text="Hello, there!" createdAt="" />
            <ChatMessage text="Hello, there!" createdAt="" />
            <ChatMessage text="Hello, there!" createdAt="" />
            <ChatMessage text="Hello, there!" createdAt="" />
            <ChatMessage text="Hello, there!" createdAt="" />
            <ChatMessage text="Hello, there!" createdAt="" />
            <ChatMessage text="Hello, there!" createdAt="" />
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
