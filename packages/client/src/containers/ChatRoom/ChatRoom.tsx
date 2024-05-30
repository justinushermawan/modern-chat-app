import { Message } from '@/types';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Input } from 'antd';

import ChatMessage from '@/components/ChatMessage/ChatMessage';

import './ChatRoom.less';

interface Props {
  messages: Message[];
  loading: boolean;

  handleSendMessage: (message: string) => void;
  handleLoadMore: () => void;
}

export default function ChatRoom({ messages, loading, handleSendMessage, handleLoadMore }: Props) {
  const [messageText, setMessageText] = useState('');

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollIntoView({ behavior: 'smooth' });
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

    if (scrollerRef) {
      scrollerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOnScroll = useCallback(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer && chatContainer.scrollTop === 0 && !loading) {
      handleLoadMore();
    }
  }, [loading, handleLoadMore]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    chatContainer?.addEventListener('scroll', handleOnScroll);
    return () => chatContainer?.removeEventListener('scroll', handleOnScroll);
  }, [handleOnScroll]);

  return (
    <div className="chat-container">
      <div className="chat-container__background">
        <header>
          <div className="image">P</div>
          <span>Public</span>
        </header>
        <main>
          <div ref={chatContainerRef}>
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                text={message.content}
                createdById={message.user}
                createdByName={message.name}
                createdAt={message.createdAt}
              />
            ))}
            <div ref={scrollerRef} />
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
