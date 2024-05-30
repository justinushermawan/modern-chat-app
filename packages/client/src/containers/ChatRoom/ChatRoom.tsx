import { Message } from '@/types';

import React, { useEffect, useRef, useState } from 'react';
import { Button, Input } from 'antd';

import ChatMessage from '@/components/ChatMessage/ChatMessage';

import './ChatRoom.less';

interface Props {
  messages: Message[];

  handleSendMessage: (message: string) => void;
}

export default function ChatRoom({ messages, handleSendMessage }: Props) {
  const [messageText, setMessageText] = useState('');

  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scroller.current) {
      scroller.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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

    if (scroller) {
      scroller.current?.scrollIntoView({ behavior: 'smooth' });
    }
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
                createdById={message.user}
                createdByName={message.name}
                createdAt={message.createdAt}
              />
            ))}
            <div ref={scroller} />
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
