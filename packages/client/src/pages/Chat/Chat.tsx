import type { OnlineUser, Message } from '@/types';

import { useCallback, useEffect, useState } from 'react';
import { useWebSocket } from 'ahooks';
import { ReadyState } from 'ahooks/lib/useWebSocket';

import useSession from '@/hooks/useSession';
import Menu from '@/containers/Menu/Menu';
import ChatRoom from '@/containers/ChatRoom/ChatRoom';

import './Chat.less';

const url = 'ws://localhost:8080';

export interface MessageData {
  type: 'onlineUsers' | 'chatHistory';
  data: any;
}

export default function Chat() {
  const { session } = useSession();

  const { readyState, sendMessage, latestMessage, connect } = useWebSocket(url, {
    reconnectLimit: 5,
    reconnectInterval: 3000,
  });

  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(2);
  const [loading, setLoading] = useState(false);

  useEffect(() => connect(), []);

  useEffect(() => {
    if (readyState !== ReadyState.Open) return;
    if (!session) return;

    const { id, email, name } = session;
    sendMessage(JSON.stringify({
      type: 'login',
      data: { id, email, name },
    }));
  }, [readyState]);

  useEffect(() => {
    if (readyState !== ReadyState.Open) return;

    if (latestMessage) {
      const data: MessageData = JSON.parse(latestMessage.data);

      if (data.type === 'onlineUsers') {
        const { data: messageData } = data;
        setOnlineUsers(messageData.users);
      } else if (data.type === 'chatHistory') {
        const { data: newMessages } = data;
        setMessages(pageNumber > 1 ? [...newMessages, ...messages] : newMessages);
        setLoading(false);
      } else if (data.type === 'newMessage') {
        const { data: message } = data;
        setMessages([...messages, message]);
      }
    }
  }, [latestMessage]);

  const handleSelectChat = (id: string) => {
    setSelectedChat(id);
  };

  const handleSendMessage = (message: string) => {
    if (!session) return;

    if (message.trim()) {
      const data = {
        token: session.token,
        user: session.id,
        content: message,
        parentId: null,
      };
      sendMessage(JSON.stringify({ type: 'chatMessage', data }));
    }
  };

  const handleLoadMore = useCallback(() => {
    setLoading(true);
    sendMessage(JSON.stringify({ type: 'chatHistory', data: { pageNumber } }));
    setPageNumber(pageNumber + 1);
  }, [pageNumber, sendMessage]);

  return (
    <div className="wrapper">
      <div className="app-container">
        <div className="app-container__menu">
          <Menu participants={onlineUsers} handleSelectChat={handleSelectChat} />
        </div>
        <div className="app-container__content">
          {selectedChat ? (
            <ChatRoom
              messages={messages}
              loading={loading}
              handleSendMessage={handleSendMessage}
              handleLoadMore={handleLoadMore}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                padding: '32px 20% 32px 32px',
                alignItems: 'center',
                fontSize: '1rem',
                fontWeight: 500,
              }}
            >
              Pick an existing conversation or create a new one to start chatting away.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
