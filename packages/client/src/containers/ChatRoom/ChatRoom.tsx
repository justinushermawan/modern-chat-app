import { Message } from '@/types';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import ChatMessage from '@/components/ChatMessage/ChatMessage';
import useSession from '@/hooks/useSession';

import './ChatRoom.less';

interface Props {
  messages: Message[];
  loading: boolean;

  handleSendMessage: (message: string, parentId: string | null) => void;
  handleLoadMore: () => void;
}

export default function ChatRoom({ messages, loading, handleSendMessage, handleLoadMore }: Props) {
  const { session } = useSession();

  const [messageText, setMessageText] = useState('');
  const [replyingMessage, setReplyingMessage] = useState<Message | null>(null);

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

  const handleOnKeyDownMessage = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      _handleSendMessage();
    }
  };

  const handleCreateMessage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    _handleSendMessage();
  };

  const _handleSendMessage = () => {
    handleSendMessage(messageText, replyingMessage ? replyingMessage._id : null);
  
    setMessageText('');
    setReplyingMessage(null);

    if (scrollerRef) {
      scrollerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReplyClick = (event: React.MouseEvent<HTMLElement>, message: Message) => {
    event.preventDefault();

    setReplyingMessage(message);
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
            {messages.map((message) => (
              <ChatMessage
                key={message._id}
                data={message}
                handleReplyClick={handleReplyClick}
              />
            ))}
            <div ref={scrollerRef} />
          </div>
        </main>
        <footer>
          {replyingMessage !== null && (
            <div className="chat-reply-quote">
              <div className="chat-reply-quote__bubble">
                <div className="chat-reply-quote__bubble__sender">
                  {replyingMessage.user._id === session?.id ? 'You' : replyingMessage.user.name}
                </div>
                <div className="chat-reply-quote__bubble__text">{replyingMessage.content}</div>
              </div>
              <Button
                shape="circle"
                icon={<CloseOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                onClick={() => setReplyingMessage(null)}
              />
            </div>
          )}
          <div className="chat-input">
            <form onSubmit={(e) => e.preventDefault()}>
              <Input
                type="text"
                value={messageText}
                placeholder="Type a message"
                onChange={handleOnChangeMessage}
                onKeyDown={handleOnKeyDownMessage}
              />
              <Button onClick={handleCreateMessage}>Send message</Button>
            </form>
          </div>
        </footer>
      </div>
    </div>
  );
}
