import type { OnlineUser } from '@/types';

import { useEffect, useState } from 'react';
import { useWebSocket } from 'ahooks';

import useSession from '@/hooks/useSession';
import Menu from '@/containers/Menu/Menu';
import ChatRoom from '@/containers/ChatRoom/ChatRoom';

import './Chat.less';
import { ReadyState } from 'ahooks/lib/useWebSocket';

const url = 'ws://localhost:8080';

export interface MessageData {
  type: 'onlineUsers' | '';
  data: any;
}

export default function Chat() {
  const { session } = useSession();

  const { readyState, sendMessage, latestMessage, connect } = useWebSocket(url, {
    reconnectLimit: 5,
    reconnectInterval: 3000,
  });

  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

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
      }
    }
  }, [latestMessage]);

  const handleSelectChat = (id: string) => {
    setSelectedChat(id);
  };

  return (
    <div className="wrapper">
      <div className="app-container">
        <div className="app-container__menu">
          <Menu participants={onlineUsers} handleSelectChat={handleSelectChat} />
        </div>
        <div className="app-container__content">
          {selectedChat ? (
            <ChatRoom />
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
