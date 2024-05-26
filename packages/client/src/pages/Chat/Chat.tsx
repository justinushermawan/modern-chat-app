import { useState } from 'react';

import Menu from '@/containers/Menu/Menu';
import ChatRoom from '@/containers/ChatRoom/ChatRoom';

import './Chat.less';

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const handleSelectChat = (id: string) => {
    setSelectedChat(id);
  };

  return (
    <div className="wrapper">
      <div className="app-container">
        <div className="app-container__menu">
          <Menu handleSelectChat={handleSelectChat} />
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
