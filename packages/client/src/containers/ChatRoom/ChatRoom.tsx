import { Message } from '@/types';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Input, Upload, message as antdMessage } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { CloseOutlined, DeleteOutlined, PaperClipOutlined, SendOutlined } from '@ant-design/icons';

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
  const [fileList, setFileList] = useState<UploadFile[]>([]);

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

  const handleFileChange = ({ fileList }: UploadChangeParam) => {
    if (fileList.length > 3) {
      antdMessage.error('You can only upload up to 3 files.');
      setFileList([]);
      return;
    }

    const filteredFileList = fileList.filter((file) => {
      const isImageOrText = file.type.startsWith('image/') || file.type === 'text/plain';
      if (!isImageOrText) {
        antdMessage.error('You can only upload image or text files.');
      }
      return isImageOrText;
    });

    setFileList(filteredFileList);
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
              <Upload
                multiple
                fileList={fileList}
                beforeUpload={() => false}
                onChange={handleFileChange}
                showUploadList={false}
              >
                <Button
                  icon={<PaperClipOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                  style={{ marginRight: '6px' }}
                  onClick={handleCreateMessage}
                />
              </Upload>
              <Input
                type="text"
                value={messageText}
                placeholder="Type a message"
                onChange={handleOnChangeMessage}
                onKeyDown={handleOnKeyDownMessage}
              />
              <Button
                shape="circle"
                type="primary"
                icon={<SendOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                style={{ marginLeft: '6px' }}
                onClick={handleCreateMessage}
              />
            </form>
          </div>
          {fileList.length > 0 && (
            <div className="chat-file-list">
              {fileList.map((file) => (
                <div key={file.uid} className="chat-file-list__item">
                  <p>{file.name}</p>
                  <Button
                    type="dashed"
                    shape="circle"
                    icon={<DeleteOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                    onClick={() => setFileList(fileList.filter((f) => f.uid !== file.uid))}
                  />
                </div>
              ))}
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
