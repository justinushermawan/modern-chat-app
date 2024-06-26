import type { Message } from '@/types';

import React from 'react';
import { Button, Tooltip, Typography } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';

import useSession from '@/hooks/useSession';

import './ChatMessage.less';

interface Props {
  data: Message;

  handleReplyClick: (event: React.MouseEvent<HTMLElement>, message: Message) => void;
}

export default function Message({ data, handleReplyClick }: Props) {
  const { user, content, replies, parent, files, createdAt } = data;

  const { session } = useSession();

  const isReply = parent !== null;

  const isMe = user._id === session?.id;
  const messageType = isMe && !isReply ? 'sent' : 'received';

  return (
    <div className={`message ${messageType}`}>
      <div>
        <div className={`message__content${isReply ? ' reply' : ''}`}>
          <div className="message__content__sender">{isMe && isReply ? 'You' : user.name}</div>
          <div className="message__content__text">{content}</div>
          <p className="message__content__at">
            {new Date(createdAt).toLocaleString()}
          </p>
          {files && (
            <div className="message__content__files">
              {files.map((file) => (
                <Typography.Link
                  key={file.fileId}
                  href={`data:application/octet-stream;base64,${file.data}`}
                  download={file.fileName}
                >
                  {file.fileName}
                </Typography.Link>
              ))}
            </div>
          )}
        </div>
        {replies.length > 0 && (
          <div
            className="message__replies"
            style={{ paddingLeft: '12px' }}
          >
            {replies.map((reply) => (
              <Message
                key={reply._id}
                data={reply}
                handleReplyClick={handleReplyClick}
              />
            ))}
          </div>
        )}
      </div>
      <Tooltip title="Reply">
        <Button
          shape="circle"
          icon={<RollbackOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
          style={{ margin: '0 8px' }}
          onClick={(event) => handleReplyClick(event, data)}
        />
      </Tooltip>
    </div>
  );
}
